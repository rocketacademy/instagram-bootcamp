import React, { useEffect, useState } from "react";
//This line is importing specific functions from the Firebase Realtime Database library that you need to work with the database.
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "../firebase"; // Import Firebase database instance
//when you use storageRef, you're essentially creating a reference to a specific file or location in your Firebase Storage and then using its methods to do things like uploading, downloading, or managing that file.
//uploadBytes: This is one of the functions we're importing. It's a function that allows you to upload data (usually a file's bytes) to Firebase storage.
//getDownloadURL: This function helps retrieve a URL that you can use to access a file stored in Firebase storage. This URL is a way to securely access the file without needing to make your storage bucket publicly accessible.

//`DB_MESSAGES_KEY` is a constant representing the key for a specific location in the database, which is where messages are stored.
const DB_MESSAGES_KEY = "messages";

export default function Chat() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Define a function 'writeData' to add a new message to Firebase
  const writeData = () => {
    //we are creating a reference (messageListRef) to a specific location in the Firebase database.
    //ref(database, DB_MESSAGES_KEY);: The ref function is used to create a reference to a specific location in your Firebase database.
    //Here, `database` is the reference to the entire database, and `DB_MESSAGES_KEY` is a constant representing the key for a specific location in the database, which is where messages are stored.
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    //push(messageListRef);: The push function generates a new reference with a unique key within the location specified by messageListRef.
    //This is typically used to add new data (messages) with an auto-generated key, ensuring each message has a unique identifier
    const newMessageRef = push(messageListRef);
    //The `set` function sets the value of the new reference (in this case, newMessageRef) to a specific value.
    const currentDate = new Date();
    const dateTimeString = currentDate.toLocaleString();
    set(newMessageRef, {
      text: inputMessage,
      date: dateTimeString,
    });
    setInputMessage("");
  };

  //useEffect hook is a special function in React that runs after the component has been rendered.
  useEffect(() => {
    //we are creating a reference (messagesRef) to a specific location in the Firebase database.
    //ref(database, DB_MESSAGES_KEY);: The ref function is used to create a reference to a specific location in your Firebase database.
    //Here, `database` is the reference to the entire database, and `DB_MESSAGES_KEY` is a constant representing the key for a specific location in the database, which is where messages are stored.
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    //onChildAdded(messagesRef, (data) => {...});: This function sets up a listener for when a new child (like a new message) is added to the specified location in the database (in this case, messagesRef).
    //The (data) => {...} part is a callback function that gets executed whenever a new child is added. It's within this callback that you'll handle what happens when a new message is added.
    onChildAdded(messagesRef, (data) => {
      //Inside the callback function, we are using the setMessages function,
      //This function takes the previous state of the messages array (retrieved from useState) and appends a new message to it.
      // The new message is an object with two properties: key and val. The key is the unique identifier for the message in the database, and val is the actual content of the message.
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []); // The empty array [] as the second argument to useEffect means that the effect will run only once, right after the initial render.

  console.log("messages:", messages);

  // Create JSX elements from the 'messages' array to render message list items
  const messageListItems = messages.map((message) => (
    <li key={message.key}>
      {message.val.text} {message.val.date}
    </li>
  ));

  //  Base: Create form and implement chat functionality
  // Add UI and logic to App.js to accept user input in a form, save it in Firebase on submit and render on the page after submit.
  // We may find material on controlled forms useful from Module 1
  // We should be able to open multiple client apps, e.g. multiple browser tabs or windows connected to our app and have them chat with each other in real time. We will be able to incorporate usernames once we implement authentication later in this module.
  return (
    <>
      <p>Please type in message here.</p>
      <input
        type="text"
        // name="message"
        value={inputMessage}
        placeholder="Insert message"
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={writeData}>Send</button>
      <ol>{messageListItems}</ol>
    </>
  );
}
