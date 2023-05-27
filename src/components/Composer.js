import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes} from "firebase/storage";
import { database, storage } from "../firebase";
import "../App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
//const DB_MESSAGES_KEY = "messages"; //Previous texts only folder
const POSTS_FOLDER_NAME = "posts"; //Containing objects for each posts (ie. text but link to images (if any) folder
const IMAGES_FOLDER_NAME = "images"; //Images folder name

class Composer extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
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

  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // Writing data into the server
  // This script is unnecessary in assignment 3 as it's part of the message
//   writeData = (textInput) => {
//     const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
//     const newMessageRef = push(messageListRef);
//     set(newMessageRef, textInput);
//     // console.log(messageListRef);
//     // console.log(newMessageRef);
//   };

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
    // console.log(this.state);
  }

  //When there is an input change
  handleSubmit = (event) => {
    event.preventDefault();
    // Perform the desired action with the form data
    // console.log('Form submitted!');
    // console.log('Name:', this.state.formData.name);
    // console.log('Message:', this.state.formData.chat);
    
    // 'file' comes from the Blob or File API; On Click: Send file to firebase
    let file = this.state.fileInputFile;

    // Handle if the file is null
    if (this.state.fileInputFile !=null){
    let fileRef = storageRef(storage, `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`);

    // Uploading object for posts to the Firebase if there is a file
    uploadBytes(fileRef, file).then(() => {
        getDownloadURL(fileRef).then((downloadUrl) => { //get download URL for the given file
        
        //Writing data into the database
          const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
          const newPostRef = push(postListRef);
          set(newPostRef, { //set this into the posts
            imageLink: downloadUrl, //1. download url
            text: this.state.formData.chat, //2. input text
            user: this.state.formData.name, //3. user name
            time: this.MessageDateTime(), //4. Message time
          });

          // Reset the form fields after submit
          this.setState({
            fileInputFile: null,
            fileInputValue: "",
            formData: {
                name: this.state.formData.name,
                chat: '',
              },
          });
        });
      });
    }

    // Uploading object for posts to the Firebase if there is no file
    else{        
        //Writing data into the database
          const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
          const newPostRef = push(postListRef);
          set(newPostRef, { //set this into the posts
            imageLink: null, //1. download url turn to null object
            text: this.state.formData.chat, //2. input text
            user: this.state.formData.name, //3. user name
            time: this.MessageDateTime(), //4. Message time
          });

          // Reset the form fields after submit
          this.setState({
            fileInputFile: null,
            fileInputValue: "",
            formData: {
                name: this.state.formData.name,
                chat: '',
              },
          });
        }
        
    };



  render() {
    const { name, chat } = this.state.formData;

    let nameCheck = this.state.formData.name.length > 0 ? true : false;
    let msgCheck = this.state.formData.chat.length > 0 ? true : false;

    return (
        <div>
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
            required
          />
        </label>

        <label className="chatPax">
          <p className="formLabel">Chat:</p>
          <input
            type="text"
            name="chat"
            value={chat}
            onChange={this.handleInputChange}
            required
          />
          
        </label>

        <div className="flex-item">
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
       
        </div>
        </form>
        </div>

    );
  }
}

export default Composer;
