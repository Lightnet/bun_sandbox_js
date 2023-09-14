//basic test for add, edit, delete
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.0.min.js";
const {a, button, div, label, input} = van.tags
console.log("task client test");
const TaskEL = () =>{
  const taskContent = van.state('');
  const taskId = van.state('');
  const taskEdit = van.state('');
  const tasks = van.state([]);

  async function get_tasks(){
    console.log("get tasks...")
    try {
      const resp = await fetch("/api/task")
      const data = await resp.json();
      if(data){
        tasks.val = data
        console.log(tasks.val);
      }
    } catch (error) {
      console.log("GET LIST ERROR!",error);
    }
  }

  async function delete_task_id(id){
    console.log("ID: ",  id)
    if(id){
      try {
        const resp = await fetch("/api/task/"+id,{
          method:'DELETE'
        })
        const data = await resp.json()
        if(data){
          console.log("data: ", data )
          if(data.api){
            if(data.api=='DELETE'){
              tasks.val = tasks.val.filter(item=>item.id !== id)
              let taskElement = document.getElementById('tasks');
              let itemEl  = document.getElementById(id)
              taskElement.removeChild(itemEl);
            }
          }
        }
      } catch (error) {
        console.log("TASK DELETE ERROR!", error);
      }
    }
  }

  //function myTask({_id, _content}){ //task ui
  const myTask = ({_id, _content})=>{
    return div({id:_id},
      van.derive(() =>{//react changes on taskId
        if (taskId.val == _id){
          console.log(_id);
          taskEdit.val = _content;
          return input({value:taskEdit, oninput:e=>taskEdit.val = e.target.value})
        }else{
          return label(_content)
        }
      }),
      van.derive(() =>{//react changes on taskId
        if (taskId.val == _id){
          return button({onclick:()=>update_task()},'Update');
        }else{
          return button({onclick:()=>setEditID(_id)},'Edit');
        }
      }),
      button({onclick:()=>delete_task_id(_id)},'Delete')
    )
  }

  async function add_task(){
    try {
      let content = taskContent.val;
      console.log(content)
      const resp = await fetch("/api/task",{
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          content:content,
        })
      })
      const data = await resp.json()
      console.log(data);
      if(data){
        if(data.api){
          if(data.api=='CREATED'){
            console.log("ADDed?")
            tasks.val.push({
              id:data.id,
              content:content,
              isDone:null
            })
            console.log("tasks.val: ", tasks.val);
          }
        }
      }  
    } catch (error) {
      console.log("ADD TASK ERROR! ", error);
    }
    
  }

  async function update_task(){
    console.log("UPDATE!");
    console.log("ID: ", taskId.val);
    console.log("Content: ", taskEdit.val);
    if(!taskEdit.val || !taskId.val){console.log("EMPTY!");return;}
    try {
      let taskid = taskId.val;let editcontent = taskEdit.val;
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
        tasks.val.map(item=>{//works?
          if (item.id == Number(taskId.val)){
            item.content = editcontent;
          }
          return item;
        });
        //console.log("tasks.val");
        //console.log(tasks.val);
      }
    } catch (error) {
      console.log("TASK UPDATE ERROR!", error);
    } finally{
      taskId.val = '';
      taskEdit.val = '';
    }
  }

  function setEditID(id){
    taskId.val = id;
  }

  const update_tasks = van.derive(()=>{
    const myTasks = tasks.val;
    return div(myTasks.map(item=>{
      
      return div({id:item.id},
        van.derive(() =>{//react changes on taskId
          if (taskId.val == item.id){
            console.log(item.id);
            taskEdit.val = item.content;
            return input({value:taskEdit, oninput:e=>taskEdit.val = e.target.value})
          }else{
            return label(item.content)
          }
        }),
        van.derive(() =>{//react changes on taskId
          if (taskId.val == item.id){
            return button({onclick:()=>update_task()},'Update');
          }else{
            return button({onclick:()=>setEditID(item.id)},'Edit');
          }
        }),
        button({onclick:()=>delete_task_id(item.id)},'Delete')
      );
      
      //return myTask({_id:item.id, _content:item.content});  //does not work???
    
    }));
  });

  //init
  get_tasks();

  return div(
    div(
      label("Task:"),
      input({
        id:"task",
        placeholder:"Content Task",
        type:"text",
        value:taskContent,
        oninput: e=>taskContent.val = e.target.value
      }),
      button({onclick: async()=>add_task()},"Add"),
    ),
    update_tasks,
  )
}

van.add(document.body, TaskEL())
