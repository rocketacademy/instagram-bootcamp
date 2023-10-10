import { useState, useEffect } from "react";
import { onChildAdded, onChildChanged, push, ref, onValue } from "firebase/database";
import { database, auth } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import {PostHolder} from './Components/PostHolder'
import {Composer} from './Components/Composer'
import {AuthForm} from './Components/AuthForm'
import { Routes, Route } from 'react-router-dom'
import {Profile} from './Components/Profile'
import {EditProfile} from './Components/EditProfile'
import {Error} from './Components/Error'
import Navbar from './Components/Navbar'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

export function App(props) {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})// user is the user object; adjust code accordingly

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
      console.log(user)

    })
  }
 
  return (
    <div className="App">
    <header className="App-header">
    <Navbar logout = {logout} auth = {auth} isLoggedIn = {isLoggedIn}/>
      {/* <Link to='/'>Home</Link> 
      {isLoggedIn ? <button onClick = {logout}>signout</button> : <Link to='auth'>Signup/Login</Link>}
      <Link to='feed'>Feed</Link>
      {isLoggedIn ? <Link to='composer'>Composer</Link> : null} */}
      <Routes>
        {/* <Route path='/' element={<App />} /> */}
        <Route path='auth' element={<AuthForm />} />
        <Route path='feed' element={<PostHolder messages={messages} setMessages={setMessages} user={user} />} />
        <Route path='composer' element={<Composer user={user} />} />
        <Route path="*" element= {<Error/>}/>
      </Routes>
      
        <nav>
          {user.email ? `Logged in as ${user.email}`: null}  
      </nav>
        {/* {isLoggedIn ? <button onClick = {logout}>signout</button> :
          <AuthForm />
      }
        <img src={logo} className="App-logo" alt="logo" />
        {isLoggedIn ? <Composer user= {user}/> : null} */}
        {/* <PostHolder messages={messages} setMessages={setMessages} user={user}/> */}
      </header>
    </div>
  );
}

export default App;    



