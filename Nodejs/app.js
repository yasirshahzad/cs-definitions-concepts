const EventEmitter = require("events");

class AuthSystem extends EventEmitter {
  constructor() {
    super();
    this.users = new Map(); // Store users in a Map for quick access
  }

  register(username, password) {
    if (this.users.has(username)) {
      this.emit("error", new Error("User already exists"));
      return;
    }

    this.users.set(username, password);
    this.emit("registered", username);
  }

  login(username, password) {
    if (!this.users.has(username)) {
      this.emit("error", new Error("User not found"));
      return;
    }

    if (this.users.get(username) !== password) {
      this.emit("error", new Error("Invalid password"));
      return;
    }

    this.emit("loggedIn", username);
  }
}

const authSystem = new AuthSystem();

// Event listeners
authSystem.on("registered", (username) => {
  console.log(`User ${username} registered successfully.`);
});

authSystem.on("loggedIn", (username) => {
  console.log(`User ${username} logged in successfully.`);
});

authSystem.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});
