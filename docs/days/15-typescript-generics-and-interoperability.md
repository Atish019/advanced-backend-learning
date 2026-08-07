# Day 15 — TypeScript Generics & Structural Interoperability

Deep dive into TypeScript Day 03 topics: The problem Generics solve, Generic Functions with multiple type parameters, Generic Classes (Stack & Linked List as data structures), Generic Interfaces, Constrained Generics (`extends`), and Structural Type Interoperability between `type` and `interface`.

---

## 1. The Problem Generics Solve

Without generics, you face a fundamental dilemma when writing reusable logic (e.g., a search function or a data structure):

- **Option A: Use specific types** — Write separate functions for `number[]`, `string[]`, `boolean[]`, etc. This duplicates logic and violates DRY.
- **Option B: Use `any`** — Write one function with `any`. This works but completely kills type safety — you lose compiler checks, autocomplete, and refactoring support.

### Mental Model: Generics as Type Parameters
Generics introduce **type variables** (conventionally named `T`, `R`, `K`, `V`) that act as placeholders. The actual type is supplied by the caller at invocation time, not by the function author at definition time.

Think of it like a function parameter, but for **types** instead of values:
- `function sum(a: number, b: number)` → `a` and `b` are value parameters.
- `function linearSearch<T>(array: T[], x: T)` → `T` is a type parameter.

### Key Rule: Type Safety Without Duplication
Generics give you the **reusability of `any`** with the **safety of explicit types**. The compiler infers or enforces the concrete type at each call site, catching mismatches at compile time.

> 🔗 **See it in action**: [TypeScript/03-generics_intro.ts](../../TypeScript/03-generics_intro.ts) — Generic `linearSearch<T, R>()` function working with both `number[]` and `string[]`.

---

## 2. Multiple Type Parameters

A generic construct can accept **more than one type parameter**. This is useful when a function or class deals with multiple independent types simultaneously.

### Convention: Naming Type Parameters

| Name | Common Usage |
| :--- | :--- |
| `T` | Primary type (e.g., the element type of an array) |
| `R` | Return type or secondary type |
| `K` | Key type (in maps/dictionaries) |
| `V` | Value type (in maps/dictionaries) |

### How Multiple Parameters Work:
When calling `linearSearch<number, string>(array, 12, "abc")`, you explicitly tell the compiler: "In this call, `T` is `number` and `R` is `string`." TypeScript then enforces that `array` must be `number[]`, `x` must be `number`, and `y` must be `string`.

> 🔗 **See it in action**: [TypeScript/03-generics_intro.ts](../../TypeScript/03-generics_intro.ts#L4-L23) — `linearSearch<T, R>()` with explicit type arguments at call site.

---

## 3. Generic Classes

Generics become extremely powerful when applied to **classes**, especially data structures. A generic class defines its data member types and method signatures using type parameters, making the entire class reusable across different data types.

### Architecture Pattern: Type-Safe Data Structures

Without generics, you'd need separate `NumberStack`, `StringStack`, `PersonStack` classes — all with identical logic but different types. A single `Stack<T>` class handles all of them.

### Mental Model: The Container Analogy
Think of `Stack<T>` as a container with a label slot. When you create `new Stack<number>()`, you're labeling the container "numbers only." The container's operations (`push`, `pop`, `top`) all enforce that label at compile time.

### Advanced Pattern: Composing Generic Classes
Generic classes can hold instances of other classes as their element type. For example, a `LinkedList<Person>` stores `Person` objects in each node — the linked list doesn't need to know anything about `Person`'s internal structure; it only knows the type parameter `T`.

This demonstrates the power of generics for building **type-agnostic infrastructure** that works with any domain entity.

> 🔗 **See it in action**:
> - Generic Stack (push, pop, top, display): [TypeScript/03-generics_intro.ts](../../TypeScript/03-generics_intro.ts#L26-L54)
> - Generic Linked List holding `Person` objects: [TypeScript/03-generic_ll.ts](../../TypeScript/03-generic_ll.ts)

---

## 4. Generic Interfaces

Just as classes and functions can be generic, **interfaces** can also accept type parameters. This makes interface contracts flexible and reusable across different data shapes.

### Rule:
When you instantiate an object typed with a generic interface, you **must** supply concrete types for all type parameters. The compiler then enforces that all properties match those concrete types.

### Architecture Use Case:
Generic interfaces are ideal for defining **flexible API response contracts**, configuration objects, or any structure where the shape is fixed but the data types within it vary.

> 🔗 **See it in action**: [TypeScript/03-interface_generics.ts](../../TypeScript/03-interface_generics.ts) — `customInterface<T1, T2>` with concrete instantiation.

---

## 5. Constrained Generics (`extends`)

By default, a generic type parameter `T` can be **anything** — `number`, `string`, `object`, `null`, etc. Sometimes you need to restrict what `T` can be, ensuring it has certain properties or methods.

### Mental Model: Contracts on Type Parameters
`<T extends Logable>` means: "I accept any type `T`, but **only if** `T` satisfies the `Logable` interface." This gives you the flexibility of generics while guaranteeing that specific operations (like calling `.log()`) are safe to use on `T`.

### Rule: `extends` in Generics ≠ Class Inheritance
In the context of generics, `extends` means **"must satisfy the shape of"** (structural compatibility), not classical OOP inheritance. Any type that has a `log()` method satisfies `Logable` — it doesn't need to explicitly `implements Logable`.

### Tradeoff: Flexibility vs Safety
- **Unconstrained `<T>`**: Maximum flexibility, but you can't call any methods on `T` (compiler doesn't know what `T` has).
- **Constrained `<T extends SomeInterface>`**: Slightly less flexible (only types with certain shape are accepted), but you can safely use the guaranteed methods/properties inside the function body.

> 🔗 **See it in action**: [TypeScript/03-parameter_constraint.ts](../../TypeScript/03-parameter_constraint.ts) — `<T extends Logable>` constraint ensuring `.log()` is callable.

---

## 6. Structural Type Interoperability

TypeScript uses a **structural type system** (also called "duck typing") — two types are considered compatible if their **internal structure** (keys and value types) matches, regardless of their declared names.

### Mental Model: Shape Over Name
In nominal type systems (like Java or C#), `Complex` and `IComplex` would be completely different types even if they have identical fields. In TypeScript's structural system, they are **interchangeable** because their members match.

### Key Rules:
1. **Literal Types Widen to General Types**: A literal type (`"DPS" | "DAV"`) is a subset of `string`. Assigning a literal-typed variable to a `string`-typed variable is valid (widening), but not the reverse (narrowing).
2. **`type` ↔ `interface` Cross-Assignment**: If a `type Complex` and an `interface IComplex` have the same structure (same keys, same value types, same method signatures), values can be freely assigned between them. The compiler only checks structural equivalence — it ignores whether the definition used `type` or `interface`.

### Architecture Implication:
Structural typing means you can refactor between `type` and `interface` without breaking consumers of your code. As long as the shape stays the same, existing assignments and function calls remain valid. This is a core reason why TypeScript is so flexible with gradual adoption.

> 🔗 **See it in action**: [TypeScript/interoperability.ts](../../TypeScript/interoperability.ts) — Literal type widening and `type` ↔ `interface` cross-assignment.

---

## 7. Verified from This Project

All concepts documented in Day 15 are directly mapped to the 5 source files written for Day 03:

| Topic | Source File |
| :--- | :--- |
| Generic Functions & Multiple Type Params | [03-generics_intro.ts](../../TypeScript/03-generics_intro.ts) |
| Generic Linked List with Domain Objects | [03-generic_ll.ts](../../TypeScript/03-generic_ll.ts) |
| Generic Interfaces | [03-interface_generics.ts](../../TypeScript/03-interface_generics.ts) |
| Constrained Generics (`extends`) | [03-parameter_constraint.ts](../../TypeScript/03-parameter_constraint.ts) |
| Structural Interoperability | [interoperability.ts](../../TypeScript/interoperability.ts) |
