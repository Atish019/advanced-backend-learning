# Day 3 — File System, Libuv, and the Event Loop

## 1. File System in Node.js
Node.js uses the fs module to work with files. Common operations include reading, writing, appending, deleting, and renaming files.

## 2. Synchronous vs Asynchronous I/O
- Synchronous operations block execution until completed.
- Asynchronous operations allow the program to continue running while I/O is in progress.

This is one of the main reasons Node.js is efficient for I/O-heavy workloads.

## 3. Libuv Library
Libuv is a core library used by Node.js to provide platform-independent asynchronous I/O. It handles:
- File system operations
- Networking
- Timers
- Thread pool work

## 4. Handles and Requests in Libuv
Libuv uses two important concepts:
- Handles: long-lived objects such as timers and sockets.
- Requests: one-time operations such as file reads or writes.

These components help Node manage asynchronous work efficiently.

## 5. How the Event Loop Works
The event loop is the mechanism that allows Node.js to manage multiple asynchronous operations without blocking the main thread.

### Main Phases
- Timers phase
- Pending callbacks phase
- Idle/prepare phase
- Poll phase
- Check phase
- Close callbacks phase

## 6. Promises, Timers, and Ticks
Node.js execution order depends on the interaction of:
- Timers
- Promises
- process.nextTick()
- Microtasks and macrotasks

### Important Rule
- process.nextTick() runs before other microtasks.
- Promises are processed as microtasks.
- Timers belong to the macrotask queue.

## 7. Macrotasks and Multiple Queues
A macrotask can be thought of as a larger task bucket that includes multiple queues such as timers and I/O callbacks. Understanding these queues is essential for predicting the execution order of asynchronous code.

## 8. Verified from This Project
The examples in [demo_1.js](../../demo_1.js), [demo_2.js](../../demo_2.js), [demo_3.js](../../demo_3.js), and [demosample.js](../../demosample.js) show how timers, promises, and nextTick interact in Node.js.
