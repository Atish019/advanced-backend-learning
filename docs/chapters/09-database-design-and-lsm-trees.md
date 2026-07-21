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
