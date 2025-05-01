# Unit Testing

## 1. Setting Up Jest in Node.js

If you haven't installed Jest yet, here’s how you can set it up:

```bash
npm install --save-dev jest
```

Then, in your `package.json`, add this script to run tests:

```json
"scripts": {
  "test": "jest"
}
```

Now you can run `npm test` to execute your tests.

## 2. Testing Numbers and Strings

Let's start with basic unit tests. You can test numbers, strings, and other primitives using Jest's matchers.

### Example - Testing Numbers

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;

// sum.test.js
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3); // toBe checks for exact equality
});

test("adds negative numbers correctly", () => {
  expect(sum(-1, -2)).toBe(-3);
});
```

#### Example - Testing Strings

```javascript
// greet.js
function greet(name) {
  return `Hello, ${name}`;
}

module.exports = greet;

// greet.test.js
const greet = require("./greet");

test("greets user with name", () => {
  expect(greet("Alice")).toBe("Hello, Alice");
});

test("greet should not be undefined", () => {
  expect(greet("Bob")).toBeDefined();
});
```

## 3. Grouping Tests

You can group related tests using `describe`. This helps in organizing tests and keeping them modular.

```javascript
// arithmetic.js
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

module.exports = { multiply, divide };

// arithmetic.test.js
const { multiply, divide } = require("./arithmetic");

describe("Multiplication and Division", () => {
  test("multiplying 2 and 3 to equal 6", () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test("dividing 6 by 3 to equal 2", () => {
    expect(divide(6, 3)).toBe(2);
  });

  test("should throw error when dividing by zero", () => {
    expect(() => divide(6, 0)).toThrow("Division by zero");
  });
});
```

## 4. Refactoring with Confidence

When you write tests first (TDD approach), you can refactor code without worrying about breaking functionality. After refactoring, you can run the tests again to ensure everything still works as expected.

#### Example: Refactor a Function

Before refactoring:

```javascript
// add.js
function add(a, b) {
  return a + b;
}

module.exports = add;
```

Test:

```javascript
// add.test.js
const add = require("./add");

test("adds numbers correctly", () => {
  expect(add(1, 2)).toBe(3);
});
```

Now refactor `add.js`:

```javascript
// add.js (refactored)
const add = (a, b) => a + b;

module.exports = add;
```

After the refactor, run the test again to ensure the logic still works.

## 5. Testing Arrays

Jest provides a set of utilities for testing arrays.

```javascript
// arrayFunctions.js
function getEvenNumbers(arr) {
  return arr.filter((num) => num % 2 === 0);
}

module.exports = getEvenNumbers;

// arrayFunctions.test.js
const getEvenNumbers = require("./arrayFunctions");

test("filters even numbers", () => {
  expect(getEvenNumbers([1, 2, 3, 4, 5])).toEqual([2, 4]);
});

test("should return an empty array for no evens", () => {
  expect(getEvenNumbers([1, 3, 5])).toEqual([]);
});
```

## 6. Testing Objects

When testing objects, you can check if they are equal, have certain properties, or match a structure.

```javascript
// user.js
function createUser(name, age) {
  return { name, age };
}

module.exports = createUser;

// user.test.js
const createUser = require("./user");

test("creates a user object", () => {
  const user = createUser("John", 25);
  expect(user).toEqual({ name: "John", age: 25 });
});

test("user has correct name property", () => {
  const user = createUser("Jane", 30);
  expect(user).toHaveProperty("name", "Jane");
});
```

## 7. Testing Exceptions

You can test that a function throws the correct exceptions using `toThrow`.

```javascript
// throwError.js
function throwError() {
  throw new Error("This is an error");
}

module.exports = throwError;

// throwError.test.js
const throwError = require("./throwError");

test("throws an error", () => {
  expect(() => throwError()).toThrow("This is an error");
});
```

## 8. Continuously Running Tests with Jest

Jest supports a **watch mode** which allows you to automatically rerun tests whenever you change a file.

To enable this, simply run:

```bash
npm test -- --watch
```

This will keep Jest running in the background and rerun tests as you make changes to your files.

## Advanced Techniques

1. **Mocking Functions**: Mock functions can be used when you want to isolate the logic in a test by replacing dependencies with mock implementations.

```javascript
// logger.js
function log(message) {
  console.log(message);
}

module.exports = log;

// logger.test.js
const log = require("./logger");

jest.mock("./logger", () => jest.fn());

test("logs a message", () => {
  log("Hello World");
  expect(log).toHaveBeenCalledWith("Hello World");
});
```

2. **Async Code**: For asynchronous functions, Jest can work with promises or async/await.

```javascript
// fetchData.js
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

module.exports = fetchData;

// fetchData.test.js
const fetchData = require("./fetchData");

test("fetches data correctly", async () => {
  const data = await fetchData("https://api.example.com");
  expect(data).toEqual({ key: "value" });
});
```

## Summary

- **Basic Testing**: Numbers, strings, arrays, objects, exceptions.
- **Grouping Tests**: Use `describe` to group related tests.
- **Mocking**: Replace functions with mocks to isolate units of code.
- **Async Testing**: Use async/await with Jest to handle asynchronous code.
- **Continuous Testing**: Enable Jest watch mode to run tests automatically when files change.

Jest provides a wide range of **matcher functions** to make assertions in your tests. These matchers allow you to check various conditions in your code, from basic equality checks to more complex scenarios like exception handling and object structure validation.

Here's a list of common **Jest matcher functions**:

### 1. **Equality Matchers**

- `toBe(value)`  
  Checks if the value is the same as the expected value using `===` (strict equality).

  ```javascript
  expect(2 + 2).toBe(4);
  ```

- `toEqual(value)`  
  Checks if the value is deeply equal to the expected value (i.e., compares objects or arrays by value, not reference).

  ```javascript
  expect({ name: "Alice" }).toEqual({ name: "Alice" });
  ```

- `toBeNull()`  
  Checks if the value is `null`.

  ```javascript
  expect(null).toBeNull();
  ```

- `toBeUndefined()`  
  Checks if the value is `undefined`.

  ```javascript
  expect(undefined).toBeUndefined();
  ```

- `toBeDefined()`  
  Checks if the value is not `undefined`.

  ```javascript
  expect(1).toBeDefined();
  ```

- `toBeTruthy()`  
  Checks if the value is truthy (i.e., not falsy).

  ```javascript
  expect(1).toBeTruthy();
  ```

- `toBeFalsy()`  
  Checks if the value is falsy (i.e., one of `false`, `0`, `""`, `null`, `undefined`, or `NaN`).

  ```javascript
  expect(0).toBeFalsy();
  ```

### 2. **Object and Array Matchers**

- `toHaveProperty(key, value)`  
  Checks if an object has a specific property with the given value.

  ```javascript
  const obj = { name: "Alice", age: 25 };
  expect(obj).toHaveProperty("name", "Alice");
  ```

- `toHaveLength(length)`  
  Checks if an array or string has a specific length.

  ```javascript
  expect([1, 2, 3]).toHaveLength(3);
  ```

### 3. **Number and Math Matchers**

- `toBeGreaterThan(value)`  
  Checks if the value is greater than the expected value.

  ```javascript
  expect(10).toBeGreaterThan(5);
  ```

- `toBeGreaterThanOrEqual(value)`  
  Checks if the value is greater than or equal to the expected value.

  ```javascript
  expect(10).toBeGreaterThanOrEqual(10);
  ```

- `toBeLessThan(value)`  
  Checks if the value is less than the expected value.

  ```javascript
  expect(5).toBeLessThan(10);
  ```

- `toBeLessThanOrEqual(value)`  
  Checks if the value is less than or equal to the expected value.

  ```javascript
  expect(5).toBeLessThanOrEqual(5);
  ```

- `toBeCloseTo(value, precision)`  
  Checks if the number is close to the expected value with a specified number of decimal places.

  ```javascript
  expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
  ```

### 4. **Boolean Matchers**

- `toBeTrue()`  
  Checks if the value is `true`.

  ```javascript
  expect(true).toBeTrue();
  ```

- `toBeFalse()`  
  Checks if the value is `false`.

  ```javascript
  expect(false).toBeFalse();
  ```

### 5. **Exception Matchers**

- `toThrow()`  
  Checks if a function throws an error.

  ```javascript
  function throwError() {
    throw new Error("Something went wrong");
  }

  expect(() => throwError()).toThrow("Something went wrong");
  ```

- `toThrowErrorMatchingSnapshot()`  
  Checks if a function throws an error matching a snapshot.

  ```javascript
  expect(() => throwError()).toThrowErrorMatchingSnapshot();
  ```

### 6. **Array and Iterable Matchers**

- `toContain(value)`  
  Checks if an array or iterable contains a specific element.

  ```javascript
  expect([1, 2, 3]).toContain(2);
  ```

- `toContainEqual(value)`  
  Checks if an array or iterable contains an object that matches the specified value.

  ```javascript
  expect([{ name: "Alice" }]).toContainEqual({ name: "Alice" });
  ```

- `toMatchObject(object)`  
  Checks if an object matches the expected object structure (partially).

  ```javascript
  expect({ name: "Alice", age: 25 }).toMatchObject({ name: "Alice" });
  ```

### 7. **Regular Expression Matchers**

- `toMatch(regexp)`  
  Checks if a string matches a regular expression.

  ```javascript
  expect("Hello World").toMatch(/Hello/);
  ```

- `toMatchInlineSnapshot()`  
  Checks if a string matches an inline snapshot.

  ```javascript
  expect("Hello World").toMatchInlineSnapshot();
  ```

### 8. **Mock and Function Matchers**

- `toHaveBeenCalled()`  
  Checks if a mock function has been called.

  ```javascript
  const mockFn = jest.fn();
  mockFn();
  expect(mockFn).toHaveBeenCalled();
  ```

- `toHaveBeenCalledWith(arg1, arg2, ...)`  
  Checks if a mock function has been called with specific arguments.

  ```javascript
  const mockFn = jest.fn();
  mockFn(1, 2);
  expect(mockFn).toHaveBeenCalledWith(1, 2);
  ```

- `toHaveReturned()`  
  Checks if a mock function has returned a value.

  ```javascript
  const mockFn = jest.fn().mockReturnValue("Hello");
  expect(mockFn()).toHaveReturned();
  ```

### 9. **Asynchronous Matchers**

- `resolves`  
  Checks if a promise resolves to the expected value.

  ```javascript
  expect(Promise.resolve("done")).resolves.toBe("done");
  ```

- `rejects`  
  Checks if a promise rejects with the expected error.

  ```javascript
  expect(Promise.reject(new Error("error"))).rejects.toThrow("error");
  ```

### 10. **Snapshot Matchers**

- `toMatchSnapshot()`  
  Compares the result to a stored snapshot. If it differs, Jest will prompt you to update the snapshot.

  ```javascript
  expect(someObject).toMatchSnapshot();
  ```

- `toMatchInlineSnapshot()`  
  Compares the result to an inline snapshot defined directly in the test.

  ```javascript
  expect(someObject).toMatchInlineSnapshot();
  ```

---

Mocking in Jest allows you to replace parts of your code, such as functions, modules, or classes, with mock implementations to isolate and test specific parts of your codebase. This is particularly useful when you want to simulate the behavior of dependencies and avoid making actual network requests, database queries, or other side effects during testing.

### Key Concepts in Jest Mocking

1. **Mock Functions**
2. **Mocking Modules**
3. **Mocking Timers**
4. **Mocking Classes**
5. **Mocking Implementation and Return Values**
6. **Spying on Functions**

## 1. **Mock Functions**

Mock functions are used to replace real function implementations in your code during tests. Jest provides a few ways to create mock functions, including `jest.fn()`, `jest.spyOn()`, and `jest.mock()`.

### Example of Mock Function:

```javascript
// Simple Mock Function
const mockFn = jest.fn();

mockFn();
expect(mockFn).toHaveBeenCalled(); // Verifies the function was called

mockFn.mockReturnValue(42); // Change the return value of the mock
expect(mockFn()).toBe(42); // Returns 42
```

#### Common Mock Function Methods:

- `mockReturnValue(value)`  
  Mocks the return value of the function.

- `mockReturnValueOnce(value)`  
  Mocks the return value for just one call.

- `mockImplementation(fn)`  
  Mocks the implementation of the function.

- `mockImplementationOnce(fn)`  
  Mocks the implementation for just one call.

#### Example:

```javascript
const mockFn = jest.fn();

// Mock implementation
mockFn.mockImplementation(() => "Hello World");
expect(mockFn()).toBe("Hello World");

// Mock one-time implementation
mockFn.mockImplementationOnce(() => "Goodbye World");
expect(mockFn()).toBe("Goodbye World");
expect(mockFn()).toBe("Hello World"); // Next call returns 'Hello World'
```

---

## 2. **Mocking Modules**

Jest allows you to mock entire modules or individual functions within a module to isolate the code being tested.

### `jest.mock()` for Mocking Modules:

You can mock entire modules with `jest.mock()`.

##### Example: Mocking a Module

```javascript
// File: math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

// File: math.test.js
jest.mock("./math", () => ({
  add: jest.fn(() => 10), // Mocking the 'add' function
  multiply: jest.fn(() => 20), // Mocking the 'multiply' function
}));

import { add, multiply } from "./math";

test("mocked add function", () => {
  expect(add(1, 2)).toBe(10); // Mocked value
  expect(multiply(2, 3)).toBe(20); // Mocked value
});
```

## 3. **Mocking Timers**

Jest provides mock timers which help simulate `setTimeout`, `setInterval`, and `clearTimeout` in tests, which is useful for testing asynchronous code.

### Example of Mocking Timers:

```javascript
jest.useFakeTimers();

test("delayed function call", () => {
  const mockFn = jest.fn();

  setTimeout(mockFn, 1000);
  expect(mockFn).not.toBeCalled();

  jest.runAllTimers(); // Runs all pending timers
  expect(mockFn).toBeCalled();
});
```

### Timer Methods:

- `jest.useFakeTimers()`  
  Enables fake timers in Jest (mocking `setTimeout`, `setInterval`, etc.).

- `jest.runAllTimers()`  
  Runs all pending timers immediately.

- `jest.advanceTimersByTime(ms)`  
  Advances the timers by a specified number of milliseconds.

## 4. **Mocking Classes**

You can mock entire classes or individual methods in classes. This is useful when you want to isolate parts of your code that interact with external resources like databases or APIs.

### Example of Mocking a Class:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

// Mocking User class
jest.mock("./User", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getName: jest.fn(() => "Mocked Name"),
    };
  });
});

test("mocked class", () => {
  const MockedUser = require("./User"); // import the mocked class
  const user = new MockedUser("Alice");

  expect(user.getName()).toBe("Mocked Name"); // Returns mocked value
});
```

## 5. **Mocking Implementation and Return Values**

You can mock the implementation of a function and also mock what it returns using `mockImplementation` and `mockReturnValue`.

#### Example of Mocking Implementation:

```javascript
const fetchData = jest.fn().mockImplementation(() => {
  return Promise.resolve("Data fetched successfully");
});

test("mocking fetchData function", async () => {
  const data = await fetchData();
  expect(data).toBe("Data fetched successfully");
  expect(fetchData).toHaveBeenCalled(); // Verifies function was called
});
```

You can also mock return values for different calls:

```javascript
const mockFn = jest
  .fn()
  .mockReturnValueOnce("First Call")
  .mockReturnValueOnce("Second Call");

test("mock sequential return values", () => {
  expect(mockFn()).toBe("First Call");
  expect(mockFn()).toBe("Second Call");
  expect(mockFn()).toBe(undefined); // After all mockReturnValueOnce calls, it returns undefined
});
```

## 6. **Spying on Functions**

Jest provides `jest.spyOn()` to create spies on object methods. It allows you to observe calls to specific methods and optionally mock them.

### Example of Spying on an Object Method:

```javascript
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};

test("spy on greet method", () => {
  const spy = jest.spyOn(user, "greet");

  expect(user.greet()).toBe("Hello, Alice");
  expect(spy).toHaveBeenCalled();
});
```

You can also mock the implementation of the spied method:

```javascript
const spy = jest
  .spyOn(user, "greet")
  .mockImplementation(() => "Mocked Greeting");

test("mock implementation with spy", () => {
  expect(user.greet()).toBe("Mocked Greeting");
  expect(spy).toHaveBeenCalled();
});
```

### Best Practices for Mocking

1. **Isolate Tests:** Mock external services, APIs, and database calls so that your tests only focus on the logic of the code being tested.

2. **Restore Original Functions:** After mocking a function or method, it’s a good practice to restore the original implementation using `mockRestore()`.

   ```javascript
   const spy = jest.spyOn(console, "log");
   console.log("Test log");
   expect(spy).toHaveBeenCalled();
   spy.mockRestore();
   ```

3. **Avoid Over-Mocking:** While mocking is powerful, be cautious not to over-mock in such a way that it makes your tests too disconnected from real behavior. Balance mock usage with real integration tests when needed.

---

## Conclusion

Jest mocking is a powerful feature that allows you to isolate code behavior, simulate different scenarios, and test edge cases without relying on external systems or side effects. Mastering mocking can help you create more reliable and maintainable tests.
