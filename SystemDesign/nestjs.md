# Nestjs

## 1. **Core Concepts of NestJS (Mandatory Mastery)**

You must be able to **explain, design, and implement** these _without hesitation_:

| Concept               | What to Master                                        | Example Skill                                  |
| :-------------------- | :---------------------------------------------------- | :--------------------------------------------- |
| **Modules**           | Structure your app with shared, feature, core modules | Design a modular monolith                      |
| **Providers**         | Services, Repositories, Factories                     | Dependency Injection (DI)                      |
| **Controllers**       | Route handling, versioning, request lifecycle         | Advanced decorators (`@Req()`, `@Res()`, etc.) |
| **Middleware**        | Before route handling (e.g., auth, logging)           | Custom global middleware                       |
| **Guards**            | Authorization, permissions                            | RBAC (Role-based access control)               |
| **Interceptors**      | Transform responses, logging, caching                 | Wrap responses, log execution time             |
| **Pipes**             | Validation, transformation                            | DTO validation using class-validator           |
| **Exception Filters** | Custom error handling                                 | Global and scoped filters                      |
| **Lifecycle Hooks**   | `onModuleInit`, `onApplicationShutdown`, etc.         | Graceful shutdown, startup tasks               |
| **Custom Decorators** | Create your own decorators                            | `@CurrentUser()`                               |

## 2. **Advanced NestJS Topics**

Senior candidates must **go deeper** than basics:

- **Custom Providers** (`useFactory`, `useClass`, `useExisting`)
- **Request-Scoped Providers** (memory-heavy but important)
- **Dynamic Modules** (conditionally configure a module)
- **CQRS Pattern** (with `@nestjs/cqrs`)
- **Microservices** (TCP, Redis, RabbitMQ transporters)
- **WebSockets** (real-time apps)
- **Task Scheduling** (`@nestjs/schedule`)
- **GraphQL with NestJS** (code-first & schema-first)
- **Authentication**:
  - JWT & Passport Strategies
  - OAuth2 flows
- **Authorization**:
  - ABAC (Attribute Based Access Control)
  - Multi-tenant apps
- **Configuration Management**:
  - `@nestjs/config`
  - Secrets, environments
- **Validation**:
  - `class-validator`, `class-transformer`
- **Testing**:
  - Unit Tests (`@nestjs/testing`)
  - E2E Tests with Supertest
  - Mocking services, repositories

## 3. **Architecture Patterns**

Senior devs must understand:

- **Monolithic vs Microservices** in NestJS
- **Hexagonal Architecture** (Ports and Adapters)
- **Domain-Driven Design (DDD)** — Application Layer, Domain Layer
- **Event-Driven Architecture** — Events, Event Handlers
- **Clean Architecture** — separation of concerns

## 4. **Databases**

You must **know ORMs inside NestJS**:

- **TypeORM**, **Prisma**, **Sequelize** (preferably 2 out of these 3)
- Database transaction management
- Soft Deletes
- Lazy Loading vs Eager Loading
- Database Migrations

## 5. **Performance and Best Practices**

- Batching (e.g., `Promise.all`)
- Connection Pooling
- Caching strategies (Redis)
- Throttling and Rate Limiting
- Streaming files (instead of buffering)
- Memory leak detection (Node.js heap analysis)

## 6. **Security**

- OWASP Top 10
- CSRF, CORS
- Secure JWT token storage
- Prevent NoSQL Injection (sanitize input)

## 7. **DevOps and Deployment**

- Environment-specific configs
- Dockerize NestJS applications
- Running NestJS in Kubernetes
- Health Checks (`@nestjs/terminus`)
- Graceful shutdown of Node apps
- Monitoring (Prometheus + Grafana)
