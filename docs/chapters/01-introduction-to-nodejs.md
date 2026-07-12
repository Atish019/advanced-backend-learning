# Chapter 1: Node.js Introduction

## 1. What is Node.js?
Node.js is a JavaScript runtime built on the V8 engine that allows developers to execute JavaScript outside the browser. It is widely used for building backend applications, APIs, real-time systems, and command-line tools.

## 2. Why Node.js is Popular
- Fast execution because it uses the V8 engine.
- Non-blocking and event-driven architecture.
- Excellent for I/O-heavy applications such as APIs and chat systems.
- Huge ecosystem through npm.

## 3. V8 Engine
The V8 engine is the core execution engine used by Node.js. It performs several important tasks:

### Parser
- Converts JavaScript source code into an abstract syntax tree (AST).

### Interpreter
- Executes code quickly at the beginning using bytecode.

### Compiler
- Optimizes hot code paths using Just-In-Time (JIT) compilation.

### Garbage Collection
- V8 manages memory automatically.
- It uses garbage collection to reclaim memory that is no longer referenced.
- This helps prevent memory leaks and improves runtime stability.

## 4. Context Switching
Context switching means changing from one execution context to another. In JavaScript runtime terms, it refers to moving between tasks, callbacks, or execution states efficiently. Node handles this through its event loop and scheduling model.

## 5. Client-Server Architecture
A typical web application follows a client-server model:
- The client sends a request.
- The server processes it.
- The server sends back a response.

Node.js is commonly used on the server side to handle these requests efficiently.

## 6. Why This Chapter Matters for Backend Development
Understanding the runtime, execution model, and architecture of Node.js helps developers write faster, more scalable server applications.

## 7. Verified from This Project
The project examples in [demo_1.js](../../demo_1.js), [demo_2.js](../../demo_2.js), and [demo_3.js](../../demo_3.js) demonstrate how asynchronous execution and runtime behavior work in practice.
