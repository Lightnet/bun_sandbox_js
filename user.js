console.log("user client test");

async function click_signin(){
  console.log("sign in")
  let alias = document.getElementById('alias').value;
  let password = document.getElementById('pass').value;
  const resp = await fetch("/api/auth/signin",{
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

async function click_signup(){
  console.log("sign up")
  let alias = document.getElementById('alias').value;
  let password = document.getElementById('pass').value;
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