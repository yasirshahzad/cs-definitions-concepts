Mastering **EJS**, **Pug**, and **Marko** involves understanding how each template engine works, how they differ, and how to use them effectively in production projects. Here's a detailed guide with **intermediate-to-advanced** concepts for each.

---

## 📌 Overview of Templating Engines

| Feature        | EJS                         | Pug                                 | Marko                              |
| -------------- | --------------------------- | ----------------------------------- | ---------------------------------- |
| Syntax         | HTML + JS tags              | Indentation-based (no closing tags) | HTML-like with custom tags         |
| Learning Curve | Low                         | Medium                              | High                               |
| Performance    | Medium                      | Fast                                | Very Fast (compiled templates)     |
| Reactivity     | None                        | None                                | Built-in reactivity                |
| Use Case       | Simple server-rendered HTML | Minimalistic views                  | Complex, reactive UIs (like React) |

---

## 1. 🧩 **EJS (Embedded JavaScript Templates)**

### ✅ Setup

```bash
npm install ejs
```

```js
app.set("view engine", "ejs");
```

### ✅ Syntax Basics

```ejs
<h1>Hello <%= name %></h1>        <!-- Escapes output -->
<h1><%- unescapedHTML %></h1>    <!-- Renders raw HTML -->
<% if (isLoggedIn) { %>
  <p>Welcome back!</p>
<% } %>
<% for (let item of list) { %>
  <li><%= item %></li>
<% } %>
```

### ✅ Partial Templates

```ejs
<%- include('partials/header') %>
```

---

## 2. 🧱 **Pug (formerly Jade)**

### ✅ Setup

```bash
npm install pug
```

```js
app.set("view engine", "pug");
```

### ✅ Syntax Basics

```pug
h1 Hello #{name}
if isLoggedIn
  p Welcome back!
ul
  each item in list
    li= item
```

### ✅ Mixins (like Components)

```pug
mixin button(text)
  button.btn= text

+button("Click Me")
```

### ✅ Inheritance

```pug
// layout.pug
doctype html
html
  head
    title My App
  body
    block content
```

```pug
// home.pug
extends layout

block content
  h1 Welcome
```

---

## 3. 🚀 **Marko (UI-oriented templating like React)**

### ✅ Setup

```bash
npm init marko
npm install @marko/express
```

```js
app.use(require("@marko/express")());
app.get("/", (req, res) => {
  res.marko(require("./views/index.marko"), { name: "World" });
});
```

### ✅ Syntax Basics

```marko
<h1>Hello ${input.name}</h1>

<ul>
  <for|item| of=input.items>
    <li>${item}</li>
  </for>
</ul>
```

### ✅ Components

```marko
// my-button.marko
<template>
  <button class="btn"><!>${input.label}</button>
</template>
```

```marko
// usage
<my-button label="Click Me" />
```

### ✅ Reactivity

Marko supports state and reactive variables:

```marko
$ const count = 0;
<button on-click("increment")>Clicked ${count} times</button>
<script>
  function increment() {
    count++;
  }
</script>
```

---

## 🔄 Comparison by Use Case

| Use Case                      | Best Choice |
| ----------------------------- | ----------- |
| Simple websites or dashboards | **EJS**     |
| Minimalist views & clean code | **Pug**     |
| Interactive & reactive UI     | **Marko**   |

---

## 🎯 Mastery Tips

- ✅ **EJS**: Learn how to organize views into layouts, use `express-ejs-layouts`, avoid logic-heavy templates.
- ✅ **Pug**: Use mixins for components, learn layout inheritance, use filters (like `:markdown`).
- ✅ **Marko**: Embrace the component mindset, use its built-in reactivity, explore Marko's compiler options and hydration for SSR + CSR apps.
