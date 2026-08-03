# Day 13 — TypeScript Fundamentals

Deep dive into TypeScript core fundamentals: Primitive types, type annotations vs inference, union types, the `any` escape hatch, typed arrays, structural object typing via classes and interfaces, function signatures, optional parameters, and built-in objects.

---

## 1. What is TypeScript & Why Use It?

**TypeScript (TS)** is a strongly typed, object-oriented superset of JavaScript developed by Microsoft. It compiles down to plain JavaScript (`.js`) via the TypeScript Compiler (`tsc`).

```
┌──────────────────────────────────────────────────────────┐
│                     TypeScript Architecture              │
├──────────────────────────┬───────────────────────────────┤
│ TypeScript Source (.ts)  │ Written with Type Annotations │
│           │              │                               │
│           ▼              │                               │
│  TypeScript Compiler     │ Performs Type-Checking &      │
│         (tsc)            │ Catches Errors at Compile-Time│
│           │              │                               │
│           ▼              │                               │
│  Plain JavaScript (.js)  │ Executed by Node.js or Browser│
└──────────────────────────┴───────────────────────────────┘
```

### Key Benefits for Backend Developers:
1. **Compile-Time Error Checking**: Catch bugs like `undefined is not a function` or invalid type reassignments BEFORE running the server.
2. **Self-Documenting Code**: Interfaces and type annotations serve as explicit API contracts.
3. **IDE Superpowers**: Autocomplete, intellisense, and safe refactoring.

---

## 2. Primitive Types & Type Signatures

TypeScript provides explicit type annotations for all native JavaScript primitives:

| Type | Description | Example |
| :--- | :--- | :--- |
| `number` | Integer, floating point, NaN | `let id: number = 5;` |
| `string` | Textual data | `var lastName: string = "Sharma";` |
| `boolean` | `true` or `false` flag | `let isActive: boolean = true;` |
| `undefined` | Unassigned primitive | `let empty: undefined = undefined;` |
| `null` | Intentional empty value | `let missing: null = null;` |
| `bigint` | Large integers | `let bigNum: bigint = 9007199254740991n;` |
| `symbol` | Unique immutable identifiers | `let sym: symbol = Symbol("id");` |

### Syntax: Type Annotation / Signature
```typescript
var <variable_name> : <type> = <value>;
```

### Explicit Annotation vs Type Inference

- **Explicit Type Annotation**: Manually declaring the variable's type.
  ```typescript
  let id: number = 5;
  ```
- **Type Inference**: TypeScript automatically infers the variable's type based on its assigned value.
  ```typescript
  let firstName = "Atish"; // TS infers firstName as `string`
  ```

### Compiler Safety on Reassignment
If you attempt to assign a value of a different type to an inferred or annotated variable, `tsc` will throw a compile error:
```typescript
let firstName = "Atish";
firstName = 12; //  TSC Error: Type 'number' is not assignable to type 'string'
```

---

## 3. Union Types (`|`)

A **Union Type** allows a variable to hold values of more than one specified type using the pipe (`|`) operator.

```typescript
let userId: number | string = 24;
userId = 10;         //  Valid (number)
userId = "USR-101";  //  Valid (string)
// userId = true;    //  TSC Error: Type 'boolean' is not assignable to 'number | string'
```

### Why Union Types Matter:
In backend development, identifiers (like user IDs or database primary keys) can often be numeric auto-increments (`101`) or UUID strings (`"c7a8b8..."`). Union types allow handling both safely.

---

## 4. The `any` Type — Flexible Escape Hatch

The `any` type disables TypeScript's static type checker for a specific variable. It acts as a "free ticket" to bypass type safety.

### Ways a Variable Becomes `any`:
1. **Explicit Declaration**:
   ```typescript
   let x: any = 10;
   x = "Atish";  // Allowed
   x = false;   // Allowed
   ```
2. **Implicit Declaration (Uninitialized Variable)**:
   ```typescript
   let x; // Declared without a type or value -> Defaults to `any`
   x = "10";
   x = 10;
   ```

>  **Best Practice**: Avoid overusing `any` in backend applications, as it negates the safety benefits of TypeScript.

---

## 5. Arrays in TypeScript

Arrays in TypeScript can be constrained to specific types or allowed to store flexible combinations of types.

### Array Types Breakdown:

1. **Homogeneous Array** (Single type):
   ```typescript
   let ids: number[] = [1, 2, 3, 4, 5];
   ```
2. **Any Array** (Opting out of type checks for elements):
   ```typescript
   let hetero: any[] = [1, 2, false, "123", null];
   ```
3. **Union Array** (Allows listed types in any order):
   ```typescript
   let data: (number | string | boolean)[] = [1, "Atish", true];
   ```

---

## 6. Defining Object Shapes: Classes vs. Interfaces

TypeScript provides two primary ways to structure objects: **Classes** and **Interfaces**.

### 1. Classes
A **Class** is a concrete blueprint with data members, a constructor, and member functions. It exists at both compile-time and runtime.

```typescript
class Car {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    display() {
        console.log(this.name);
    }
}

let c1 = new Car("Santro");
c1.display(); // Outputs: Santro
```

### 2. Interfaces
An **Interface** is a pure compile-time contract. It defines the required keys, types, and function signatures that an object must adhere to. It emits **zero JavaScript code** when compiled.

```typescript
interface Product {
    name: string;
    price: number;
    brand: string;

    display(): void;
}

let p1: Product = {
    name: "Iphone",
    price: 100000,
    brand: "apple",
    display: () => {
        console.log("display");
    }
};
```

---

## 7. Functions in TypeScript

Functions in TypeScript require typing for parameters and explicit/inferred return types.

### 1. Standard Function Signature
```typescript
function sum(a: number, b: number): number {
    return a + b;
}
console.log(sum(10, 20)); // Outputs: 30
```

### 2. Optional Parameters (`?`)
Adding a `?` after a parameter name marks it as optional. Its type automatically becomes `type | undefined`.

```typescript
function sum(a: number, b?: number): number {
    return a + (b || 0); // Using logical OR to handle undefined fallback
}

console.log(sum(10)); // Outputs: 10
```

### 3. `void` Return Type
Functions that do not return a value return `void`.

```typescript
function fun(): void {
    // No return statement
}
console.log(fun()); // Outputs: undefined
```

---

## 8. Built-in Objects (Date Object)

TypeScript comes with built-in type definitions for native JavaScript global objects such as `Date`, `Math`, `Map`, `Set`, etc.

```typescript
const dob = new Date(2009, 5, 20);
console.log(dob);
console.log(dob.getDate()); // Returns day of the month (20)
```

---

## 9. Code Verification & Project Mapping

All concepts documented in this day are implemented and tested in the project repository file:
- **Code File**: [TypeScript/01-day.ts](../../TypeScript/01-day.ts)

| Concept | Code Reference in `01-day.ts` |
| :--- | :--- |
| Primitives & Inference | [Lines 1-23](../../TypeScript/01-day.ts#L1-L23) |
| Union Types | [Lines 25-27](../../TypeScript/01-day.ts#L25-L27) |
| `any` Type | [Lines 29-32, 127-130](../../TypeScript/01-day.ts#L29-L32) |
| Array Types | [Lines 42-49](../../TypeScript/01-day.ts#L42-L49) |
| Class Definition | [Lines 58-66](../../TypeScript/01-day.ts#L58-L66) |
| Interface Definition | [Lines 68-99](../../TypeScript/01-day.ts#L68-L99) |
| Function & Optional Params | [Lines 102-110, 136-140](../../TypeScript/01-day.ts#L102-L110) |
| Date Object | [Lines 113-116](../../TypeScript/01-day.ts#L113-L116) |
