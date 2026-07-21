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