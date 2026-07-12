# Chapter 5: Package, Library, and Module Management

## 1. Module vs Package vs Library
- Module: a single file or unit of code.
- Package: a collection of modules published together.
- Library: reusable code written to solve common problems.

## 2. What is npm?
npm is the default package manager for Node.js. It helps developers install, share, and manage packages.

## 3. package.json
The package.json file describes a project and its dependencies.

### It usually contains:
- name
- version
- scripts
- dependencies
- devDependencies
- main
- type

## 4. Dependencies and Dev Dependencies
- dependencies: required in production.
- devDependencies: required only during development and testing.

## 5. package-lock.json
This file locks the installed dependency versions to ensure consistent installs across environments.

## 6. node_modules
This folder stores installed packages locally for the project.

## 7. Semantic Versioning
Packages follow version patterns such as major.minor.patch.
- Example: 1.2.3
- Major changes may break compatibility.
- Minor updates add features.
- Patch updates fix bugs.

## 8. Common Commands
- npm init
- npm install package-name
- npm install --save-dev package-name
- npm run script-name
- npm update
- npm uninstall package-name

## 9. Best Practices
- Keep dependencies minimal.
- Review package security and maintenance.
- Use clear scripts for development tasks.
- Prefer trusted and well-maintained packages.

## 10. Verified from This Project
The repository includes a package definition in [NodeJS_Modules/ES_modulingdemo/package.json](../../NodeJS_Modules/ES_modulingdemo/package.json), which shows how Node.js packages are configured.
