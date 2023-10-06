import { useState, useEffect } from "react";
import { database, storage } from "../firebase";
import { ref as sRef, uploadBytes, getDownloadURL,} from 'firebase/storage';
import { push, ref } from "firebase/database";


const DB_MESSAGES_KEY = "messages";

//<Composer user=user/>
export function Composer(props) {
    const [formInfo, setFormInfo] = useState({
        userName: '',
        userMessage: '',
        date:null,
        file:null,
      })

    const onChange = (e) => {
        const name = e.target.id
        const value = e.target.value
        setFormInfo((prevState) => {
            return ({ ...prevState, [name]: value })
        })

    };
    // setUserName(value)

    const fileChange = (e) => {
        setFormInfo((prevState) => {
            return ({ ...prevState, file: e.target.files[0] })
        })
    };

    const writeData = () => {
        const fileRef = sRef(storage,`rocketgram/${formInfo.file.name}`)
        uploadBytes(fileRef, formInfo.file)
          .then(() => getDownloadURL(fileRef))
          .then((url) => {
            const messageListRef = ref(database, DB_MESSAGES_KEY);
              push(messageListRef, {
                  user: props.user,
                  userName: formInfo.userName,
                  message: formInfo.userMessage,
                  date: `${new Date().toLocaleString()}`,
                  email: props.user.email,
                  file: url,
                  likes: 0,
                  comments: [],
              })
          })
          .then(() => {
            //reset form after submit
            setFormInfo({
              userName: '',
              userMessage: '',
              date:null,
              file:null,
            });
          }); 
        };

    return (
        <div>
        <form>
            <input
                type='text'
                id='userName'
                placeholder='enter your name here'
                onChange={(e) => { onChange(e) }}
                value={formInfo.userName}
                className='text-black'
            />
            <br />
            <input
                type='text'
                id='userMessage'
                placeholder='enter message here:'
                onChange={(e) => { onChange(e) }}
                value={formInfo.userMessage}
                className='text-black'
            />
            <br />
            <input type='file' onChange={(e) => { fileChange(e) }} />
            <br />
            {/* <input type='submit' /> */}
        </form>
        <button onClick={writeData}>Send</button>
        </div>
    )
    {/* TODO: Add input field and add text input as messages in Firebase */ }
    //

}