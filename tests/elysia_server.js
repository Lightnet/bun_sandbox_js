//elysia
// https://elysiajs.com fast for bun

import { Elysia } from 'elysia'

const app = new Elysia();

app.get('/', () => 'Hello Elysia');

app.get('/json', () => new Response(
  JSON.stringify({
      'vtuber': [
          'Shirakami Fubuki',
          'Inugami Korone'
      ]
  }, {
      headers: {
          'Content-Type': 'application/json'
      }
  })
  )
);

app.listen(8080);
 
console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)