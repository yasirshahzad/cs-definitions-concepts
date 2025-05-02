# 🚀 Nodejs

## 1. Introduction

1. What is Node.js?
2. Why use Node.js?
3. History of Node.js?
4. Node.js vs Browser
5. Running Node Code

[Read Here](./overview.md)

## 2. Modules

- [CommonJs](/Nodejs/sub/modules.md)
- [ESM Modules](/Nodejs/sub/modules.md)
- [Creating Custom Modules](/Nodejs/sub/modules.md)
- [`global` Keyword](/Nodejs/sub/modules.md)

## 3. npm

- [`npx`](/Nodejs/sub/npm.md)
- [`Updating packages`](/Nodejs/sub/npm.md)
- [`Using Installed packages`](/Nodejs/sub/npm.md)
- [`Running Scripts`](/Nodejs/sub/npm.md)
- [`Npm Workspaces`](/Nodejs/sub/npm.md)

## 4. Error Handling

- [Types of Errors](/Nodejs/sub/errors.md#1-types-of-errors)
- [Uncaught Exceptions](/Nodejs/sub/errors.md#-2-uncaught-exceptions)
- [Handling Async Errors](/Nodejs/sub/errors.md#-3-handling-async-errors)
- [Call Stack & Stack Trace](/Nodejs/sub/errors.md#-4-call-stack--stack-trace)
- [Debugging NodeJs](/Nodejs/sub/errors.md#-5-using-debugger)

## 5. Async Programming

- [Writing Async Code:](/Nodejs/async_programing/what_is_async_prog.md)
  - [Promises](/Nodejs/async_programing//writing_async_code.md)
  - [async/await](/Nodejs/async_programing//writing_async_code.md)
  - [Callbacks](/Nodejs/async_programing//writing_async_code.md)
  - [setTimeout](/Nodejs/async_programing//writing_async_code.md)
  - [setInterval](/Nodejs/async_programing//writing_async_code.md)
  - [setImmediate](/Nodejs/async_programing//writing_async_code.md)
  - [process.nextTick](/Nodejs/async_programing//writing_async_code.md)
- [Event Emitter](/Nodejs/async_programing/event_emitter.md)
- [Event Loop](/Nodejs/async_programing/event_emitter.md)

## 6. Working with files

- [fs module](/Nodejs/files/fs.md)
- [path module](/Nodejs/files/path.md)
- [process.cwd()](/Nodejs/files/path.md)
- [\_\_dirname](/Nodejs/files/path.md)
- [\_\_filename](/Nodejs/files/path.md)

## 6. Event Loop and Node Internals

### 1. Internals

- [V8 Engine](/Nodejs/sub/internals.md)
- [libuv](/Nodejs/sub/internals.md)
- [Event Loop](/Nodejs/sub/internals.md)

## 9. Command Line Apps

- Printing Output
  - [process.stdout](/Nodejs/command_line_app/printing_output.md)
  - [process.stderr](/Nodejs/command_line_app/printing_output.md)
  - [cli-progress package](/Nodejs/command_line_app/printing_output.md)
  - [chalk package](/Nodejs/command_line_app/printing_output.md)
- Taking Input
  - [process.stdin](/Nodejs/command_line_app/taking_input.md)
  - [Prompts package](/Nodejs/command_line_app/taking_input.md)
  - [Inquirer package](/Nodejs/command_line_app/taking_input.md)
- Environment Variables
  - [process.env](/Nodejs/command_line_app/evn.md)
  - [dotenv package](/Nodejs/command_line_app/evn.md)

## 10. Working with API

- Authentication
  [passport.js](/Nodejs/sub/passportjs.md)
  [jsonwebtoken](/Nodejs/sub/auth.md)
  [OAuth 2.0 / OpenID Connect](/Nodejs/sub/auth.md)
  [Session-based Authentication](/Nodejs/sub/auth.md)

- HTTP Server
  - [HTTP](/Nodejs/server/http.md)
  - [Realtime - Socket.io](/Nodejs/Readme.md)
  - [ExpressJs](/Nodejs/server/expressjs.md)
  - [Fastify](/Nodejs/server/fastify.md)
  - [NestJs] (/NodeJs/server/nestjs.md)

## 11. Keeping Application Running

- [Nodemon](/Nodejs/sub/keep_app_runing.md)

## 12. Templating Engines

- [ej](/Nodejs/template_engines/templates_engines.md)
- [pug](/Nodejs/template_engines/templates_engines.md)
- [marko](/Nodejs/template_engines/templates_engines.md)

## 13. Working with Databases

Pending

## 14. Testing

- [Testing](/Testing/README.md)
- [Unit](/Testing/Unit.md)
- [Integration Testing](/Testing/IntegrationTesting.md)
- [TDD](/Testing/TDD.md)

Pending

## 15. Logging

1. [Winston](/Nodejs/logging/winston.md)
1. [Morgan](/Nodejs/logging/morgan.md)

## 16. Keeping App Running

1. [Pm2](/Nodejs/sub/pm2.md)
2. forever Package
3. nohup

## 17. Threads

- [Overview](/Nodejs/threads/overview.md)
- [Child Processes](/Nodejs/threads/child_process.md)
- [Cluster](/Nodejs/threads/cluster.md)
- [Worker Threads](/Nodejs/threads/cluster.md)

## 18. More Debugging

-- Memory Leaks
-- node --inspect
-- Using APM

## 19. Common Built-in Modules

1. [fs](/Nodejs/sub/fs.md)
2. [os](/Nodejs/sub/os.md)
3. [net](/Nodejs/sub/net.md)
4. [Path](/Nodejs/sub/path.md)
5. [url](/Nodejs/sub/url.md)
6. [events](/Nodejs/async_programing/event_emitter.md)
7. [http/https](/Nodejs/server/http.md)
8. [crypto](/Nodejs/sub/crypto.md)
9. [process](/Nodejs/sub/process.md)
10. [perf_hooks](/Nodejs/sub/perf_hooks.md)
11. [Buffer](/Nodejs/sub/buffer.md)
12. [Streams](/Nodejs/sub/streams.md)

## 20. Security Practices

- [Helmet.js](/Nodejs/sub/security.md)
- [CSRF Protection](/Nodejs/sub/security.md)
- [Rate Limiting](/Nodejs/sub/security.md)
- [Input Validation/Sanitization](/Nodejs/sub/security.md)
- [Password Hashing](/Nodejs/sub/security.md)
- [XSS/SQL Injection](./sub/xss.md)

## 21. Benchmarking & Load Testing

These tools are essential for testing performance under stress and identifying bottlenecks.

- Benchmarking Tools:

  - [artillery](/Nodejs/benchmark/artillery.md) – Powerful load testing toolkit for APIs
  - [k6](/Nodejs/benchmark/k6.md) – Scripting-based performance testing tool (great with CI)
  - Apache Benchmark (ab) – Simple CLI load testing
  - autocannon – Fast HTTP benchmarking tool by Matteo Collina
  - wrk – Modern HTTP benchmarking tool (native)
  - bombardier – High-performance HTTP(S) benchmarking tool

- Usage Techniques:

  - Creating baselines
  - Simulating real-world load
  - Analyzing latency, RPS (requests per second), and throughput
  - Integrating with CI/CD pipelines

[Read more](./benchmark/techniques.md)

## 22. Performance Optimization

- Profiling Node.js apps using:

  - Chrome DevTools (`node --inspect`)
  - `clinic.js` suite (doctor, flamegraph, bubbleprof)
  - `0x` – Flamegraph profiler

- Memory leaks and garbage collection:
  - CPU bottlenecks
  - Event loop delays (`perf_hooks`, `blocked-at`)
  - Avoiding synchronous code
  - Efficient I/O and buffer management

[Read more](./benchmark/profiling.md)

## 23. Application Architecture

- Monolith vs Microservices in Node.js
- MVC, Clean Architecture, Hexagonal Architecture
- Folder structure best practices
- Using DI containers like awilix
- [Nx monorepo](./architecture/nx.md)

[Read more](./architecture/overview.md)

## 24. Message Queues and Jobs

- [Redis](../Redis/Notes.docx)
- [RabbitMQ](../RabbitMQ/Notes.docx) / Kafka integration
- AWS SQS
- AWS Event Bridge
