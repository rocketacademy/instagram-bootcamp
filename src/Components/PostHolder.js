import {Post} from './Post'
//<PostHolder messages = messages user = user/>
export function PostHolder(props){
    const messageListItems = props.messages.map((message, index) => (
        <Post postMessage={message} setMessages = {props.setMessages} key={message.key} user = {props.user} postIndex = {index}/>
    ))
    return (
        <div className = 'flex flex-row flex-wrap max-w-screen justify-center bg-red-300'>
        {messageListItems}
        </div>
    )
}