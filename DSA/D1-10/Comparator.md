# Java Comparison – Notes

## 1. Overflow Error (Why Comparators Break)

**Overflow** occurs when a value exceeds the data type range.

### Integer overflow

* Java `int` overflows silently
* No exception unless you opt in

```java
int x = Integer.MAX_VALUE + 1; // wraps to Integer.MIN_VALUE
```

## 2. Why `a - b` / `b - a` Is Wrong in Comparators

```java
(a, b) -> b - a   // ❌ incorrect
```

### Problem

* Arithmetic subtraction can overflow
* Overflow flips sign → incorrect comparison

### Correct alternatives

```java
Integer.compare(a, b);
Integer.compare(b, a); // descending
```

**Rule**
❌ Never subtract in a comparator
✅ Always use `compare(...)`

## 3. How `Integer.compare()` Works

```java
Integer.compare(x, y)
```

Equivalent logic:

```java
if (x < y) return -1;
if (x == y) return 0;
return 1;
```

### Why it is safe

* Uses relational operators
* No arithmetic
* No overflow possible

## 4. `@Override`

* `@Override` is an **annotation**
* **Not a keyword**
* Compile-time only

### Purpose

* Ensures a method actually overrides a parent method
* Catches signature mismatches early

```java
@Override
public int compare(Employee e1, Employee e2) { }
```

## 5. Comparable vs Comparator

### What they are

* `Comparable<T>` → **interface**
* `Comparator<T>` → **interface**

### Core difference

| Aspect           | Comparable              | Comparator                          |
| ---------------- | ----------------------- | ----------------------------------- |
| Nature           | **Intrinsic** ordering  | **Extrinsic / contextual** ordering |
| Who owns logic   | The class itself        | External logic                      |
| Number of orders | Exactly one             | Many                                |
| Flexibility      | Low                     | High                                |
| Typical usage    | Rare in business models | Common in real systems              |


## 6. Important Correction (Design Reality)

### ❌ Misconception

> Most users implement both Comparable and Comparator

### ✅ Reality

* Implementing **both on the same class is usually a design smell**
* Creates conflicting order semantics
* Confuses APIs and maintainers

**Modern practice**:

* Many systems avoid `Comparable` entirely
* Prefer `Comparator` for flexibility and separation of concerns

## 7. When Comparable Actually Makes Sense

Use `Comparable` **only if all are true**:

1. Exactly one natural ordering exists
2. Ordering is stable long-term
3. All consumers agree on it
4. Ordering makes sense everywhere

Examples where it fits:

* `String`
* `Integer`
* `LocalDate`

Business entities usually **do not qualify**.

## 8. Your Example — EmployeeComparator (Verified)

### Your code

```java
class EmployeeComparator implements Comparator<Employee> {
    @Override
    public int compare(Employee e1, Employee e2) {
        if (e1.salary > e2.salary) return -1;
        else if (e1.salary == e2.salary) {
            return Integer.compare(e1.age, e2.age);
        }
        else return 1;
    }
}
```

### What it does

* Salary → descending
* Age (if salary equal) → ascending

### Is it correct?

✅ Correct **under your assumption**:

> no same age group have same salary

### Why this is risky

* Comparator correctness depends on data assumptions
* If salary and age collide:

  * `compare()` returns `0`
  * Elements may disappear from `TreeSet` / `TreeMap`

### Safer, production-grade version

```java
Comparator<Employee> cmp = 
    Comparator.comparingInt((Employee e) -> e.salary).reversed()
              .thenComparingInt(e -> e.age).thenComparingLong(e -> e.id);
```

**Rule**
A comparator must be **self-sufficient**, not data-dependent.

## 9. String Comparison

### Correct method

```java
s1.compareTo(s2)
```

### Case-insensitive

```java
s1.compareToIgnoreCase(s2);
```

**Blind spot**
`String.compareTo()` is often wrong for user-facing sorting.

## 10. Comparator Contract (Must Hold)

| Rule                       | Why                            |
| -------------------------- | ------------------------------ |
| Anti-symmetric             | `compare(a,b) = -compare(b,a)` |
| Transitive                 | Required for sorting           |
| `compare == 0` consistency | Required for sets/maps         |
| No overflow                | Prevents incorrect ordering    |

## Final Takeaways (Condensed)

* `Comparable` and `Comparator` are **interfaces**
* `@Override` is an **annotation**
* Never subtract in a comparator
* Prefer `Comparator` in real systems
* Avoid implementing both
* Add a unique tie-breaker
* Do not rely on data assumptions

### One-line rule to remember

> **Sorting logic belongs where it is used, not where the data lives.**