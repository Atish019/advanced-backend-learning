# Day 4 — Modules in Node.js

## 1. What is a Module?
A module is a self-contained unit of code that performs a specific task. Modules help keep applications organized and maintainable.

## 2. Why Modules Are Important
- Promote code reuse
- Improve readability
- Reduce duplication
- Make testing easier

## 3. CommonJS Modules
CommonJS is the traditional module system in Node.js.

### Example
- use require() to import
- use module.exports or exports to export

This style is common in older Node.js codebases.

## 4. ES Modules
ES Modules are the modern standard module system based on JavaScript syntax.

### Example
- use import to load modules
- use export to expose functionality

This style is widely used in modern applications and frameworks.

## 5. Module Resolution
Node.js resolves modules by checking:
- built-in modules
- relative paths
- package folders
- package.json main or exports field

## 6. Module Caching
Node.js caches modules after the first import. This improves performance because repeated imports reuse the already loaded module instance.

## 7. Best Practices
- Keep modules focused on one responsibility.
- Avoid tightly coupling modules.
- Use clear names for exports.
- Prefer modern ES Modules where appropriate.

## 8. Verified from This Project
The repository already contains examples in [NodeJS_Modules/searching.js](../../NodeJS_Modules/searching.js), [NodeJS_Modules/math.js](../../NodeJS_Modules/math.js), and [NodeJS_Modules/ES_modulingdemo/index.js](../../NodeJS_Modules/ES_modulingdemo/index.js).
