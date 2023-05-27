import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes,} from "firebase/storage";
import { database, storage } from "./firebase";
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
      fileInputFile: null,
      fileInputValue: "",
      //Separate dictionary for the formData
      formData: {
        name: '',
        chat: '',
      },
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
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
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
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
    this.setState((prevState) => ({ //updates the state
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);
  }

  //When there is an input change
  handleSubmit = (event) => {
    event.preventDefault();
    // Perform the desired action with the form data
    // console.log('Form submitted!');
    // console.log('Name:', this.state.formData.name);
    // console.log('Message:', this.state.formData.chat);
    let chatLog = this.MessageDateTime() + " " + this.state.formData.name + ": " +this.state.formData.chat;
    this.writeData(chatLog) //writes into the data
    
    // 'file' comes from the Blob or File API; On Click: Send file to firebase
    let file = this.state.fileInputFile;
    let fileRef = storageRef(storage, this.state.fileInputValue);
    
    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    // Reset the form fields
    this.setState({
      fileInputFile: null,
      fileInputValue: "",
      formData: {
        name: this.state.formData.name,
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

    let nameCheck = this.state.formData.name.length > 0 ? true : false;
    let msgCheck = this.state.formData.chat.length > 0 ? true : false;

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
        <input
            type="file"
            // Set state's fileInputValue to "" after submit to reset file input
            value={this.state.fileInputValue}
            onChange={(e) =>
              // e.target.files is a FileList object that is an array of File objects
              // e.target.files[0] is a File object that Firebase Storage can upload
              this.setState({ 
                fileInputFile: e.target.files[0],
                fileInputValue: e.target.value,
               })
            }
            />
        <button type="submit" disabled = {nameCheck && msgCheck ? false : true}>Submit</button>
       
        </div>
        </form>

        </header>
      </div>
    );
  }
}

export default App;
