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
