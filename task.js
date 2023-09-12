console.log("user client test");

let tasks = [];

async function get_tasks(){
  const resp = await fetch("/api/task")
  const data = await resp.json();
  if(data){
    console.log("get tasks")
    console.log(data)
    tasks = data;

    let taskElement = document.getElementById('tasks');

    for(idx in tasks){
      console.log(tasks[idx])
      let newDiv = document.createElement("div");
      newDiv.setAttribute('id', tasks[idx].id)
      let newLabel = document.createElement("label");
      newLabel.innerHTML = tasks[idx].content;

      let newButtonEdit = document.createElement("button");
      newButtonEdit.innerHTML = 'Edit';
      newButtonEdit.addEventListener('click',(event)=>{
        let id = event.target.parentNode.id; //<div id="">
        if(id){
          document.getElementById('taskid').value = id;
          for(idxEl in tasks){
            if(tasks[idxEl].id == id){
              document.getElementById('editcontent').value = tasks[idxEl].content
              break;
            }
          }
        }
      });

      let newButtonDelete = document.createElement("button");
      newButtonDelete.innerHTML = 'Delete';
      newButtonDelete.addEventListener('click',()=>{
        let id = event.target.parentNode.id; //div id=""
        click_delete(id);
      });
      newDiv.append(newLabel)
      newDiv.append(newButtonEdit)
      newDiv.append(newButtonDelete)

      taskElement.append(newDiv);
    }
  }
}
window.addEventListener("load", (event) => {
  get_tasks();
});

async function click_addtask(){
  console.log("add task")
  let task = document.getElementById('task').value;
  const resp = await fetch("/api/task",{
    method:'POST',
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      content:task,
    })
  })
  const data = await resp.json()
  if(data){
    console.log("data: ", data )
    if(data.api){
      if(data.api=='CREATED'){
        tasks.push({
          id:data.id,
          content:task,
          isDone:null
        })
        let taskElement = document.getElementById('tasks');

        let newDiv = document.createElement("div");
        newDiv.setAttribute('id', data.id)
        let newLabel = document.createElement("label");
        newLabel.innerHTML = task;
  
        let newButtonEdit = document.createElement("button");
        newButtonEdit.innerHTML = 'Edit';
        newButtonEdit.addEventListener('click',(event)=>{
          let id = event.target.parentNode.id; //<div id="">
          if(id){
            document.getElementById('taskid').value = id;
            for(idxEl in tasks){
              if(tasks[idxEl].id == id){
                document.getElementById('editcontent').value = tasks[idxEl].content
                break;
              }
            }
          }
        });
  
        let newButtonDelete = document.createElement("button");
        newButtonDelete.innerHTML = 'Delete';
        newButtonDelete.addEventListener('click',()=>{
          let id = event.target.parentNode.id; //div id=""
          click_delete(id);
        });
        newDiv.append(newLabel)
        newDiv.append(newButtonEdit)
        newDiv.append(newButtonDelete)
  
        taskElement.append(newDiv);
      }
    }
  }
}

async function click_delete_id(){
  console.log("add task")
  let taskid = document.getElementById('taskid').value;
  const resp = await fetch("/api/task/"+taskid,{
    method:'DELETE',
    //headers:{
      //"Content-Type": "application/json",
    //}
  })
  const data = await resp.json()
  if(data){
    console.log("data: ", data )
  }
}

async function click_update_id(){
  console.log("add task")
  let taskid = document.getElementById('taskid').value;
  let editcontent = document.getElementById('editcontent').value;
  const resp = await fetch("/api/task/"+taskid,{
    method:'PUT',
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      content:editcontent
    })
  })
  const data = await resp.json()
  if(data){
    console.log("data: ", data )
  }
}

async function click_delete(id){
  console.log("delete task", id )
  if(id){
    const resp = await fetch("/api/task/"+id,{
      method:'DELETE',
      //headers:{
        //"Content-Type": "application/json",
      //}
    })
    const data = await resp.json()
    if(data){
      console.log("data: ", data )
      if(data.api){
        if(data.api=='DELETE'){
          tasks = tasks.filter(item=>item.id !== id)
          let taskElement = document.getElementById('tasks');
          let itemEl  = document.getElementById(id)
          taskElement.removeChild(itemEl);
        }
      }
    }
  }
}

async function click_update(){

}

async function click_edit(){

}