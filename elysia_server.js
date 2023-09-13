//elysia
// https://elysiajs.com fast for bun
// https://dev.to/gaurishhs/create-a-crud-app-with-bun-and-elysiajs-gjn
// https://bun.sh/docs/runtime/hot
// https://elysiajs.com/plugins/jwt.html
// https://elysiajs.com/plugins/cookie.html
// https://elysiajs.com/plugins/static.html
// 
// 

import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html'
import { Database } from "bun:sqlite";
import { cookie } from '@elysiajs/cookie'
import { jwt } from "@elysiajs/jwt";

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
/*
app.get("/test.js", async () => {
    //console.log(await Bun.file("test.js").text())
    let content = await Bun.file("test.js").text();
    console.log(content)
    return new Response(content, {
      headers: {
        'Content-Type': 'application/javascript'
      }
    })
  }
)

app.get("/user.js", async () => {
  //console.log(await Bun.file("test.js").text())
  let content = await Bun.file("user.js").text();
  //console.log(content)
  return new Response(content, {
    headers: {
      'Content-Type': 'application/javascript'
    }
  })
}
)
*/
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
//===============================================
// TO DO TASKS
//===============================================

app.get('/task', () => Bun.file("template/task.html").text());
/*
app.get("/task.js", async () => {
  //console.log(await Bun.file("test.js").text())
  let content = await Bun.file("task.js").text();
  console.log(content)
  return new Response(content, {
    headers: {
      'Content-Type': 'application/javascript'
    }
  })
})
*/

app.get("/api/task", async () => {

  let tasks = db.query('SELECT * FROM tasks').all();
  if(tasks){
    console.log(tasks);
    return tasks;
  }

  return new Response(JSON.stringify({api:"ERROR"}))
})

app.post("/api/task", async ({body}) => {
  console.log(body)

  if (body){
    if((body.content != null) && (body.content != "")){
      console.log("found")
      let query = db.query(`INSERT INTO tasks (content) VALUES (?) RETURNING id`)
        .get(body.content);
      console.log("add query: ",query);
      return new Response(JSON.stringify({api:"CREATED",id:query.id}))
    }
  }

  return new Response(JSON.stringify({api:"ERROR"}), {
    //headers
  })
});

app.delete("/api/task/:id", async ({ params }) => {
  if(params?.id){
    //let id = parseInt(params.id)
    let id = params.id
    console.log("DELETE: ", id)
    try {
      let query = db.query(`DELETE FROM tasks WHERE id = ?`).get(id);  
      console.log("query: ",query)
      return new Response(JSON.stringify({api:"DELETE"}))
    } catch (error) {
      console.log("DELETE DB ERROR:",error);
    }
  }
  
  return new Response(JSON.stringify({api:"ERROR"}), {
    //headers
  })
});

//app.patch("/api/task/:id")
app.put("/api/task/:id",({params, body})=>{
  if((body !=null) && (params !=null)){
    if((body.content != null)&&(body.content != "") && (params.id !=null)){
      try {
        let query = db.query(`UPDATE tasks SET content = ?  WHERE id = ?`).get(body.content, params.id);  
        console.log("query: ",query)
        return new Response(JSON.stringify({api:"UPDATE"}))
      } catch (error) {
        console.log("DELETE DB ERROR:",error);
      }
    }
  }

  return new Response(JSON.stringify({api:"ERROR"}), {
    //headers
  })
})

app.get('/testtoken', async ({setCookie}) => {
  setCookie('auth', 'test', {
    httpOnly: true,
    maxAge: 7 * 86400,
  })
  //return new Response('token')
  return 'testtoken'
})

app.get('/json', () => new Response(
  JSON.stringify(
    {
      'vtuber': [
        'John Doe',
        'test guest'
      ]
    }, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
  )
);

//works
app.get('/rawjson', () => {
  return {text:"test"}
})

app.listen(8080);
 
console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
//END SERVER