//elysia
// https://elysiajs.com fast for bun
// https://dev.to/gaurishhs/create-a-crud-app-with-bun-and-elysiajs-gjn
// https://bun.sh/docs/runtime/hot
// https://elysiajs.com/plugins/jwt.html
// https://elysiajs.com/plugins/cookie.html
// https://elysiajs.com/plugins/static.html
// https://bun.sh/docs/runtime/hot
// 

import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html'
import { Database } from "bun:sqlite";
import { cookie } from '@elysiajs/cookie'
import { jwt } from "@elysiajs/jwt";

//globalThis.count ??= 0;
//console.log(`Reloaded ${globalThis.count} times`);
//globalThis.count++;

// prevent `bun run` from exiting
//setInterval(function () {}, 1000000);

//===============================================
// DATABASE
//===============================================
// https://bun.sh/docs/api/sqlite
const db = new Database("database.sqlite");
//const query = db.query("select 'Hello world' as message;");
//query.get(); // => { message: "Hello world" }
//console.log(query.get())

function create_tables(){
  //const query = db.query(`create table foo;`);
  //query.run();
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    alias TEXT, 
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    content TEXT, 
    isDone TEXT
  )`);
}

function drop_tables(){
  db.run("DROP TABLE users");
  db.run("DROP TABLE tasks");
}
//drop_tables()
create_tables();

//===============================================
// SERVER
//===============================================
const app = new Elysia();

app.decorate('db', db);
app.use(html());
app.use(staticPlugin({
  prefix:"/"
}));
app.use(
  jwt({
    name: "jwt",
    //secret: `Bun.env.JWT_SECRET!`,
    secret: `JWT_SECRET`,
  })
);
app.use(cookie({
  //httpOnly: false,
  //secure:false,
}));

//app.get('/', () => 'Hello Elysia');
app.get('/', () => Bun.file("template/user.html").text());

//===============================================
// AUTH
//===============================================
app.post("/api/auth/signup", async ({body}) => {
  console.log(body)

  if (body){
    if((body.alias != "") && (body.alias != null) && (body.passphrase !=null) && (body.passphrase != "")){
      console.log("found")
      let query = db.query("SELECT * FROM users WHERE alias = ?;").get(body.alias);
      console.log("query: ",query);
      if(query){
        return new Response(JSON.stringify({api:"EXIST"}))
      }else{
        query = db.query(`INSERT INTO users (alias, password) VALUES (?, ?) RETURNING id`)
          .get(body.alias,body.passphrase);
        console.log("add query: ",query);
        return new Response(JSON.stringify({api:"CREATED"}))
      }
    }
  }

  return new Response(JSON.stringify({api:"ERROR"}), {
    //headers
  })
});

app.post("/api/auth/signin", async ({body, set, jwt, setCookie}) => {
  console.log(body)

  if (body){
    if((body.alias != "") && (body.alias != null) && (body.passphrase !=null) && (body.passphrase != "")){
      console.log("found sign in...")
      let query = db.query("SELECT * FROM users WHERE alias = ?;").get(body.alias);
      console.log("query: ",query);
      if(query){
        //check login
        if(query.password == body.passphrase){
          const accessToken = await jwt.sign({
            userId: query.id,
          });
          console.log("accessToken: ", accessToken)
          setCookie("token", accessToken, {
            //maxAge: 15 * 60, // 15 minutes
            //maxAge: 86400, //
            httpOnly: true,
            //signed: false,
            path: "/",
          });
          console.log("FINISH?")
          return JSON.stringify({api:"GRANTED"});//able to set cookie
          //return new Response(JSON.stringify({api:"GRANTED"})) //nope can't set cookie 
          //return new Response(JSON.stringify({api:"GRANTED"}),{})
        }
        //else denied
        return new Response(JSON.stringify({api:"DENIED"}))
      }else{
        return new Response(JSON.stringify({api:"NONEXIST"}))
      }
    }
  }

  return new Response(JSON.stringify({api:"ERROR"}), {
    //headers
  })
});


app.listen(8080, ({ hostname, port }) => {
  console.log(`Elysia is Running at http://${hostname}:${port}`)
  //console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
});
//END SERVER