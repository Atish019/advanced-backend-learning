# Day 9 — Database Design and LSM Trees

End-to-end design of modern high-throughput databases and Log-Structured Merge (LSM) trees, from fundamental principles to complete architecture.

---

## 1. Initial Database Requirements & RDBMS Limitations

### Core System Requirements
When designing a large-scale database system, we target five key properties:
1. **Fast Reads**: Microsecond to low-millisecond lookup latency.
2. **Fast Writes**: High write throughput with bounded latency (most critical for modern applications).
3. **Durability**: Zero data loss during process crashes or power failures.
4. **Unstructured / Schema-less Data**: Ability to handle heterogeneous key-value payloads.
5. **Petabyte-Scale Storage**: Horizontal and vertical scalability across large datasets.

---

### Storage Mechanics: RDBMS vs. NoSQL

#### RDBMS (Fixed Schema Model)
In traditional relational databases (e.g., MySQL, PostgreSQL), schema structure and data types are defined upfront.

- **Product Table Example**:
  - `id` (Primary Key) $\rightarrow$ 8 bytes
  - `name` $\rightarrow$ 60 bytes
  - `price` $\rightarrow$ 8 bytes
  - `rating` $\rightarrow$ 8 bytes
  - **Total Row Size** = $8 + 60 + 8 + 8 = 84\text{ bytes}$

```
HDD Storage Layout (Fixed Schema):
┌──────────────────┬───────────────────────┬──────────────┬───────────────┐
│ id (8B)          │ name (60B)            │ price (8B)   │ rating (8B)   │
└──────────────────┴───────────────────────┴──────────────┴───────────────┘
|<------------------------------- 84 Bytes ------------------------------>|
```

- **Why RDBMS Reads/Updates Are Fast**:
  - **Fixed Offset Jumping**: To read row $N$, jump directly to byte offset $\text{Start} + (N \times 84)$.
  - **In-Place Overwrites**: Updating a column modifies fixed bytes at a known offset without altering the total row length.

---

#### NoSQL / Key-Value (Schema-less Model)
NoSQL stores values of variable types and sizes (numbers, strings, JSON blobs).

```
HDD Byte Representation (Schema-less Grid):
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ i │ p │ h │ o │ n │ e │ 1 │ 1 │ x │ x │ 4 │ . │ 8 │ i │ p │ ...
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
                                        |<─ 4B ─>|
```

- **In-Place Update Failure**:
  If key `"macbook"` with value `4.9` (4 bytes) is updated to `"Apple"` (5 bytes):
  $$\text{set}("macbook") \rightarrow "Apple" \quad (5\text{ Bytes})$$
  Overwriting in-place corrupts adjacent data blocks because the new payload exceeds the allocated space.

---

## 2. Update Strategies & Evolution to Hashmap Offsets

To handle variable-length updates in key-value stores, two initial approaches exist:

### Strategy 1: Data Splitting with Pointers
- Write payload until space runs out, split the remainder, and write a pointer to the overflow block.
- **Drawback**: Causes severe disk fragmentation, resulting in multiple random disk seeks per read.

### Strategy 2: Append-Only Writes with End-to-Start Scan
- Never overwrite existing data. Append all updates to the end of the disk file.
- **Drawback**: Read operations require an $O(n)$ linear scan from the end of the file.

---

### Optimized Solution: Append-Only File + RAM Hashmap
Combine append-only disk writes with an in-memory index mapping keys to disk offsets:

```
HDD (Append-Only Log File):
Offset a: iphone11 : 4.9
Offset b: iphone12 : 4.7
Offset c: macbook   : 4.8
Offset d: magsafe   : 3.2
Offset e: macbook   : 'apple'  (Latest update appended)

RAM (In-Memory Hashmap):
┌───────────┬───────────────┐
│ Key       │ Disk Offset   │
├───────────┼───────────────┤
│ iphone11  │ offset a      │
│ iphone12  │ offset b      │
│ macbook   │ offset e      │  <-- (Pointer updated to offset e)
│ magsafe   │ offset d      │
└───────────┴───────────────┘
```

- **Execution Complexity**:
  - **Read Path**: $O(1)$ RAM Hashmap lookup $\rightarrow$ $O(1)$ direct HDD offset seek.
  - **Write Path**: $O(1)$ append to disk $\rightarrow$ $O(1)$ hashmap pointer update.
  - Performance is **~100x faster for reads** and **~105x faster for writes** compared to random disk I/O.

- **Limitations of Single-File Hashmap Approach**:
  1. **RAM Footprint**: Millions/billions of unique keys ($10^9$ keys) exhaust system memory.
  2. **Disk Growth**: Old superseded entries accumulate indefinitely on disk.
  3. **Volatility**: RAM hashmap is lost on crash and must be rebuilt by scanning the entire disk file.

---

## 3. The Write-Ahead Log (WAL) Architecture

### Purpose & Performance Advantage
An append-only log file used for durability and fast writes is called a **Write-Ahead Log (WAL)**.

- **RDBMS Comparison**:
  In SQL databases, updating indexed tables ($B^+$ Trees) requires $\log n$ random disk seeks per write. SQL systems use a WAL to record writes sequentially first ($O(1)$ I/O) before batch-updating $B^+$ Tree indexes in memory.

```
SQL DB Write Paths:
Write Request ──► Append to WAL (Sequential O(1) Disk Write) ──► Fast Ack
                         │
                         ▼ (Deferred Batch)
                  Update B+ Tree Index (Log N Random Seeks)
```

---

### Multi-File Chunked WAL Strategy
Rather than maintaining a single monolithic WAL file:
1. Divide the log into smaller fixed-size chunks (e.g., **100 MB per WAL file**).
2. Store key location as `(Key, WAL_File_ID, Offset)` in the RAM index.
3. **Active WAL**: Receives all incoming write operations.
4. **Inactive WALs**: Closed files that serve read requests and undergo background compaction.

```
Write Operations ──► Active WAL (wal-0002.log) ──► Append O(1)
                            │
                      (Full > 100MB)
                            ▼
              Rotate to Inactive WAL ──► Eligible for Compaction
```

---

## 4. Memtable Architecture

The **Memtable** is an in-memory sorted data structure (such as a Red-Black Tree or SkipList) that acts as the RAM representation of the active WAL.

```
Dual Write Pattern:
Write Request ──┬──► Write to Memtable (RAM: Fast, Sorted, Unique Keys)
                │
                └──► Append to Active WAL (Disk: Durability & Recovery)
```

### Why Memtable in RAM?
1. **Instant Writes & Reads**: Avoids disk pointer overhead and in-place update limitations.
2. **Key Uniqueness**: Keeps only unique keys or latest values in memory.
3. **Prepared Flush**: Naturally maintains keys in sorted order, simplifying disk flushes.

---

## 5. SSTables (Sorted Set Tables) & Flush Workflow

When an active WAL / Memtable reaches its size limit (e.g., 100 MB), it is converted into an **SSTable (Sorted Set Table)**.

### SSTable Characteristics
- **Sorted**: Keys are stored in strictly ascending sorted order.
- **Set**: Duplicate keys are removed during the flush; only unique values are written.
- **Immutable**: Once written to disk, an SSTable is never modified.

```
Memtable (RAM, Sorted) ──► Flush to Disk ──► New SSTable (Immutable, Sorted, Unique)
                                                    │
                                                    ▼
                                           Clear Active WAL & Reset Memtable
```

### Memtable Eviction & Memory Control
Memtables operate within bounded memory limits. When full, an eviction policy (LRU / LFU / FIFO) manages memory state while data persists safely inside immutable SSTables on disk.

---

## 6. Multi-Level Background Compaction

Over time, multiple SSTables accumulate, causing duplicate entries across different file generations and increasing read latency.

### Compaction Mechanics
Compaction runs continuously in background threads to merge multiple SSTables using a **K-Way Merge Sort**:

```
SSTable 1 (Sorted): [ key_a: v1, key_c: v1, key_e: v1 ]
SSTable 2 (Sorted): [ key_a: v2, key_c: v2, key_f: v1 ]
                             │
                             ▼ (Merge-Sort & Deduplicate)
New SSTable (Sorted): [ key_a: v2, key_c: v2, key_e: v1, key_f: v1 ]
```

1. Load 2 or more SSTables into RAM buffers.
2. Merge sorted arrays while maintaining the **newest entry** for duplicate keys and discarding older values.
3. Write the merged result as a single consolidated SSTable.
4. Delete old input SSTables from disk.

### Hierarchical Compaction Tree

```
Level 0 (Uncompacted):  [ SSTable 1 ]  [ SSTable 2 ]  [ SSTable 3 ]
                             └──────────────┬──────────────┘
                                            ▼ (Background Compaction)
Level 1 (Merged):               [ SSTable 1_2_3 (Larger, Sorted) ]
```

- **Non-Blocking Writes**: Compaction operates strictly on inactive SSTables in the background, allowing incoming writes to active WAL/Memtable without locking.

---

## 7. Sparse Indexing & Elimination of Global Hashmaps

As dataset size grows into terabytes/petabytes, maintaining a global RAM hashmap for every key becomes infeasible.

### Sparse Index Concept
Instead of indexing every single key, a **Sparse Index** stores only the **first key of each disk block** alongside its block offset.

```
Disk Storage (SSTable Blocks):
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│ Block 1 (Keys: "a".."f") │ Block 2 (Keys: "g".."m") │ Block 3 (Keys: "n".."z") │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
Offset 0x0000              Offset 0x1000              Offset 0x2000

RAM (Sparse Index):
┌───────────┬───────────────┐
│ Key       │ Block Offset  │
├───────────┼───────────────┤
│ "a"       │ 0x0000        │
│ "g"       │ 0x1000        │
│ "n"       │ 0x2000        │
└───────────┴───────────────┘
```

### Search Process with Sparse Index
To locate key `"k"`:
1. Binary search the RAM Sparse Index: `"k"` falls between `"g"` (0x1000) and `"n"` (0x2000).
2. Load only **Block 2** from disk into memory.
3. Perform a fast in-memory binary search within Block 2.
4. Reduces disk lookups from $O(\log N)$ file seeks down to a single targeted block read.

---

## 8. Bloom Filters & Deletion Sentinels (Tombstones)

### Bloom Filters for Fast Negative Lookups
Checking multiple SSTables on disk for a non-existent key causes wasteful disk I/O.

- A **Bloom Filter** is a probabilistic, space-efficient data structure stored alongside each SSTable in RAM.
- **Behavior**:
  - Returns **"Definitely Not Present"**: Skip reading the SSTable completely ($O(1)$ savings).
  - Returns **"Possibly Present"**: Proceed to read the Sparse Index and SSTable block.

---

### Deletion Handling via Sentinel Values (Tombstones)
Because SSTables are immutable, key deletion cannot remove data in-place on disk.

1. **Delete Operation**: Insert a new record for the key with a **Sentinel Value (Tombstone)**.
2. **Read Path**: If a query encounters a Sentinel Value, it returns `null` / key not found.
3. **Compaction Purge**: During background merge compaction, when a Sentinel Value is encountered alongside older entries for that key, all occurrences are permanently removed.

---

## 9. End-to-End LSM Tree Architecture

```
                                  WRITE PATH
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ Incoming Write Request    │
                        └─────────────┬─────────────┘
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
     ┌─────────────────────────┐             ┌─────────────────────────┐
     │ Append to Active WAL    │             │ Update Memtable         │
     │ (Disk, Durability)      │             │ (RAM, Sorted SkipList)  │
     └─────────────────────────┘             └────────────┬────────────┘
                                                          │
                                                (Memtable Full / Flushed)
                                                          ▼
                                             ┌─────────────────────────┐
                                             │ Write SSTable to Disk   │
                                             │ (Sorted, Immutable)     │
                                             └────────────┬────────────┘
                                                          │
                                                          ▼
                                             ┌─────────────────────────┐
                                             │ Background Compaction   │
                                             │ & Bloom Filter Build    │
                                             └─────────────────────────┘

----------------------------------------------------------------------------------

                                  READ PATH
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ Incoming Read Request     │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                           Check Memtable (RAM)
                                      │
                            [Hit] ───►┴───► [Miss]
                              │                │
                        Return Value           ▼
                                    Check Bloom Filter
                                               │
                                     [No] ─────┴─────► [Yes]
                                      │                 │
                                Skip SSTable            ▼
                                              Check Sparse Index (RAM)
                                                        │
                                                        ▼
                                              Read Block from SSTable
                                                        │
                                                        ▼
                                                   Return Value
```

---

### Summary of System Trade-Offs

| Component | In-Memory (RAM) | On-Disk (HDD/SSD) | Time Complexity | Primary Role |
| :--- | :--- | :--- | :--- | :--- |
| **Active WAL** | ❌ No | ✅ Yes | $O(1)$ Write | Durability & crash recovery log |
| **Memtable** | ✅ Yes | ❌ No | $O(\log N)$ Read/Write | Fast active write buffer & latest reads |
| **SSTables** | ❌ No | ✅ Yes | $O(\log N)$ Binary Search | Immutable, sorted persistent storage |
| **Sparse Index** | ✅ Yes | ❌ No | $O(\log B)$ RAM Lookup | Maps key ranges to SSTable block offsets |
| **Bloom Filter** | ✅ Yes | ❌ No | $O(1)$ RAM Hit/Miss | Prevents disk seeks for missing keys |
| **Tombstone** | ✅ Yes | ✅ Yes | $O(1)$ Append | Marks key deletion for compaction purge |