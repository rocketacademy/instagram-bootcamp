//CHECK ALL THE REFERENCES AND IMPORTS
import { useState, useEffect } from "react";
import { database } from "../firebase";
import { onChildAdded, push, ref } from "firebase/database";
import {LikeButton} from './LikeButton'

//<Post postMessage={message} setMessages = {props.setMessages} key={message.key} user = {props.user} postIndex = {index}/>
export function Post(props) {
    const [commentInput, setCommentInput] = useState({})
    const [commentList, setCommentList] = useState([])
    const DB_MESSAGES_KEY = `messages/${props.postMessage.key}/comments`;

    useEffect(() => { // whenever app renders
        const commentRef = ref(database, DB_MESSAGES_KEY); //setup reference 
        onChildAdded(commentRef, (data) => { //setup listener
            setCommentList((prevComments) => [...prevComments, { key: data.key, val: data.val() }]);
        });
    }, []);

    const writeComment = () => {
        if (Object.keys(props.user).length === 0) return
        const commentRef = ref(database, DB_MESSAGES_KEY);
        push(commentRef, commentInput
        ).then(() => {
            //reset form after submit
            setCommentInput({
                commentingUser: '',
                commentText: '',
            });
        });
    };

    const commentListItems = commentList.map((comment) => (
        <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={comment.key}>
            {comment.val.commentingUser} : {comment.val.commentText}
        </div>
    ))
    
    const checkIfPostIsLiked = () => {
            if (props.postMessage.val.likes && props.postMessage.val.likes.includes(props.user.email)) {
                return true;
            }
            return false;
        }

    return (      
        <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={props.postMessage.key}>
            {props.postMessage.val.file ? <img src={props.postMessage.val.file} alt='Post message' /> : null}
            {props.postMessage.val.userName}
            ({props.postMessage.val.email})
            : {props.postMessage.val.message}
            <br />
            {props.postMessage.val.date}
            <br />
            <LikeButton 
            messageKey = {props.postMessage.key} 
            likes={props.postMessage.val.likes ? props.postMessage.val.likes : []}  
            setMessages = {props.setMessages} 
            messageIndex = {props.postIndex}
            user = {props.user}
            isLiked = {checkIfPostIsLiked()}
            />
            {props.postMessage.val.likes ? <div>{props.postMessage.val.likes.length} liked this</div> : null}
            <input
              type='text'
              id='Comment'
              placeholder='Comment?'
              onChange={(e) => {
                if (Object.keys(props.user).length === 0) return
                setCommentInput({
                commentingUser: props.user.email, 
                commentText: e.target.value,
                })}}
              value={commentInput.commentText}
              className = 'text-black'
            />
            <button onClick={writeComment}>Post</button>
            {commentListItems}
        </div>

    )
}