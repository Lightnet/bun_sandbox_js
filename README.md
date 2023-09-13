# bun_sandbox_js

# program:
 * Bun 1.0

# Packages:
 * elysiajs
   * cookie
   * html
   * jwt
   * static
 * solid-js
 * vite
 * vanjs 1.0.0  https://vanjs.org

# Information:
  This is just test build web http server run on bun application.

  By using Bun with elysiajs and sqlite for fast and simple http server.

  Simple auth login and register test. There are two type build for frontend render.

  Just to build test some features.

# Layout:
 * public ( client )
 * template ( client )
   * user.html
    * login
    * sign up
  * task.html
    * add
    * edit
    * delete
 * src
    * 'file name'.jsx ( client )
 * elysia_server.js ( test server )
   * login
   * sigin up
   * task
     * add
     * edit
     * delete
 * server.js ( main? server )
   * login
   * sigin up
 * vite.config.js
  * solidjs html client
  * server

# Features:
 * simple task add, edit and delete.
 * account register and login test.

# Windows:
```
wsl
```
Note you need to install sub linux to work.

To install dependencies:

# Command Lines:
```bash
bun install
```

To run:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
