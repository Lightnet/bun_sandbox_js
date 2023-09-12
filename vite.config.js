
//import { join, dirname } from 'node:path'
//import { fileURLToPath } from 'node:url'
//import path from 'path';
//import { resolve } from 'path';
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
//import fastify from 'vite-plugin-fastify';
//const __dirname = import.meta.dir;
//const __dirname = path.dirname(import.meta.url);

//console.log("__dirname: ", __dirname)
//console.log("path.join(__dirname, 'src'): ", path.join(__dirname, 'src'))
//console.log("PATH>>>: ",dirname(fileURLToPath(new URL(import.meta.url))))

export default defineConfig({
  //root: join(dirname(fileURLToPath(new URL(import.meta.url))), './'),
  //root: join(dirname(fileURLToPath(new URL(import.meta.url))), 'src'),
  server:{
    host: '127.0.0.1',
    port:3000
  },
  plugins: [
    solid(),
    //fastify({
      //appPath: './fastify_app.js', // Default: <rootDir>/src/app.ts
      //serverPath: './server.js', // Default: <rootDir>/src/server.ts
    //}),
  ],
  resolve: {
    alias: {
      //'~': resolve(__dirname, 'src'),
      //'~': path.join(__dirname, 'src'),
    },
  },
})
