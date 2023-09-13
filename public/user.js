//basic login and register tests.


import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.0.min.js";

console.log("user client test");

const {a, button, div, label, input} = van.tags

//set up query
async function click_signin(){
  console.log("sign in")
  let alias = document.getElementById('alias').value;
  let passphrase = document.getElementById('passphrase').value;
  if((!alias)||(!passphrase)){
    console.log("EMPTY!");
    return;
  }
  const resp = await fetch("/api/auth/signin",{
    method:'POST',
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      alias:alias,
      passphrase:passphrase
    })
  })
  const data = await resp.json()
  if(data){
    console.log("data: ", data )
  }
}

async function click_signup(){
  console.log("sign up")
  let alias = document.getElementById('alias').value;
  let password = document.getElementById('passphrase').value;
  if((!alias)||(!password)){
    console.log("EMPTY!");
    return;
  }
  const resp = await fetch("/api/auth/signup",{
    method:'POST',
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      alias:alias,
      passphrase:password
    })
  })
  const data = await resp.json()
  if(data){
    console.log("data: ", data )
  }
}

// create html element
const UserEL = () =>{
  return div(
    label("Alias"),
    input({id:"alias",placeholder:"User Name"}),
    label("Password"),
    input({id:"passphrase",placeholder:"Password / Passphrase"}),
    button({onclick:()=>click_signin()},"Login"),
    button({onclick:()=>click_signup()},"Register"),
    a({href: "/task"},"Task")
  )
}

van.add(document.body, UserEL())