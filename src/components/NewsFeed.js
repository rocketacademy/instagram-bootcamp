import React from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database} from "../firebase";
import "../App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    // onChildAdded: Pulls data from the server into local 
    onChildAdded(postListRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      console.log(data.val())
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }], //key-value pair
      }));
    });
  }

  //Function: Capitalize the name
  capitalizeFirstLetterOfEachWord = (str) => {
    return str.replace(/^(.)|\s+(.)/g, function(match) {
      return match.toUpperCase();
    });
  }
  
  postFormat = (name,time,msg) => {
    let chatLog = time + " " + this.capitalizeFirstLetterOfEachWord(name) + ": " + msg;
    return chatLog
  }

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
        
      <li key={message.key}>
        <img src={message.val.imageLink} alt={message.val.imageLink} className = "flex-item"/>
        <div>{this.postFormat(message.val.user,message.val.time,message.val.text)}   </div>
      </li>
    ));

    console.log(messageListItems);


    return (
      <div>
          <h3>Chat History</h3>
          <div className="messageHist">
          <ol className="invertedList">
            {messageListItems}
          </ol>
          </div>
      </div>
    );
  }
}

export default NewsFeed;