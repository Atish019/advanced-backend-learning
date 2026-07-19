# Chapter 08 — Latency, Storage, and Scaling

This chapter is a concise, practical summary of latency, storage, and scaling concepts based on my handwritten notes.

## What is latency
- Latency is the total time (delay) experienced from the start of a request until the response is received.
- Latency matters for user experience and system design; low latency often requires trading off durability, throughput, or cost.

## Factors contributing to latency
1. External (network) delay
   - Cross-continent calls (e.g., USA ↔ India) commonly add ~100–200 ms RTT. A typical global RTT can be ~150 ms.
   - Within a country: depending on ISPs and routing, delays can vary from ~20 ms up to ~100 ms.
   - In a small region or same city, RTTs can be as low as 1–50 ms.

2. Internal (server) delay
   - Time to access storage (disk/SSD/RAM).
   - CPU time (usually small compared to I/O, but can matter under load).

## Storage types and their impact
- Primary (hot) storage: RAM — fastest for reads/writes, ideal for caching frequently-used data.
- Secondary (persistent) storage: SSD and HDD.
  - HDDs are much slower than SSDs (orders of magnitude difference for random I/O).
  - SSDs are faster, but writes can still be more expensive than reads.

Read patterns
- Sequential reads: faster — adjacent blocks are read efficiently from disk/SSD.
- Random reads: slower — data may be scattered across disk sectors/blocks, causing extra seeks or internal NAND page access.

Caching and memory
- Caching data in RAM reduces latency significantly. Even a modest in-memory cache can turn many-millisecond disk accesses into microsecond-class reads.
- Keep hot working sets in RAM when low latency is required; use caches (L1/L2/L3 here are conceptual tiers: in-process cache, shared cache, and remote caches).

Practical numbers (order-of-magnitude)
- Cross-continent RTT: ~100–200 ms
- Regional RTT: ~10–50 ms
- SSD random read/write: sub-ms to a few ms (depends on device)
- HDD random access: tens of ms
- RAM access: sub-ms (microseconds)

## Simple capacity and throughput examples
- Convert bulk counts into rates to reason about system sizing:
  - Example: if a system processes 3×10^13 transactions in a quarter (≈90 days), average daily transactions ≈ 3×10^13 / 90 ≈ 3.3×10^11 per day. Convert to QPS: 3.3×10^11 / (24*3600) ≈ 3.8×10^6 QPS (average).
  - Example: 10^8 requests per day → QPS ≈ 10^8 / 86400 ≈ 1157 QPS.

Note: these are average rates; capacity planning must account for peak load (spikes), replication, retries, and growth.

## Vertical vs Horizontal scaling
- Vertical scaling: increase resources on a single machine (more CPU, RAM, faster SSD). Simpler but limited by max machine size and has a single point of failure.
- Horizontal scaling: add more machines (sharding, partitioning, stateless replicas). More complex but offers better fault tolerance and near-unbounded capacity when designed well.

When to use which
- Start with vertical scaling for small systems or MVPs; move to horizontal scaling when you hit capacity limits or need higher availability.

## Design notes for a tiny social app (practical takeaways)
- Keep hot metadata (recent posts, timeline pointers) in memory or a fast cache to serve low-latency reads.
- Use append-only storage for posts and background jobs to build secondary indexes for feeds.
- Prefer read-optimized replicas for high-read workloads (serve reads from replicas; writes go to a primary or use a log-based approach).

## Links to runnable examples in this repo
- TCP socket demo (Node.js): [Networking_Basics/tcp/server.js](../../Networking_Basics/tcp/server.js)
- TCP socket demo (Node.js) client: [Networking_Basics/tcp/client.js](../../Networking_Basics/tcp/client.js)

