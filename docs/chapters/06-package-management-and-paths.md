# Chapter 6: Package, Library, and Module Management

## 1. Module vs Package vs Library
- **Module**: A single file or unit of code that exports functionality.
- **Package**: A collection of modules and metadata packaged together (with package.json).
- **Library**: Reusable code written to solve common problems, often published as a package.

## 2. What is npm?
npm is the default package manager for Node.js. It helps developers install, share, manage, and organize packages. npm also runs scripts and manages project dependencies.

## 3. package.json
The `package.json` file is the heart of any Node.js project. It describes your project and its dependencies with fields like name, version, scripts, dependencies, devDependencies, main, and type.

**Reference**: Check [NodeJS_Modules/ES_modulingdemo/package.json](../../NodeJS_Modules/ES_modulingdemo/package.json) to see a real example with the `"type": "module"` configuration.

## 4. Dependencies vs DevDependencies
- **dependencies**: Packages required for your application to run in production.
- **devDependencies**: Packages only needed during development and testing (e.g., testing frameworks, linters).

Commands to install:
- `npm install express` — adds to dependencies
- `npm install --save-dev jest` — adds to devDependencies

## 5. package-lock.json
This file locks the exact versions of installed packages. It ensures that:
- Every developer working on the project installs the same versions.
- Deployments use the exact same package versions.
- The build is reproducible and consistent.

## 6. node_modules
The folder where npm installs all packages locally for your project. Always add `node_modules/` to `.gitignore` to avoid committing thousands of files to version control.

## 7. Semantic Versioning (semver)
Packages follow the pattern: `major.minor.patch`

Example: `1.2.3`
- **1** (major): Breaking changes
- **2** (minor): New features (backward compatible)
- **3** (patch): Bug fixes

## 8. File Paths in Node.js

### Absolute Paths
An absolute path starts from the root of the filesystem and specifies the complete location. On macOS/Linux it starts with `/`; on Windows it starts with a drive letter like `C:\`.

In Node.js, use `__dirname` to get the absolute path of the current directory.

**Reference**: Check [File_IO_in_NodeJS/index.js](../../File_IO_in_NodeJS/index.js) to see how `__dirname`, `process.cwd()`, and `import.meta.url` are used to get absolute paths.

### Relative Paths
A relative path is relative to the current working directory or current file location.

#### Single Dot (.)
Means the current directory.

Example: `require('./searching.js')` imports `searching.js` from the same folder.

#### Double Dot (..)
Means go up one level in the directory hierarchy.

Example: `require('../math.js')` goes up one level and imports `math.js`.

Multiple levels: `require('../../demo_1.js')` goes up two levels.


From `ES_modulingdemo/index.js`:
- `require('../math.js')` points to `NodeJS_Modules/math.js`
- `require('./arithmetic.js')` points to same folder
- `require('../../demo_1.js')` points to root `NodeJSAdv/demo_1.js`

**Reference**: Check [NodeJS_Modules/math.js](../../NodeJS_Modules/math.js) to see relative path imports in action.

## 9. Common npm Commands
- `npm init` — Initialize a new project
- `npm install` — Install all dependencies from package.json
- `npm install express` — Install a specific package
- `npm install --save-dev jest` — Install as dev dependency
- `npm update` — Update packages
- `npm uninstall express` — Uninstall a package
- `npm run start` — Run a script defined in package.json
- `npm list` — View installed packages

## 10. Best Practices
- Keep dependencies minimal.
- Regularly update packages for security patches.
- Use clear, descriptive script names.
- Prefer trusted, well-maintained packages.
- Always use relative paths for local module imports.
- Use absolute paths or `__dirname` when needed for file system operations.
- Add `node_modules/` to `.gitignore`.

## 11. Summary
Packages and paths are fundamental to organizing Node.js projects. Understanding how to manage dependencies, navigate the file system with relative and absolute paths, and structure your project ensures clean, maintainable, and scalable code.

