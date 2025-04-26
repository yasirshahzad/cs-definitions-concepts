# Computer Science Definitions and Concepts

## Software Engineering Principles

### 1. SOLID Design Principle

The **SOLID principles** are a set of design guidelines to help create scalable and maintainable software. These principles are:

1. **Single Responsibility** Principle (SRP)
2. **Open/Closed** Principle (OCP)
3. **Liskov Substitution** Principle (LSP)
4. **Interface Segregation** Principle (ISP)
5. **Dependency Inversion** Principle (DIP)

Let's examine each principle with bad code and improved code examples in TypeScript.

#### 1. Single Responsibility

*A class should have only one reason to change.*

**Explanation:**
A class or module should do one thing and do it well. If a class is handling multiple responsibilities, a change in one responsibility can potentially impact others, leading to fragile and tightly coupled code.

**Bad Code**

```ts
class ReportGenerator {
  generateReport(data: any) {
    console.log("Generating report...");
    // Logic to generate report
  }

  saveToDatabase(report: string) {
    console.log("Saving report to database...");
    // Logic to save report
  }

  printReport(report: string) {
    console.log("Printing report...");
    // Logic to print report
  }
}

```

In this code, the class handles three responsibilities: generating, saving, and printing reports. Changes in printing logic could accidentally break report generation.

**Improved Code**

```ts
class ReportGenerator {
  generateReport(data: any): string {
    console.log("Generating report...");
    return "Generated Report";
  }
}

class ReportSaver {
  saveToDatabase(report: string) {
    console.log("Saving report to database...");
    // Logic to save report
  }
}

class ReportPrinter {
  printReport(report: string) {
    console.log("Printing report...");
    // Logic to print report
  }
}

// Usage
const generator = new ReportGenerator();
const saver = new ReportSaver();
const printer = new ReportPrinter();

const report = generator.generateReport({});
saver.saveToDatabase(report);
printer.printReport(report);

```

Now, **each class has one responsibility**, making them easy to modify and test independently.

#### 2. Open/Closed Principle (OCP)

*Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.*

**Explanation:**
You should be able to add new functionality without altering existing code. Modifying existing code can introduce bugs and cause regressions. Instead, use abstractions like interfaces or inheritance to extend functionality.

**Bad Code**

```ts
class NotificationService {
  sendNotification(type: string, message: string) {
    if (type === "email") {
      console.log(`Sending email: ${message}`);
    } else if (type === "sms") {
      console.log(`Sending SMS: ${message}`);
    } else {
      console.log("Unsupported notification type");
    }
  }
}

```

Adding a new notification type (e.g., Push Notification) requires modifying the existing `sendNotification` method, which violates OCP.

**Improved Code**

```ts
interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class NotificationService {
  private notification: Notification;

  constructor(notification: Notification) {
    this.notification = notification;
  }

  notify(message: string) {
    this.notification.send(message);
  }
}

// Usage:
const emailService = new NotificationService(new EmailNotification());
emailService.notify("Hello via Email");

const smsService = new NotificationService(new SMSNotification());
smsService.notify("Hello via SMS");

```

Adding a new notification type (e.g., PushNotification) now requires **only creating a new class** without modifying the existing ones.

#### 3. Liskov Substitution Principle (LSP)

*Subtypes must be substitutable for their base types without altering program behavior.*

**Explanation:**
Derived classes must be able to replace their base classes without causing unexpected behavior. This ensures that polymorphism works correctly and that the code remains consistent.

**Key Points**
- Inheritance and polymorphism (behavior consistency)
- Ensure substitutability of subclasses without breaking correctness
- Prevents **unexpected behavior** and violations in inheritance hierarchies
- Subclasses can seamlessly replace their base class without altering the program's functionality


**Bad Code**

```ts
class Bird {
  fly() {
    console.log("I can fly");
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly");
  }
}

function makeBirdFly(bird: Bird) {
  bird.fly();
}

const penguin = new Penguin();
makeBirdFly(penguin); // Error: Penguins can't fly


```

Here, substituting `Penguin` for `Bird` violates LSP because `Penguin` does not fully behave like a `Bird`.

**Improved Code**

```ts
abstract class Bird {
  abstract move(): void;
}

class FlyingBird extends Bird {
  move() {
    console.log("I can fly");
  }
}

class NonFlyingBird extends Bird {
  move() {
    console.log("I can walk");
  }
}

function makeBirdMove(bird: Bird) {
  bird.move();
}

const sparrow = new FlyingBird();
makeBirdMove(sparrow);

const penguin = new NonFlyingBird();
makeBirdMove(penguin);


```

Now, both `FlyingBird` and `NonFlyingBird` conform to the Bird abstraction, ensuring no unexpected behavior.

#### 4. Interface Segregation Principle (ISP)

*Clients should not be forced to implement interfaces they do not use.*

**Explanation:**
Large interfaces should be broken into smaller, more specific ones. This ensures that classes only implement the methods they need.

**Key Points**
- Interfaces (design of contracts)
- Avoid forcing a class to implement irrelevant methods
- Prevents **fat interfaces** and unnecessary dependencies
- Interfaces are small, focused, and tailored to client needs	

**Bad Code**

```ts
interface Animal {
  eat(): void;
  fly(): void;
  swim(): void;
}

class Dog implements Animal {
  eat() {
    console.log("Dog is eating");
  }

  fly() {
    throw new Error("Dogs can't fly");
  }

  swim() {
    console.log("Dog is swimming");
  }
}

```

`Dog` is forced to implement `fly()`, even though it doesn't make sense for dogs.

**Improved Code**

```ts
interface Eatable {
  eat(): void;
}

interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Dog implements Eatable, Swimmable {
  eat() {
    console.log("Dog is eating");
  }

  swim() {
    console.log("Dog is swimming");
  }
}


```

Now, `Dog` only implements the interfaces it needs.


#### 5. Dependency Inversion Principle (DIP)

*High-level modules should not depend on low-level modules. Both should depend on abstractions.*

**Explanation:**
The dependency between classes should be on abstractions (e.g., interfaces) rather than concrete implementations. This reduces coupling and makes code more flexible.



**Bad Code**

```ts
class SQLDatabase {
  connect() {
    console.log("Connecting to SQL database...");
  }
}

class App {
  private db: SQLDatabase;

  constructor() {
    this.db = new SQLDatabase();
  }

  start() {
    this.db.connect();
  }
}


```

The `App` class is tightly coupled with `SQLDatabase`. Switching to another database requires changes in the `App` class.

**Improved Code**

```ts
interface Database {
  connect(): void;
}

class SQLDatabase implements Database {
  connect() {
    console.log("Connecting to SQL database...");
  }
}

class MongoDB implements Database {
  connect() {
    console.log("Connecting to MongoDB...");
  }
}

class App {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  start() {
    this.db.connect();
  }
}

// Usage:
const app1 = new App(new SQLDatabase());
app1.start();

const app2 = new App(new MongoDB());
app2.start();

```

Now, `App` depends on the `Database` abstraction, making it easy to switch database implementations without modifying the `App` class.

#### **Summary:**

1. **SRP:** Break classes into smaller, focused classes.
2. **OCP:** Extend functionality via inheritance or composition instead of modifying existing code.
3. **LSP:** Ensure derived classes can replace their base classes without breaking behavior.
4. **ISP:** Break large interfaces into smaller, specific ones.
5. **DIP:** Depend on abstractions, not concrete implementations.

By following these principles, you'll create modular, testable, and maintainable TypeScript applications!

### 2. DRY (Don't Repeat Yourself)

- **Principle:** Avoid duplication of code or logic.
- **Explanation:** Each piece of knowledge should be represented in a single place in the codebase. Redundant code makes maintenance harder and increases the chances of bugs.
- **Example:** Instead of copying and pasting a function, extract it into a reusable method.

### 3. YAGNI (You Aren't Gonna Need It)

- **Principle:** Only implement features that are needed now, not what you might need in the future.
- **Explanation:** Avoid over engineering and building unnecessary features, as they might never be used, leading to wasted effort and complexity.

### 4. KISS (Keep It Simple, Stupid)

- **Principle:** Keep your code as simple as possible.
- **Explanation:** Simpler code is easier to read, maintain, and debug. Avoid unnecessary complexity unless absolutely required.

### 5. Inversion of Control (IoC)

- **Principle:** A class should not create its own dependencies. It should rely on external control (inversion of control). A class should not manage its dependencies directly but instead rely on an external entity to provide them.
- **Explanation:** This leads to more flexible and decoupled code, where components can be easily swapped or replaced.

### 6. Dependency Injection (DI)

- **Principle:** DI is a way to achieve IoC by injecting dependencies (usually through constructors or setters). A specific form of IoC where dependencies are provided to a class by an external entity (e.g., via a constructor or setter).
- **Explanation:** Promotes testability and reduces tight coupling between classes.

### 7. Separation of Concerns (SoC)

**Principle:** Different parts of a program should handle distinct concerns or responsibilities.
**Explanation:** Helps achieve modularity and simplifies code maintenance.

### 8. The Law of Demeter (LoD)

- **Principle:** A module should only talk to its immediate friends and not strangers (no "train wrecks").
- **Explanation:** Minimize dependencies between classes by limiting how objects communicate with each other.

### 9. Modularity

- **Principle:** Divide the system into smaller, independent, and interchangeable modules.
- **Explanation:** Facilitates code reuse, parallel development, and easier debugging.

### 10. Code Reusability

- **Principle:** Design systems in a way that components can be reused across different projects or modules.
- **Explanation:** Saves time and effort by reducing duplication.

### 11. Least Privilege

- **Principle:** Grant only the permissions necessary to perform a task.
- **Explanation:** Enhances security and minimizes potential damage from mistakes or attacks.

### 12. Fail Fast

- **Principle:** Systems should immediately report any failure.
- **Explanation:** Detecting issues early helps in debugging and avoids propagating errors further in the system.

### 13. High Cohesion and Low Coupling

- **Principle:** Modules should be highly cohesive (focused on a single task) and loosely coupled (interdependent as little as possible).
- **Explanation:** Improves code readability, scalability, and maintainability.

### 14. Single Source of Truth (SSoT)

**Principle:** Data should have only one authoritative source.
**Explanation:** Avoids data inconsistencies and simplifies debugging.

### 15. Composition Over Inheritance

- **Principle:** Prefer using composition (object relationships) instead of inheritance for code reuse.
- **Explanation:** Reduces tight coupling and allows for greater flexibility.

### 16. Persistence Ignorance

- **Principle:** Business logic should not be dependent on how data is stored or retrieved.
- **Explanation:** Decouple domain logic from persistence mechanisms.
