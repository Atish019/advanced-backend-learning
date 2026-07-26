# Chapter 11 — HTTP Protocol and API Architecture

This chapter explores the Hypertext Transfer Protocol (HTTP), its historical evolution, request/response anatomy, and the fundamentals of API (Application Programming Interface) design, based on handwritten notes.

---

## 1. HTTP Protocol Core Concepts

### What is HTTP?
**HTTP (Hypertext Transfer Protocol)** is the primary Application Layer communication protocol used for transmitting data across networks between clients and servers.

```
┌────────────────────────────────────────────────────────┐
│             HTTP Application Layer Protocol            │
├────────────────────────────────────────────────────────┤
│ Client (Browser / App)                                 │
│    │                                                   │
│    ├──► HTTP Request  (over TCP Connection) ──► Server │
│    │                                          │        │
│    ◄─── HTTP Response (over TCP Connection) ◄──┘       │
└────────────────────────────────────────────────────────┘
```

### Key Properties of HTTP
1. **Application Layer Protocol**: Lives at Layer 7 of the OSI / TCP-IP stack. It governs higher-level application message formats.
2. **Reliable Data Transfer**: Relies on **TCP (Transmission Control Protocol)** at the Transport Layer to ensure ordered, error-checked, and lossless packet delivery.
3. **Hypertext Standard**: Originally designed to govern how **Hypertext** (documents containing embedded links/hyperlinks to other text/documents) is formatted, transmitted, and rendered across machines.
4. **General-Purpose Data Carrier**: Over the years, HTTP evolved beyond HTML documents. It is now a universal protocol capable of carrying virtually any data format—including **JSON**, **XML**, **Plain Text**, **Binary Streams**, and **Images/Media**.

---

## 2. Evolution of HTTP Versions

HTTP has undergone major architectural revisions to address network latency, connection overhead, and throughput challenges.

```
URL Structure: protocol://ip_address:port
Example:       https://127.0.0.1:8080/api/v1/tweets
```

```
┌─────────────────────────────────────────────────────────────────────---───┐
│                        Evolution of HTTP Versions                         │
├──────────┬──────┬────────────────────────────────────────────────────---──┤
│ Version  │ Year │ Core Features & Improvements                            │
├──────────┼──────┼────────────────────────────────────────────────────---──┤
│ HTTP/1.0 │ 1995 │ Non-persistent connections. Every request/response      │
│          │      │ required a new TCP 3-way handshake.                     │
├──────────┼──────┼───────────────────────────────────────────────────---───┤
│ HTTP/1.1 │ 1997 │ Persistent Connections (Keep-Alive), Pipelining,        │
│          │      │ Chunked Response Streaming. (Majority web use-case)     │
├──────────┼──────┼─────────────────────────────────────────────────────---─┤
│ HTTP/2   │ 2010 │ Binary framing, Multiplexing over single TCP connection,│
│          │      │ Header compression (HPACK), Server Push.                │
├──────────┼──────┼─────────────────────────────────────────────────────---─┤
│ HTTP/3   │ 2022 │ Built on QUIC protocol over UDP instead of TCP.         │
│          │      │ Faster connection setup, eliminates head-of-line        │
│          │      │ blocking, improved mobility & security.                 │
└──────────┴──────┴─────────────────────────────────────────────────────-─-─┘
```

### Abstraction in Code
Modern runtime environments and frameworks handle low-level HTTP socket parsing automatically:

```
Code You Write (e.g., Express / Node.js HTTP Server)
       │
       ▼
Internal Runtime Libraries (Node.js 'http' module / V8 / Libuv)
       │
       ▼
Facilitates Low-Level TCP / HTTP Setup & Socket Parsing
```

---

## 3. Anatomy of HTTP Requests & Responses

HTTP communication is strictly structured around paired **Requests** (sent by client) and **Responses** (returned by server).

### HTTP Request Anatomy

```
┌────────────────────────────────────────────────────────────────────────┐
│                         HTTP Request Structure                         │
├─────────────────┬──────────────────────────────────────────────────────┤
│ Component       │ Description & Usage                                  │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 1. URL / Endpoint│ Target server address & resource path to communicate│
│                 │ with (e.g., /api/v1/users).                          │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 2. Headers      │ Key-value pairs containing metadata about the request│
│                 │ (e.g., Content-Type, Authorization, User-Agent).     │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 3. Method       │ Enum defining the nature of the operation:           │
│                 │ GET (read), POST (create), PUT (replace),            │
│                 │ PATCH (partial update), DELETE (remove).             │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 4. Body         │ Payload of data sent with the request (JSON, form)   │
│                 │ for POST, PUT, and PATCH operations.                 │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---

### HTTP Response Anatomy

```
┌────────────────────────────────────────────────────────────────────────┐
│                         HTTP Response Structure                        │
├─────────────────┬──────────────────────────────────────────────────────┤
│ Component       │ Description & Usage                                  │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 1. Status Code  │ Numeric 3-digit code identifying request outcome     │
│                 │ (2xx Success, 3xx Redirection, 4xx Client Error,     │
│                 │ 5xx Server Error).                                   │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 2. Headers      │ Metadata key-value pairs returned by server          │
│                 │ (e.g., Content-Type, Set-Cookie, Cache-Control).     │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 3. Body         │ Data payload returned by server (JSON, HTML, etc.).  │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---
