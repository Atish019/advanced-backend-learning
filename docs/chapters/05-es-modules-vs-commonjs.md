# Chapter 5: Modules in Node.js

## 1. What is a Module?
A module is a reusable block of code whose existence does not accidentally impact other code. Node.js has a set of built-in modules, and you can create your own modules to use in various applications.

## 2. CommonJS Modules (Old Way)
CommonJS is the traditional module system used in Node.js.

### Exporting with CommonJS
Use `module.exports` or `exports` to export functions or objects.

**Reference**: Check [NodeJS_Modules/searching.js](../../NodeJS_Modules/searching.js) to see how functions are exported using `exports.functionName`.

### Importing with CommonJS
Use `require()` to import modules.

**Reference**: Check [NodeJS_Modules/math.js](../../NodeJS_Modules/math.js) to see how `require()` is used to import searching functions.

## 3. ES Modules (Newer Way)
ES Modules is the modern, standardized module system for JavaScript.

### Named Exports
Export multiple values with individual names that can be imported selectively.

**Reference**: Check [NodeJS_Modules/ES_modulingdemo/arithmetic.js](../../NodeJS_Modules/ES_modulingdemo/arithmetic.js) to see multiple functions exported as named exports.

### Default Export
Export a single primary value from a module.

**Reference**: Check [NodeJS_Modules/ES_modulingdemo/arithmetic.js](../../NodeJS_Modules/ES_modulingdemo/arithmetic.js) to see how a default export is used alongside named exports.

### Importing with ES Modules

**Named Imports**: Import specific named exports.

**Default Import**: Import the default export.

**Namespace Import**: Import all exports as a namespace object.

**Reference**: Check [NodeJS_Modules/ES_modulingdemo/index.js](../../NodeJS_Modules/ES_modulingdemo/index.js) to see different import patterns in action.

## 4. Important: Enable ES Modules in Node.js
To use ES modules in Node.js, add `"type": "module"` to your `package.json`.

**Reference**: Check [NodeJS_Modules/ES_modulingdemo/package.json](../../NodeJS_Modules/ES_modulingdemo/package.json) to see this configuration.

## 5. Key Differences
| Feature | CommonJS | ES Modules |
|---------|----------|------------|
| Import | require() | import |
| Export | module.exports, exports | export, export default |
| Syntax | Dynamic, runtime | Static, parse-time |
| Usage | Older Node.js | Modern Node.js |

## 6. Best Practices
- Use ES Modules for new projects.
- Keep modules focused on one responsibility.
- Avoid circular dependencies.
- Use named exports for multiple values.
- Use default export only for the primary export.
- Always use relative paths for local module imports.

## 7. Summary
Understanding both CommonJS and ES modules is important because older Node.js projects use CommonJS, while modern projects use ES modules. The core concept remains the same: organize code into reusable, independent units.

