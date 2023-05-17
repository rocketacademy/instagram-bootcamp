import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      disableState: true,
      //Separate dictionary for the formData
      formData: {
        name: '',
        chat: '',
      },
    };

  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    // onChildAdded: Pulls data from the server into local 
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      console.log(data)
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // Writing data into the server
  writeData = (textInput) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, textInput);
    // console.log(messageListRef);
    // console.log(newMessageRef);
  };

  MessageDateTime = () => {
    const messageDate = new Date();
    const formattedDate = messageDate.toLocaleDateString();
    const formattedTime = messageDate.toLocaleTimeString();
    return ("["+formattedDate + " "+ formattedTime +"]")
  }

  //When there is an input change
  handleInputChange = (event) => {
    const { name, value } = event.target;
    let nameCheck = this.state.formData.name.length > 0 ? true : false;
    let msgCheck = this.state.formData.chat.length > 0 ? true : false;
    console.log(nameCheck,msgCheck)
    this.setState((prevState) => ({ //updates the state
      disableState: nameCheck && msgCheck ? false : true,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  //When there is an input change
  handleSubmit = (event) => {
    event.preventDefault();
    // Perform the desired action with the form data
    console.log('Form submitted!');
    console.log('Name:', this.state.formData.name);
    console.log('Message:', this.state.formData.chat);
    let chatLog = this.MessageDateTime() + " " + this.state.formData.name + ": " +this.state.formData.chat;
    this.writeData(chatLog) //writes into the data
    // Reset the form fields
    this.setState({
      formData: {
        name: '',
        chat: '',
      },
    });
  };



  render() {
    const { name, chat } = this.state.formData;

    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <h1>Messaging Application</h1>
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}

          <h3>Chat History</h3>
          <div className="messageHist">
          <ol className="invertedList">
            {messageListItems}
          </ol>
          </div>
        
        <form onSubmit={this.handleSubmit}>
          <p>Join the conversation:</p>
        
        <div className="chatInput">
        <label className="chatPax">
          <p className="formLabel">Name:</p>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleInputChange}
          />
        </label>

        <label className="chatPax">
          <p className="formLabel">Chat:</p>
          <input
            type="text"
            name="chat"
            value={chat}
            onChange={this.handleInputChange}
          />
        </label>

        <button type="submit" disabled = {this.state.disableState}>Submit</button>
       
        </div>
        </form>

        </header>
      </div>
    );
  }
}

export default App;
