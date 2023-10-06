import { useState, useEffect } from "react";
import { onChildAdded, onChildChanged, push, ref, onValue } from "firebase/database";
import { database, storage, auth } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import {PostHolder} from './Components/PostHolder'
import {Composer} from './Components/Composer'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

export function App(props) {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})// user is the user object; adjust code accordingly
  const [loginFormInfo, setLoginFormInfo] = useState({
    email: '',
    password: ''
  })
 

  //this is NOT an infinite loop
  useEffect(() => { // whenever app renders
    const messagesRef = ref(database, DB_MESSAGES_KEY); //setup reference
    onChildAdded(messagesRef, (data) => { //setup listener
      setMessages((prevMessages) => [...prevMessages, { key: data.key, val: data.val() }]);
    });
      //[...(data.val())]
      // console.log(data.val()) // object containing all messagekey:messageval
      // console.log(Object.values(data.val()))
        //(prevMessages) => [...prevMessages, { key: data.key, val: data.val() }]);
    
    // onChildChanged(messagesRef, (data)=>{
    //   setMessages((prevMessages) => {
    //     console.log(data.val())
    //     console.log(messages)
    //     // [...(prevMessages.slice(0,-1)), { key: data.key, val: data.val() }]
    //   });
    // })
    onAuthStateChanged(auth, (authInfo)=>{ // this authInfo is returned by firebase auth
      if(authInfo){
        setIsLoggedIn(true)
        setUser(authInfo)

      } else {
        setIsLoggedIn(false)
        setUser({})// 

      }
    })
  }, []);


  const logout = () => {
    signOut(auth).then(()=>{
      console.log('Signed out');

    })
  }
  const onChange = (e) => {
    const name = e.target.id
    const value = e.target.value
    setLoginFormInfo((prevState) => {
      return ({ ...prevState, [name]: value }) // can't add another item with the same key so it overwrites
    }) // edit later
  }

  // let messageListItems = messages.map((message, index) => (
  //   <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={message.key}>
  //     {message.val.file ? <img src={message.val.file} alt='Post message' /> : null}
  //     {message.val.userName}: {message.val.message}
  //     <br />
  //     {message.val.date}
  //     <br />
  //     <LikeButton messageKey={message.key} likes={message.val.likes} messageIndex={index} setMessages={setMessages} />
  //     {message.val.likes} liked this
  //   </div>
  //));//message.setCount((prevCount)=>prevCount+1) //regular
  return (
    <div className="App">
      <header className="App-header">
      <nav>
      {user ? `Logged in as ${user.email}`: null}  
      </nav>
        {isLoggedIn ? <button onClick = {logout}>signout</button> :
          <>
            <div>
              <label>Email</label>
              <br />
              <input
                type='text'
                id='email'
                placeholder='enter email here:'
                onChange={(e) => { onChange(e) }}
                value={loginFormInfo.email}
                className='text-black'
              />
              <br />
              <label>Password</label>
              <br />
              <input
                type='password' //change to password later
                id='password' 
                placeholder='enter password:'
                onChange={(e) => { onChange(e) }}
                value={loginFormInfo.password}
                className='text-black'
              />
              <br />
            </div>
            <div>
              <button onClick={async () => { // what is async
                return createUserWithEmailAndPassword(
                  auth,
                  loginFormInfo.email,
                  loginFormInfo.password
                ).then((userInfo) => {
                  setUser(userInfo)
                  setIsLoggedIn(true)
                })
              }}> Signup</button>
              <button onClick={async () => { // what is async
                return signInWithEmailAndPassword(
                  auth,
                  loginFormInfo.email,
                  loginFormInfo.password
                ).then((userInfo) => {
                  setUser(userInfo)
                  setIsLoggedIn(true)
                })
              }}> Login</button>
            </div>
        </>
      }
        <img src={logo} className="App-logo" alt="logo" />
        {isLoggedIn ? <Composer user= {user}/> : null}
        <PostHolder messages={messages} setMessages={setMessages} user={user}/>
      </header>
    </div>
  );
}

export default App;