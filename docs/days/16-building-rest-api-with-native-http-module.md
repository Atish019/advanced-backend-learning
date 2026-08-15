# Day 16 — Building a Basic HTTP Server in Node.js

A concise explanation of setting up a native HTTP server in Node.js, inspecting HTTP request methods (`GET`, `POST`), setting HTTP response status codes, and returning responses.

---

## 1. Importing the `http` Module

Node.js has a built-in module called `http` that allows us to create HTTP servers without installing third-party frameworks or external libraries.

```js
const http = require('http');
```

---

## 2. Defining the Port

A port is a communication endpoint. We store the port number in a variable so it can be easily shared or updated.

```js
const PORT = 3000;
```

---

## 3. Creating an HTTP Server with `http.createServer`

The `http.createServer()` method creates an instance of an HTTP server.

```js
const server = http.createServer(async (req, res) => {
    console.log('Request received');
    // Request handling logic goes here
});
```

### Understanding `req` and `res`:
- **`req` (Request Object)**: Contains all details sent by the client, such as the request method (`GET`, `POST`), headers, URL, and body.
- **`res` (Response Object)**: Used by the server to construct and send the HTTP response back to the client.

> Note: `http.createServer()` creates the server instance, but the server does not start listening until `server.listen()` is called.

---

## 4. Checking Request Methods (`req.method`)

Inside the request listener callback, we check `req.method` to identify what type of request the client sent and respond accordingly.

### 1. Handling `GET` Requests
- When `req.method == "GET"`, the client is requesting data.
- We return a text response using `res.end("GET request received")`.

### 2. Handling `POST` Requests & Setting Response Status Code
- When `req.method == "POST"`, the client is sending data to the server.
- We set the HTTP response status code to `201` (Created) using `res.writeHead(201)`.
- We complete the response with `res.end("POST request received")`.

### 3. Fallback Response
- For any other HTTP method (e.g. `PUT`, `DELETE`), we return `res.end("Hello World")`.

```js
if (req.method == "GET") {
    res.end("GET request received");
} else if (req.method == "POST") {
    // In POST request, send the status code as 201 Created
    res.writeHead(201);
    res.end("POST request received");
} else {
    res.end("Hello World");
}
```

---

## 5. Starting the Server with `server.listen`

The `server.listen()` method binds the server instance to the specified port number and starts listening for incoming connections.

```js
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

- When the server successfully starts listening on port `3000`, the callback function executes and logs `Server is running on port 3000`.

---

## 6. Code Reference

> 🔗 **See full working code**: [PLAN-IN-RESTAPI/index.js](../../PLAN-IN-RESTAPI/index.js)
