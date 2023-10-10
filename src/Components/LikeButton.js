//implement onValue
//implement user

import { useState } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faHeart as fasolHeart} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faregHeart} from '@fortawesome/free-regular-svg-icons'
import { database } from "../firebase";
import { update, ref } from "firebase/database";

const DB_MESSAGES_KEY = "messages";

//<LikeButton messageKey = {props.postMessage.key} likes={props.postMessage.val.likes}  
//setMessages = {props.setMessages} messageIndex = {props.postIndex} user = {props.user}/>
export function LikeButton(props) {
   // const [isClicked, setIsClicked] = useState(false); // set initial state to whether user has clicked or not
    const messageListRef = ref(database, `${DB_MESSAGES_KEY}/${props.messageKey}`); //reference to this message's key in database
    
    // const checkIsLiked = (existingLikes, currentUser) => {
    //     if (existingLikes.includes(currentUser)) {
    //         return true;
    //     }
    //     return false;
    // }

    // if (!prevMessages[props.messageIndex].val.likes && prevMessages[props.messageIndex].val.likes.includes(props.user.email)) {
    //     prevMessages[props.messageIndex].val.likes = [props.user.email]
    // } else if () {


    const handleClick = (e) =>{
        if (Object.keys(props.user).length === 0) {
        return
        }
        //toggle click to other value
        //setIsClicked(!isClicked)
        //if user is in likes, remove user, otherwise add user'
        
        props.setMessages((prevMessages)=>{
            if (!prevMessages[props.messageIndex].val.likes) {
                prevMessages[props.messageIndex].val.likes = [props.user.email]
            } else if (prevMessages[props.messageIndex].val.likes.includes(props.user.email)) {
                prevMessages[props.messageIndex].val.likes = prevMessages[props.messageIndex].val.likes.filter((email)=>email !== props.user.email)
            } else{
                prevMessages[props.messageIndex].val.likes.push(props.user.email);
            }
            update(messageListRef, {likes:prevMessages[props.messageIndex].val.likes})
            return [...prevMessages]
        })
        // if (!isClicked){
        //     setIsClicked(true)
        //     update(messageListRef, {likes:props.likes+1}) // need some way to identify the message
        //     props.setMessages((prevMessages) =>{
        //         console.log(props)
        //         prevMessages[props.messageIndex].val.likes.push(props.user);
        //         return [...prevMessages]
        //     })
        // } 
    }
    return(
        <button onClick = {handleClick}>
        {props.isLiked ? 
        <FontAwesomeIcon icon={fasolHeart} style={{color: "#fa0000",}} /> 
        : <FontAwesomeIcon icon={faregHeart} style={{color: "#ffffff",}} /> 
        }
        </button>
        
    )
}