# Chapter 09 — Database Design and LSM Trees

This chapter explores the fundamental data structures and design patterns behind modern key-value stores and databases, particularly focusing on Log-Structured Merge (LSM) trees, a widely-used architecture in systems like RocksDB, Cassandra, and DynamoDB.

## Initial Requirements for a Database
To design an efficient database, we need to consider:
- **Fast reads**: Retrieve data quickly without disk seeks.
- **Fast writes**: Insert/update data efficiently (worst-case bounded latency).
- **Durability**: Ensure data survives system crashes.
- **Unstructured data**: Handle flexible, schema-less data.
- **Scale to terabytes**: Manage large datasets efficiently.

## 1. Understanding RDBMS Schema

In traditional relational databases, we define a schema upfront:

**Example: Product Table**
```
- primary → id (4 bytes)
- name → VARCHAR (variable, ~8 bytes)
- price → FLOAT (8 bytes)
- rating → FLOAT (8 bytes)
```

Total size per product record: ~28 bytes

### Key Concept: Fixed Schema
- **Database knows exact data size**: The database can calculate exactly where the next record starts.
- **Ordering**: Data is organized by ID, enabling efficient lookups.
- **Why reads are fast**: Because of fixed schema and defined size, the database knows exactly where to find each record on disk.

## 2. Why Reading is Expensive

### Sequential vs. Random Reads
- **Sequential reads**: Faster—adjacent blocks are read efficiently from disk/SSD.
- **Random reads**: Slower—each lookup can require a disk seek (10-20+ ms on HDD, sub-ms on SSD, microseconds in RAM).

At scale:
- **RAM access**: ~100ns (nanoseconds)
- **SSD random read/write**: ~1-10 ms
- **HDD random access**: ~10-20+ ms

### The Challenge
Even with indexes, traditional databases can struggle with:
- High write throughput (especially on HDDs due to random seeks).
- Hot data that doesn't fit in cache.
- Compaction processes that can interfere with ongoing reads.

## 3. Write-Ahead Logs (WAL)

### Why Use WAL?

Write-Ahead Logs solve the durability problem:

1. **Append-only nature**: WAL files are written sequentially, which is much faster than random writes.
2. **Fast writes**: Even on disk, sequential writes are orders of magnitude faster than random writes (e.g., 100 MB/s+ vs. 1 MB/s for random).
3. **Crash recovery**: If the system crashes, we can replay the WAL to reconstruct the state.

### How WAL Works

```
Operation: SET (key=user:123, value={name: "Alice", age: 30})
           ↓
    Write to WAL (append-only) — O(1) disk operation
           ↓
    Optionally update in-memory structure
           ↓
    Return success to client (optional fsync for durability)
```

### WAL in RDBMS
- Most modern RDBMs (MySQL, PostgreSQL, etc.) use WAL as part of their data storage.
- Example: PostgreSQL's Write-Ahead Log (WAL) file format stores all writes before updating the heap.

## 4. In-Memory Structure: Memtable

The Memtable is the first stop for writes:

1. **Fast in-memory write**: New key-value pairs are inserted into a balanced tree or hash structure in RAM.
2. **Low latency**: Reads from memtable are ~1000x faster than disk reads.
3. **Small size**: Memtables are kept small (typically 2-3 tables in RAM at once), so they fit entirely in memory.

### Memtable Design
```
Memtable (in RAM)
┌─────────────────────────────────┐
│  Balanced Tree Structure         │
│  (e.g., Red-Black Tree, B-tree) │
│                                  │
│  Sorted by key                   │
│  Fast lookup, insert, delete     │
└─────────────────────────────────┘
```

When the memtable reaches a threshold (e.g., 64 MB):
- **Flush to disk**: Convert to an immutable on-disk structure called SSTable.

## 5. SSTables (Sorted Set Tables)

An SSTable is an immutable, sorted file on disk containing key-value pairs.

### Properties of SSTables
- **Sorted by key**: All entries are ordered by key, enabling efficient range queries.
- **Immutable**: Once written, SSTables never change. This simplifies concurrency.
- **Read-optimized**: Binary search can find any key in O(log n) disk seeks.
- **Small files**: Multiple small SSTables are easier to manage than one huge file.

### Structure of an SSTable

```
┌────────────────────────────┐
│  Header                    │
├────────────────────────────┤
│  Data Block 1              │
│  (key-value pairs, sorted) │
├────────────────────────────┤
│  Data Block 2              │
├────────────────────────────┤
│  Index Block               │
│  (key offsets for binary   │
│   search within file)      │
├────────────────────────────┤
│  Bloom Filter              │
│  (probabilistic presence   │
│   test for fast misses)    │
├────────────────────────────┤
│  Footer (metadata)         │
└────────────────────────────┘
```

### Reading from SSTable

**Example: Find key `user:456`**

1. Check **Bloom Filter**: "Is this key possibly in this SSTable?" (O(1) RAM hit).
   - If absent: Skip this SSTable entirely.
   - If possibly present: Continue.

2. **Binary search the index** to find the SSTable's location: O(log n) RAM.

3. **Read the data block** from disk at the identified offset: O(1) disk seek.

4. **Return the value**.

Reads from SSTable are fast because:
- Bloom filter eliminates misses early.
- Index enables binary search without reading the entire file.
- Data is sorted, so we can use efficient seeking.

## 6. Bloom Filters

A Bloom filter is a probabilistic data structure for testing whether an element is a member of a set.

### Properties
- **Space-efficient**: Uses a bit array, not full data storage.
- **Fast**: O(1) lookup with a few hash function calls.
- **False positives allowed**: Might say "possibly present" when it's absent (rare).
- **No false negatives**: If it says "absent," it's definitely absent.

### Why Use Bloom Filters in Databases?
- Avoid reading SSTables for keys that don't exist.
- Example: If a key is not in the Bloom filter, we skip checking that SSTable entirely, saving disk I/O.

## 7. Sparse Index

A sparse index doesn't store every key; instead, it stores **starting keys of each block** along with their offsets on disk.

### Example

```
SSTable File Structure:
┌─────────────────────┬─────────────────────┬──────────────┐
│  Block 1            │  Block 2            │  Block 3     │
│  Keys: a...f        │  Keys: g...m        │  Keys: n...z │
└─────────────────────┴─────────────────────┴──────────────┘

Sparse Index (kept in RAM for binary search):
┌──────────────────────────────────┐
│  Key: "a"  → Offset: 0(1) disk   │
│  Key: "g"  → Offset: 0(1) disk   │
│  Key: "n"  → Offset: 0(1) disk   │
└──────────────────────────────────┘

Search for "k":
  Binary search on sparse index → "k" is >= "g" but < "n"
  → Read Block 2
```

## 8. Compaction (Procedure to Remove Duplicates)

Over time, multiple SSTables accumulate. Compaction merges them to:
- Remove duplicate/stale entries.
- Reclaim disk space.
- Improve read performance (fewer SSTables to check).

### How Compaction Works

**Step 1: Flush Memtable as a New SSTable**
```
Active memtable (in RAM) → New immutable SSTable (on disk)
```

**Step 2: Maintain Offset Hashmap**
```
Offset Hashmap (in RAM):
┌─────────────────────────────────┐
│  key: user:123 → {               │
│    latest_wal_file: wal-0001    │
│    offset_in_wal: 512            │
│  }                               │
└─────────────────────────────────┘
```

**Step 3: Compaction Process**

```
Take 2 SSTables (sorted by key)
        ↓
Load in RAM & remove duplicates
        ↓
Keep latest entry for each key (discard old)
        ↓
Merge into 1 combined SSTable
        ↓
Write combined SSTable to disk
        ↓
Delete old SSTables
```

### Compaction Strategy

```
Level 0:  [SSTable-1] [SSTable-2] [SSTable-3]
          (multiple can overlap)
          
          ↓ (compact when count exceeds threshold)
          
Level 1:  [Combined SSTable]
          (sorted, no overlaps)
          
          ↓ (compact when size exceeds threshold)
          
Level 2:  [Another Combined SSTable]
```

**Note**: SSTables are immutable, so we can only create it and search on it, not update. Compaction allows us to eventually clean up old data.

## 9. When to Add Data to Offset Hashmap

### Key Decision: Timing of Hashmap Updates

**Option A: Immediate Write (During Append to WAL)**
```
Write key-value pair to WAL file → Immediately add to offset hashmap
Problem: High overhead, compaction can work on old files
```

**Option B: After WAL is Full**
```
When WAL reaches max size → Dump all data in a new file → Update hashmap
Advantage: Batch updates, reduces hashmap update frequency
Disadvantage: Larger WAL files; latest data stays in WAL longer
```

### Best Practice
- Once your WAL file becomes inactive (no more writes), dump its data into an arrayed form.
- Store unique keys in sorted order to optimize for searches.
- The key advantage: Unique keys from memtable + sorted data = faster searches without full table scans.

**Compaction Timing**:
- All write operations happen in the active WAL file.
- Reads can happen in any WAL file.
- When no space is left, trigger compaction on old files.

## 10. How Updates Work

When updating an existing key:

1. **Mark as new entry in memtable**: Don't override existing data; add a new entry with a sentinel value (like `{sentinel: <value>}` or a special marker).

2. **Append to WAL**: Write the update to the active WAL file with a timestamp.

3. **Set in Hashmap**: Record the key with the WAL file and offset.

4. **During compaction**:
   - If multiple entries exist for the same key, keep the latest one (identified by timestamp or order).
   - Discard older entries.

### Read Optimization with LRU Cache

If a key is frequently accessed, an LRU cache can be maintained for faster retrieval:

```
Cache (in-memory LRU):
├─ For frequently accessed keys, maintain a hashmap of data & address node
├─ If a key is accessed, move its node to the "hot" end
├─ When cache is full, evict the least-recently-used item
└─ Searches are O(1) with LRU optimization on reads
```

## 11. Handling Duplicates Across Multiple Levels

### Problem
- Within a single SSTable: No duplicates (immutable, sorted).
- Between multiple SSTables: Duplicates can exist (newer SSTable might have updated value).

### Solution
Maintain a **priority order**:
1. Check memtable first.
2. Check Level 0 SSTables (newest).
3. Check Level 1 SSTables.
4. And so on (older levels).

This way, the latest value is always found first.

## 12. Support for Partitioning and Sharding

SSTables work well with sharding because:
1. **Immutable data**: No cross-server consistency issues during splits.
2. **Easy replication**: Copy SSTables to replicas; all are identical.
3. **Data locality**: Each server holds a subset of partitioned keys.
4. **Faster recombination**: Merging sorted SSTables is like merge-sort.

### Architecture with Sharding
```
Master Node (writes)
       ↓
Write to WAL & Memtable
       ↓
Flush to SSTable
       ↓
Replicate to Replica Nodes (read-only)
       ↓
Each node: Independent
       ↓
compaction & LRU cache
```

## 13. LSM Trees in Action (RocksDB, Cassandra, DynamoDB)

### RocksDB (Embedded Key-Value Store)
- Used in Facebook's data infrastructure.
- Built on LSM tree principles with configurable compaction strategies.

### Cassandra (Distributed Database)
- Uses SSTable format for immutable data.
- Compaction happens periodically to reclaim disk space.

### DynamoDB (AWS Managed Service)
- Internally uses LSM-like structures for high throughput on SSD.

### Why LSM Over B-trees?
- **B-trees**: Optimized for random reads; writes require random disk I/O (slow).
- **LSM**: Optimized for sequential writes; reads trade off for write throughput.

In modern systems with high write throughput, LSM trees are preferred.

## 14. Practical Design Choices

### When to Use WAL
- **Always**: Durability is critical. WAL ensures no data loss even after a crash.
- Overhead: Sequential writes are fast, minimal performance penalty.

### When to Use SSTables
- **Always**: Immutable files simplify concurrency and compaction.
- Alternative: In-memory only (loses durability; use for caches).

### When to Use Bloom Filters
- **Optimize read performance**: When negative lookups are common (keys that don't exist).
- Space cost: ~1 byte per key, negligible compared to savings.

### When to Use LRU Caching
- **Hot working sets**: Cache the top 1-5% of frequently accessed keys.
- Memory limit: Keep cache size bounded to prevent OOM.

## 15. Design Patterns Summary

```
┌────────────────────────────────────────────────────┐
│         Database Design Pattern (LSM)              │
├────────────────────────────────────────────────────┤
│  Write Path:                                       │
│  User Data → WAL (durability) → Memtable (fast)   │
│             ↓                                      │
│  Memtable Full? → Flush to SSTable (immutable)    │
│                                                    │
│  Read Path:                                        │
│  LRU Cache? → Memtable? → SSTables (bloom + idx)  │
│                                                    │
│  Background:                                       │
│  Compaction (merge SSTables, remove stale data)   │
└────────────────────────────────────────────────────┘
```

**Note**: This chapter is based on handwritten notes analyzing modern database internals. The concepts apply to any system dealing with high-throughput writes and consistent reads at scale.