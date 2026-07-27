# Day 12 — REST API Design

REST API design in depth: how to structure URLs around resources, map HTTP verbs to CRUD operations, send data three ways, and version APIs correctly.

---

## 1. How to Implement Network APIs

There are **recommendations** (conventions) for implementing APIs. Not following them won't break the code algorithmically, but it will:
- Make your APIs harder to read and understand for other developers.
- Hurt code maintainability and consistency across teams.

Popular API implementation standards:

```
┌──────────────────────────────────────────────────┐
│             API Standards / Recommendations      │
├──────────────┬───────────────────────────────────┤
│  Standard    │  Notes                            │
├──────────────┼───────────────────────────────────┤
│  SOAP        │  Older, XML-based                 │
│  REST        │  ★ VVI — Most widely used         │
│  GraphQL     │  Query language from Meta         │
│  gRPC        │  High-performance, Protobuf-based │
└──────────────┴───────────────────────────────────┘
```

Most of these standards define:
- **How** to send data between systems
- **What format** to use for the data payload
- **What the contract** (agreement) between client and server should look like

---

## 2. REST API — Deep Dive

**REST** stands for **Representational State Transfer**.

REST is a **set of recommendations** (not a strict protocol) for creating APIs. You can implement REST using any programming language — Node.js, Python, Java, Go, etc. The key is that the **final API contract** must follow the REST conventions.

### Core Principles Behind REST

REST recommendations are built on two key ideas:

| Principle | What it means |
|-----------|---------------|
| **Platform Independence** | A REST API should work regardless of what client (browser, iOS, Android, Python script) is calling it. |
| **Loose Coupling** | The client and server should be independent of each other. Changing server internals should not break the client. |

### REST and JSON

For **any data exchange** in REST APIs, we use **JSON (JavaScript Object Notation)** as the payload format.

---

## 3. What is JSON?

JSON has **nothing to do with JavaScript** itself. The name is just because data written in JSON format visually resembles a JS object.

JSON is a **bunch of key-value pairs** that describe data. A JSON file uses the `.json` extension.

**JSON vs XML — comparison:**

```
JSON (compact, human-readable):
───────────────────────────────
{ "name": "Atish", "age": 24, "company": "Qubittron" }

XML (verbose, tag-based):
──────────────────────────
<data>
  <name>Atish</name>
  <age>25</age>
  <company>Gubitton</company>
</data>
```

REST APIs use JSON because it is compact, easy to parse, and natively supported in every major language and browser.

---

## 4. REST URL Design — Resources

Because REST APIs involve **network interaction**, there is a recommended way to define REST API URLs.

### What is a Resource?

A **resource** is any kind of data, object, or service that:
- Represents a real-life entity or use case
- Can be accessed by a client

```
Twitter example:
─────────────────
 user      → resource
 tweet     → resource
 like      → resource
 comment   → resource

signup    → NOT a resource (it is an ACTION)
```

### Key Rule: Resources are Nouns, not Verbs

> API URLs are designed around **nouns** (what you're working with), not **verbs** (what you're doing). The HTTP method already tells you the action.

```
Correct:   /tweets
Wrong:     /getTweets  or  /createTweet
```

Example resource URL:
```
http://twitter.com/tweets/33
                    ↑
               resource name (noun)
```

### Use Plural Names in URLs

Resource names in URLs are always **plural**:

```
/users       (not /user)
/tweets      (not /tweet)
/orders      (not /order)
```

---

## 5. HTTP Verb + URL = CRUD Mapping

By combining the **URL (resource)** with the **HTTP method (verb)**, you can immediately understand what the API is doing — without extra words in the URL.

```
┌───────────────────────────────────┬────────────┬────────────────────────────────────────────────────┐
│ URL Pattern                       │ HTTP Verb  │ What it does                                       │
├───────────────────────────────────┼────────────┼────────────────────────────────────────────────────┤
│ /resourceName                     │ POST       │ Create a new resource record                       │
│ /resourceName                     │ GET        │ Fetch all records of the resource                  │
│ /resourceName                     │ DELETE     │ Delete all records of the resource                 │
│ /resourceName                     │ PUT        │ Bulk update all records of the resource            │
│ /resourceName/:resourceId         │ GET        │ Fetch one specific record by its ID                │
└───────────────────────────────────┴────────────┴────────────────────────────────────────────────────┘
```

### Colon Syntax — Dynamic URL Parameters

A **colon (`:`)** in a URL means that segment is **variable** and can take any value at runtime.

```
/users/:user_id
         ↑
    Variable segment — at runtime this becomes /users/42, /users/105, etc.
```

### Nested Resources — Real Examples

```
/users/:user_id/bookings + POST
→ Create a new booking for a specific user

/users/:user_id/orders/:order_id + DELETE
→ Delete the order (order_id) belonging to the given user (user_id)
```

---

## 6. REST API Response — Status Codes

Every REST API response must return a **status code** — a numeric representation of what happened.

```
┌───────────┬──────────────────────────────────────────────┐
│ Range     │ Meaning                                      │
├───────────┼──────────────────────────────────────────────┤
│ 2xx       │ Success (200 OK, 201 Created, 204 No Content)│
│ 3xx       │ Redirection                                  │
│ 4xx       │ Client Error (400 Bad Request, 404 Not Found)│
│ 5xx       │ Server Error (500 Internal Server Error)     │
└───────────┴──────────────────────────────────────────────┘
```

---

## 7. REST APIs are Stateless

REST APIs must be **stateless**. This means:

- Each HTTP request is **completely independent** of all others.
- The server does **not remember** any previous request.
- Every request must carry all the information the server needs (e.g., auth token in headers).

```
Request 1: GET /users/42       ─┐
Request 2: GET /tweets/88      ─┼─ Each is independent. Server treats each as fresh.
Request 3: DELETE /orders/5    ─┘
```

---

## 8. Three Ways to Send Data in a REST API

```
┌─────────────────┬────────────────────────────────────────────────────────────┐
│ Method          │ Description                                                │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 1. URL Params   │ Embedded directly in the URL path.                         │
│                 │ Example: /customers/1/orders                               │
│                 │ Saved in browser history.                                  │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 2. Request Body │ Data sent as the body of POST / PUT / PATCH requests.      │
│                 │ Can carry complex data (text, JSON, XML, binary).          │
│                 │ In REST APIs, always use JSON as the body format.          │
│                 │ NOT saved in browser history.                              │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 3. Query Params │ Key-value pairs appended to the URL after `?`.             │
│                 │ Example: /products?company=samsung&category=mobile         │
│                 │ Saved in browser history.                                  │
│                 │ Used to pass filtering/search criteria.                    │
└─────────────────┴────────────────────────────────────────────────────────────┘
```

Visual comparison:

```
URL Params   → /customers/1/orders
                         ↑ part of the path

Query Params → /products?company=samsung&category=mobile
                         ↑ key=value pairs after ?

Request Body → { "name": "Atish", "age": 24 }
               ↑ inside HTTP request body — not visible in URL
```

---

## 9. API Versioning

It is **recommended to version your APIs**, with version info as part of the URL.

```
/api/v1/products
/api/v3/orders/3/route
  ↑
  Tells the client:
  - This is an API URL (not a web page URL)
  - Which version of the API contract is being used
```

When you release breaking changes, old clients continue using `/v1/`, new clients use `/v2/`.

**Alternative:** API version can also be sent via **request headers**:

```
Accept: application/vnd.api+json;version=2
API-Version: v2
```

---

## Day Summary

```
┌───────────────────────────────┬────────────────────────────────────────────────────┐
│ Topic                         │ Core Takeaway                                      │
├───────────────────────────────┼────────────────────────────────────────────────────┤
│ REST Definition               │ Recommendations for creating APIs.                 │
│                               │ Any language can implement REST.                   │
│ REST Principles               │ Platform independence + Loose coupling.            │
│ JSON                          │ Key-value format for data exchange in REST.        │
│ Resource Design               │ URLs are nouns (resources), HTTP verbs are actions.│
│ CRUD Mapping                  │ POST=create, GET=read, PUT=update, DELETE=delete.  │
│ Colon Syntax                  │ :paramName marks a variable URL segment.           │
│ Stateless                     │ Every request is independent — no server memory.   │
│ Send Data (3 Ways)            │ URL params, Request body, Query params.            │
│ API Versioning                │ /api/v1/... in URL, or via request headers.        │
└───────────────────────────────┴────────────────────────────────────────────────────┘
```
