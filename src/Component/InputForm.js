import {React,useState} from 'react';
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";

const DB_MESSAGES_KEY = "messages";

function InputForm(){
  const [state,setState]=useState({
    name: "",
    messageToSend:"",
  })

  const writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      username:state.name,
      messageBody:state.messageToSend,
      date: new Date().toLocaleString(),
    });
  };

  const handleSubmit = (event) =>{
    event.preventDefault(event);
    writeData();
  }
  const handleNameSubmit = (event) =>{
    event.preventDefault(event);
    setState({...state,
      displayName:state.name
  });
  }
  
  const handleChange =(e) =>{
    let name = e.target.name;
    let value = e.target.value;
    setState({...state,
      [name]:value,
    })
    console.log(state)
  }

  return(
    <>
      {state.displayName?<p>Hi {state.displayName}! Start Chatting!</p>:<p>Enter name to start chatting!</p>}
      

    {!state.displayName?
    <form>
      <input
        name="name"
        value={state.name}
        onChange={(e)=>handleChange(e)}
      />
      <button onClick={handleNameSubmit}>Enter Name</button>
    </form>
      :
    <form>
      <input
        name="messageToSend"
        value={state.messageToSend}
        onChange={(e)=>handleChange(e)}
      />
      <button onClick={handleSubmit}>Send</button>
    </form>}
      <br/>
    </>    




  )
}

export default InputForm;       