# ⚡PM2

For production apps, use **better cluster management tools**:

- **PM2** (very popular)
  - Handles clustering automatically.
  - Process monitoring.
  - Easy restarting and scaling.

Example with PM2:

```bash
pm2 start clusteredServer.js -i max
```

`-i max` means "spawn as many workers as CPU cores".

## 📋 Full Quick Table for Clustering Summary

| Feature            | Native Cluster         | PM2                       |
| :----------------- | :--------------------- | :------------------------ |
| Create workers     | `cluster.fork()`       | `pm2 start app.js -i max` |
| Respawn workers    | Manual in `exit` event | Automatic                 |
| Process monitoring | Manual                 | Built-in                  |
| Production-ready   | Needs setup            | Yes                       |
| Memory monitoring  | Manual                 | Built-in                  |

## 🧠 Important Notes

- Workers **share the same server port**.
- Workers **do not share memory** — each has its **own memory space**.
- Use external systems like **Redis**, **Postgres**, **RabbitMQ** for shared session/data management between workers.
- If one worker crashes, the master can restart it automatically (you should implement this).

## ✅ To truly master it, you should

- Understand **forking logic**.
- Be able to **restart crashed workers**.
- Learn **session sharing** (Redis Store if sessions are needed).
- Practice **load testing** using `Apache Bench`, `wrk`, or `k6`.
- Use **PM2** in production.

## 📚 What is PM2?

- **Production Process Manager** for Node.js (and other apps).
- Manages **clustering**, **auto-restarts**, **logging**, **monitoring**, and **load balancing**.
- It **keeps your app alive** forever, even if crashes happen.

✅ It's the industry-standard way to run Node.js servers in production.

### 🚀 Install PM2

Install it globally:

```bash
npm install -g pm2
```

Check version:

```bash
pm2 -v
```

### ⚡ Basic Usage (Quick Recap)

| Command            | Purpose           |
| :----------------- | :---------------- |
| `pm2 start app.js` | Start app         |
| `pm2 list`         | Show running apps |
| `pm2 stop app`     | Stop app          |
| `pm2 restart app`  | Restart app       |
| `pm2 delete app`   | Delete app        |

## 🧠 Now, **Go Advanced** PM2 Features

### 1. **Cluster Mode** (Multi-Core Auto Balancing)

Start in **cluster mode**:

```bash
pm2 start app.js -i max
```

- `-i max` → PM2 forks **one worker per CPU core**.
- Super easy clustering — no manual `cluster` code needed!

👉 You can also specify number manually:

```bash
pm2 start app.js -i 4
```

(4 workers)

### 2. **Auto-Restart on Crash or Memory Leak**

Set a **memory limit**:

```bash
pm2 start app.js --max-memory-restart 300M
```

- If the process exceeds 300 MB → it restarts automatically!

---

### 3. **Environment Variables**

Pass **different env vars** easily:

```bash
pm2 start app.js --env production
```

You can configure them in a `ecosystem.config.js` file too (I'll show below 👇).

---

### 4. **Zero Downtime Reload** (Rolling Restarts)

When you update your code:

- You don't want downtime for users.

Use:

```bash
pm2 reload app
```

✅ It reloads the app gracefully, without killing existing connections!

---

### 5. **Auto Startup on Server Reboot** (important in real servers)

Install startup script:

```bash
pm2 startup
```

This generates a command like:

```bash
sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u your-username
```

Then:

```bash
pm2 save
```

✅ Your app will automatically start on server reboot.

---

### 6. **Monitoring and Logs**

Real-time monitoring:

```bash
pm2 monit
```

See real-time CPU, memory, and logs.

View logs:

```bash
pm2 logs
```

Filter logs:

```bash
pm2 logs app-name
```

---

### 7. **Log Management**

PM2 rotates logs so files don't become huge:

Install log-rotate:

```bash
pm2 install pm2-logrotate
```

Configure it:

```bash
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

✅ Automatically rotates and deletes old logs!

---

### 8. **Use Ecosystem File (Production Setup)**

Instead of typing long commands, you define everything in a config file.

Create `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: "my-app",
      script: "./app.js",
      instances: "max", // Auto scale
      exec_mode: "cluster", // cluster mode
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 80,
      },
    },
  ],
};
```

Start with:

```bash
pm2 start ecosystem.config.js --env production
```

✅ Very clean, very professional.

---

### 9. **Deploy Code with PM2 (Zero Downtime)**

PM2 can **deploy code** via SSH.

Setup in `ecosystem.config.js`:

```js
module.exports = {
  apps: [...],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo.git',
      path: '/var/www/your-app',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
```

Then:

```bash
pm2 deploy production
```

✅ It connects to your server, pulls latest code, installs packages, reloads app.

---

## 🔥 Bonus Commands

| Command                      | Use                                    |
| :--------------------------- | :------------------------------------- |
| `pm2 restart all`            | Restart all apps                       |
| `pm2 stop all`               | Stop all apps                          |
| `pm2 delete all`             | Delete all apps                        |
| `pm2 describe app`           | Full info about an app                 |
| `pm2 env 0`                  | See environment vars for app with id 0 |
| `pm2 sendSignal SIGUSR2 app` | Send custom signals                    |

---

## 🎯 How PM2 Makes You Production-Ready

✅ Load balancing (multi-core use)  
✅ Auto-restart on crash/memory leak  
✅ Zero downtime reloads  
✅ Centralized logging and log rotation  
✅ Start on reboot  
✅ SSH deployment automation

### 📋 Full PM2 Quick Summary Table

| Feature          | Command                    |
| :--------------- | :------------------------- |
| Install PM2      | `npm install -g pm2`       |
| Start App        | `pm2 start app.js`         |
| Cluster Mode     | `pm2 start app.js -i max`  |
| Zero Downtime    | `pm2 reload app`           |
| Monitor App      | `pm2 monit`                |
| Show Logs        | `pm2 logs`                 |
| Startup on Boot  | `pm2 startup` → `pm2 save` |
| Setup Deploy     | `pm2 deploy production`    |
| Ecosystem Config | `ecosystem.config.js`      |
