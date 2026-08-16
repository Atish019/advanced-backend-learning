# Day 16 — Building HTTP Servers: Native HTTP Module vs Basic Express Server

A detailed, comprehensive technical breakdown of building HTTP servers in Node.js, comparing the native `http` module (`PLAN-IN-RESTAPI/index.js`) and the Express.js framework (`BasicExpressServer/index.js`). This note covers server initialization, request listener callbacks, HTTP method routing (`GET`, `POST`, `PUT`, `DELETE`), custom routes (`/users`), status codes (`201 Created`), and response mechanisms (`res.end()` vs `res.send()`).

---

## 1. Overview & Architectural Progression

In backend development with Node.js, there are two primary ways to create an HTTP server:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Node.js HTTP Servers                                   │
├───────────────────────────────────────────┬──────────────────────────────────────────────┤
│ 1. Native HTTP Module                     │ 2. Express.js Framework                      │
│ • Built-in to Node.js runtime             │ • External package (npm install express)     │
│ • Manual request handling callback        │ • Method-based routing (app.get, app.post)   │
│ • Low-level req/res stream manipulation   │ • Abstrates headers & response formatting    │
└───────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Native Node.js HTTP Server — Deep Dive (`PLAN-IN-RESTAPI/index.js`)

The `PLAN-IN-RESTAPI` workspace demonstrates how to build a web server using only Node.js's native `http` module without any third-party dependencies.

### Step 1: Importing the `http` Module
Node.js provides a built-in core module named `http` to interact with HTTP requests and responses.

```js
// http module can help you to create http servers
const http = require('http');
```

### Step 2: Defining the Port Number
We define a port variable to share and manage the port configuration centrally:

```js
// 1. We would like to setup a basic http server
const PORT = 3000; // we defined a variable to share the value of the port.
```

### Step 3: Creating Server Instance with `http.createServer`
The `http.createServer()` method initializes an HTTP server instance. It accepts an asynchronous request listener callback function `(req, res)` that is executed every time a client sends an HTTP request to the server:

```js
const server = http.createServer(async (req, res) => {
    // whenever any request hits my server, this function will be called
    console.log('Request received');
    ...
}); // creating a new server instance, but it is not running
```

#### Understanding the Callback Parameters:
- **`req` (`http.IncomingMessage`)**: The request object containing HTTP method (`req.method`), URL (`req.url`), request headers, and body stream.
- **`res` (`http.ServerResponse`)**: The response object used to set status codes, headers, and send data back to the client.

### Step 4: Manual HTTP Method Handling (`req.method`) & Status Codes
Inside the request listener callback, we inspect `req.method` using conditional statements to determine the incoming HTTP verb:

```js
if (req.method == "GET") {
    res.end("GET request received");
} else if (req.method == "POST") {
    // in post request, let's send the response code as 201
    res.writeHead(201);
    res.end("POST request received");
} else {
    res.end("Hello World");
}
```

#### Detailed Breakdown of Native Handling:
1. **`GET` Request**: Checked via `req.method == "GET"`. Returns the text string `"GET request received"` using `res.end()`.
2. **`POST` Request**: Checked via `req.method == "POST"`.
   - Sets the HTTP response status code to `201` (Created) using `res.writeHead(201)`.
   - Completes the response with `"POST request received"` using `res.end()`.
3. **Fallback Else**: For any other HTTP method (e.g. `PUT`, `DELETE`), returns default `"Hello World"`.

### Step 5: Binding Server to Port with `server.listen()`
Calling `http.createServer()` initializes the server, but it does not process requests until it binds to a network port via `server.listen()`:

```js
server.listen(PORT, () => {
    // this function will be called when the server is started
    console.log(`Server is running on port ${PORT}`);
});
```

---

## 3. Basic Express.js Server — Deep Dive (`BasicExpressServer/index.js`)

The `BasicExpressServer` workspace demonstrates how Express.js simplifies HTTP server creation, route declaration, and response delivery.

### Step 1: Importing Express & Defining Port
Express is a third-party minimal web framework for Node.js:

```js
const express = require('express');

const port = 3001;
```

### Step 2: Creating Application Instance
Calling `express()` creates an Express application instance (conventionally named `app`), which encapsulates the HTTP server, router, and middleware stack:

```js
const app = express(); // calling the express function to create an app/Server instance
```

### Step 3: Declarative Method Routing (`GET`, `POST`, `PUT`, `DELETE`)
Express eliminates manual `if (req.method == ...)` checks by providing explicit routing methods on the `app` object corresponding to HTTP verbs:

#### 1. Root Route (`/`) Handlers:
```js
// GET request handler on root route
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// POST request handler on root route
app.post('/', (req, res) => {
    res.send('Hello World! POST')
});

// DELETE request handler on root route
app.delete('/', (req, res) => {
    res.send('Hello World! DELETE')
});

// PUT request handler on root route
app.put('/', (req, res) => {
    res.send('Hello World! PUT')
});
```

#### 2. Custom Route Handler (`/users`):
Express allows declaring specific URL path endpoints directly as the first argument:

```js
// Custom Route for creating users
app.post('/users', (req, res) => {
    res.send('User Created Successfully')
});
```

### Step 4: Understanding Express Response Handling (`res.send`)
- In native HTTP, we use `res.end()` and must manually specify headers or status codes with `res.writeHead()`.
- In Express, `res.send()` automatically:
  - Formats strings as `text/html; charset=utf-8` or objects as `application/json`.
  - Calculates and sets the `Content-Length` header.
  - Returns a default HTTP `200 OK` status code if not specified.

### Step 5: Starting the Express Server (`app.listen`)
```js
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
```
`app.listen(port, callback)` starts an underlying HTTP server on port `3001` and executes the callback once ready.

---

## 4. Side-by-Side Comparison: Native HTTP vs Express.js

| Concept / Feature | Native `http` Module (`PLAN-IN-RESTAPI`) | Express.js Framework (`BasicExpressServer`) |
| :--- | :--- | :--- |
| **Dependency** | Core Node.js module (`require('http')`) | Third-party npm package (`require('express')`) |
| **Port** | `3000` | `3001` |
| **Server Instance** | `const server = http.createServer(cb)` | `const app = express()` |
| **Method Routing** | Conditional checks on `req.method` | Declarative methods (`app.get`, `app.post`, `app.put`, `app.delete`) |
| **Custom Endpoints** | Manual string comparison on `req.url` | Path parameter string (`/users`) in route method |
| **Status Codes** | Manual via `res.writeHead(201)` | Default `200` via `res.send()`, or manual via `res.status(201)` |
| **Response Sending** | `res.end("...")` | `res.send("...")` |
| **Server Listening** | `server.listen(PORT, cb)` | `app.listen(port, cb)` |

---

## 5. Code References

- **Native HTTP Server Code**: 🔗 [`PLAN-IN-RESTAPI/index.js`](../../PLAN-IN-RESTAPI/index.js)
- **Basic Express Server Code**: 🔗 [`BasicExpressServer/index.js`](../../BasicExpressServer/index.js)
