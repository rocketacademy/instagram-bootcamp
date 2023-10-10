import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from 'react-router-dom'

export function AuthForm(props) {
    const [loginFormInfo, setLoginFormInfo] = useState({
        email: '',
        password: ''
      })

    const navigate = useNavigate()
     
    const onChange = (e) => {
        const name = e.target.id
        const value = e.target.value
        setLoginFormInfo((prevState) => {
          return ({ ...prevState, [name]: value }) // can't add another item with the same key so it overwrites
        }) // edit later
      }

    return (
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
                  console.log('loggedin')
                  console.log(userInfo)
                  //setUser(userInfo)
                  //setIsLoggedIn(true)
                  navigate('feed')
                })
                
              }}> Signup</button>
              <button onClick={async () => { // what is async
                return signInWithEmailAndPassword(
                  auth,
                  loginFormInfo.email,
                  loginFormInfo.password
                ).then((userInfo) => {
                  console.log('loggedin')
                  console.log(userInfo)
                  //setUser(userInfo)
                  //setIsLoggedIn(true)
                  navigate('feed')
                })
                
              }}> Login</button>
            </div>
        </>
    )
}