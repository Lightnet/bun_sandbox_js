// TEST

//import { createSignal } from 'solid-js'

import SimpleScene from './three/SimpleScene.jsx';

function App() {

  //const [count, setCount] = createSignal(0)
  console.log("init app");
  //<SimpleScene/>
  return (
    <>
      <h1>Bun + Vite + Solid</h1>
      <SimpleScene/>
    </>
  )
}

export default App
