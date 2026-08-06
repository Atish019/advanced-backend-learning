# Day 14 — TypeScript Object Types, Enums, Classes & Interface

Deep dive into TypeScript Day 02 topics: Object types & property restrictions, Type Aliases (`type`), Enums (Numeric, String, Custom), Object-Oriented Programming with Classes (Access Modifiers & Encapsulation), Interfaces in Real-world Components, and a comprehensive comparison between `type` vs `interface` (including Declaration Merging).

---

## 1. Object Types & Property Restrictions

When you create an object literal in TypeScript, the compiler automatically **infers** its type based on the keys and value types present at the time of declaration. This inferred type becomes a sealed contract for that variable.

### Mental Model: Sealed Object Shapes
Think of an inferred object type as a sealed blueprint — you can **update** existing properties (mutation), but you **cannot add** new properties that weren't part of the original blueprint (extension). TypeScript enforces this at compile time to prevent accidental property pollution.

### Key Rules:
1. **Property Mutation**: Reassigning an existing key to a value of the same type is always permitted.
2. **Extension Restriction**: Assigning a value to a key that was never declared in the object's type causes a compile-time error. TS treats the inferred shape as the definitive contract.
3. **Optional Properties (`?`)**: If you know a property may or may not exist, declare it with `?` in the type definition. This explicitly tells TypeScript to allow its absence during initialization.

> 🔗 **See it in action**: [TypeScript/02-object_types.ts](../../TypeScript/02-object_types.ts)

---

## 2. Type Aliases (`type`)

A **Type Alias** gives a reusable name (nickname) to any type structure — object shapes, primitives, unions, or tuples.

### Why Type Aliases Matter:
- **DRY Principle**: Without aliases, you'd repeat the same inline object type (`{ name: string, marks: number, address?: string }`) every time you declare a variable. An alias defines it once and reuses it everywhere.
- **Domain Modeling**: Naming a type `Details` instead of writing raw inline structures gives semantic meaning, making code self-documenting.

### Rule:
A `type` alias is purely a compile-time construct. It generates **zero JavaScript output** — it exists only for the compiler's type-checking pass.

> 🔗 **See it in action**: [TypeScript/02-creating_alias.ts](../../TypeScript/02-creating_alias.ts)

---

## 3. Enums (Enumeration Types)

An **Enum** defines a set of named constants, replacing magic strings and hardcoded numbers with readable, type-safe identifiers.

### Enum Variants:

| Variant | How Values Are Assigned | Best Used For |
| :--- | :--- | :--- |
| **Numeric Enum** | Auto-increments from `0` (or a custom start) | Sequential state flags, internal identifiers |
| **String Enum** | Each member explicitly initialized with a string literal | Logging, API payloads, debugging (human-readable) |
| **Custom Numeric** | Each member assigned a specific integer | Domain-specific codes (HTTP status codes, error codes) |

### Mental Model: Enums as State Machines
Think of enums as defining the **finite set of valid states** for a domain concept (e.g., a ticket can only be `INITIALISED`, `CANCELLED`, `PENDING`, or `CLOSED`). This prevents invalid states from entering your system and makes conditional logic explicit and exhaustive.

### Tradeoff: Numeric vs String Enums
- **Numeric Enums** are compact but produce opaque values in logs (`0`, `1`, `2`).
- **String Enums** are verbose but produce readable output (`"initialised"`, `"cancelled"`).
- Choose based on whether the enum value is **internal** (numeric) or **externally visible** (string).

> 🔗 **See it in action**: [TypeScript/02-Enums.ts](../../TypeScript/02-Enums.ts)

---

## 4. Object-Oriented Programming (OOP) & Encapsulation

TypeScript extends ES6 classes with **Access Modifiers** (`public`, `private`, `protected`) and `readonly` properties, enabling true encapsulation.

### Access Modifiers Matrix:

| Modifier | Access Inside Class | Access Outside Class | Modifiable After Init |
| :--- | :---: | :---: | :---: |
| `public` (default) | Yes | Yes | Yes |
| `private` | Yes | No | Yes (via internal methods only) |
| `readonly` | Yes | Yes (read) | **No** |

### Architecture Patterns:

1. **Encapsulation via Private Fields**: Hide internal state (`private price`) and expose controlled mutations through setter methods with validation logic. This ensures data integrity — e.g., a `setPrice()` method can reject negative values before updating the internal state.

2. **Immutability via `readonly`**: Properties like `category` or `tags` that should never change after construction are marked `readonly`. Note: `readonly` on arrays prevents reassignment of the array reference, but array elements can still be mutated (`arr[0] = 0` is allowed).

3. **Domain Entity Modeling**: Complex real-world entities (e.g., mathematical Complex Numbers with `real` and `imaginary` parts) can be modeled as classes with `private` data members and arithmetic methods (`add`, `multiply`), keeping internal representation hidden from consumers.

> 🔗 **See it in action**:
> - Encapsulation & Access Modifiers: [TypeScript/02-classes.ts](../../TypeScript/02-classes.ts)
> - Complex Number Domain Class: [TypeScript/02-complex_number_class.ts](../../TypeScript/02-complex_number_class.ts)

---

## 5. Interfaces in Real-World Component Contracts

An **Interface** defines a pure compile-time structural contract — specifying what keys, types, and function signatures an object must have. It generates **zero JavaScript output**.

### Architecture Use Case: Component Configuration Contracts
In real-world applications, interfaces standardize the shape of configuration objects — for example, defining what every authentication form must provide: a name, button text, and callback handlers (`onSubmit`, `onReset`). This ensures every form component adheres to the same contract, enabling interchangeability and loose coupling.

### Rule:
Unlike classes, you **cannot instantiate** an interface with `new`. Interfaces only describe shape — they have no implementation.

> 🔗 **See it in action**: [TypeScript/02-interfcae_Example.ts](../../TypeScript/02-interfcae_Example.ts)

---

## 6. `type` vs `interface` — Architectural Tradeoffs

This is one of the most important design decisions in TypeScript. Both can define object shapes, but they have fundamentally different capabilities.

### Capability Comparison:

| Feature | `type` | `interface` |
| :--- | :---: | :---: |
| Primitive aliases (`type text = string`) | YES | NO |
| Union types (`number \| string`) | YES | NO |
| Tuples (`[number, number]`) | YES (clean) | (via index signatures) |
| Object shapes | YES | YES |
| Function signatures | YES | YES |
| Index signatures | YES | YES |
| Declaration Merging | NO | YES |

### Key Tradeoff: Declaration Merging

**Declaration Merging** is an `interface`-only feature. When you declare the same interface name twice in the same scope, TypeScript automatically **merges** both declarations into a single combined contract. This is powerful for extending third-party library types or progressively building up complex contracts.

`type` aliases do **not** merge — redeclaring a `type` with the same name causes a duplicate identifier compiler error.

### Decision Framework:
- Use **`type`** when you need unions, primitives, tuples, or compositional types.
- Use **`interface`** when you're defining object contracts that may need extension or merging.
- For pure object shapes where neither merging nor unions are needed, both work equally well — pick one and stay consistent across the project.

> 🔗 **See it in action**: [TypeScript/02-type_vs_interface.ts](../../TypeScript/02-type_vs_interface.ts)

---

## 7. Verified from This Project

All concepts documented in Day 14 are directly mapped to the 7 source files written for Day 02:

| Topic | Source File |
| :--- | :--- |
| Object Types & Property Restrictions | [02-object_types.ts](../../TypeScript/02-object_types.ts) |
| Type Aliases (`type`) | [02-creating_alias.ts](../../TypeScript/02-creating_alias.ts) |
| Enums (Numeric, String, Custom) | [02-Enums.ts](../../TypeScript/02-Enums.ts) |
| Classes & Access Modifiers | [02-classes.ts](../../TypeScript/02-classes.ts) |
| Complex Number Domain Class | [02-complex_number_class.ts](../../TypeScript/02-complex_number_class.ts) |
| Interface Component Contract | [02-interfcae_Example.ts](../../TypeScript/02-interfcae_Example.ts) |
| `type` vs `interface` Comparison | [02-type_vs_interface.ts](../../TypeScript/02-type_vs_interface.ts) |
