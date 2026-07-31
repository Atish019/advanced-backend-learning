# Day 2 — Globals, Modules, and Thread Behavior

## 1. Global Objects in Node.js
Node.js provides several important globals:
- __dirname: gives the directory path of the current module.
- require(): used to include code from other files.
- process: provides information about the current process.
- module: contains metadata about the current module.

## 2. What is a Module?
A module is a reusable piece of code that can be imported into another file. Modules help organize code and separate responsibilities.

## 3. CommonJS vs ES Modules
### CommonJS
- Uses require() to import.
- Uses module.exports or exports to export values.
- Common in older Node.js projects.

### ES Modules
- Uses import and export.
- Follows modern JavaScript syntax.
- Requires "type": "module" in package.json when used in Node.js.

## 4. Thread Behavior of Node.js
Node.js is often described as single-threaded, but that statement is incomplete.
˜
### Important Concept
- The main JavaScript execution happens on a single event loop thread.
- Node uses additional threads internally for certain operations such as file system work and network I/O.
- For CPU-intensive tasks, Node may need worker threads, clustering, or separate processes.

## 5. Case Study: Apache vs NGINX
### Apache Web Server
Apache is a traditional web server that has historically used processes or threads to handle requests. It is flexible but can use more memory under heavy traffic.

### NGINX Web Server
NGINX uses an event-driven architecture and can handle many concurrent connections with less resource usage. It is often preferred for high-performance reverse proxy and load balancing scenarios.

### Learning Links
- Apache HTTP Server: https://httpd.apache.org/
- NGINX: https://nginx.org/

## 6. High I/O vs High Process
- High I/O applications are well suited to Node.js because they spend time waiting for network or disk operations.
- High CPU or heavy computation tasks are not ideal for the main event loop and may need worker threads or external services.

## 7. Verified from This Project
The examples in [NodeJS_Modules/globals-In-Node.js](../../NodeJS_Modules/globals-In-Node.js), [NodeJS_Modules/math.js](../../NodeJS_Modules/math.js), and [NodeJS_Modules/ES_modulingdemo/index.js](../../NodeJS_Modules/ES_modulingdemo/index.js) demonstrate module behavior and global usage in Node.js.
