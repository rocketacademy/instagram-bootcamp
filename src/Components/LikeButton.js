//implement onValue
//implement user

import { useState } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faHeart as fasolHeart} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faregHeart} from '@fortawesome/free-regular-svg-icons'
import { database } from "../firebase";
import { update, ref } from "firebase/database";

const DB_MESSAGES_KEY = "messages";

export function LikeButton(props) {
    const [isClicked, setIsClicked] = useState(false); // set initial state
    const messageListRef = ref(database, `${DB_MESSAGES_KEY}/${props.messageKey}`); //reference to this message's key in database
    const handleClick = (e) =>{
        if (!isClicked){
            setIsClicked(true)
            update(messageListRef, {likes:props.likes+1}) // need some way to identify the message
            props.setMessages((prevMessages) =>{
                prevMessages[props.messageIndex].val.likes +=1;
                return [...prevMessages]
            })
        } 
    }
    return(
        <button onClick = {handleClick}>
        {isClicked ? 
        <FontAwesomeIcon icon={fasolHeart} style={{color: "#fa0000",}} /> 
        : <FontAwesomeIcon icon={faregHeart} style={{color: "#ffffff",}} /> 
        }
        </button>
        
    )
}