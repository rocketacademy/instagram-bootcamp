import React from "react";
import { onChildAdded, push, ref } from "firebase/database";
import {
  ref as storeRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database } from "./firebase";
import { storage } from "./firebase";

import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_IMGDATA_KEY = "imageData";
const STORE_IMAGE_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      input: "",
      file: null,
      images: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });

    const imagesRef = ref(database, DB_IMGDATA_KEY);

    onChildAdded(imagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        images: [...state.images, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.writeData(this.state.input);
    this.uploadImages(this.state.file);
    this.setState({
      input: "",
      file: null,
    });
    document.getElementById("imgInput").value = "";
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);

    const d = new Date();
    const messageLog = {
      content: this.state.input,
      date: JSON.stringify(d),
    };
    push(messageListRef, messageLog);
  };

  uploadImages = () => {
    const timeStamp = new Date();

    const storedRef = storeRef(
      storage,
      `${STORE_IMAGE_KEY}/${timeStamp + this.state.file.name}`
    );
    uploadBytesResumable(storedRef, this.state.file)
      .then(() => {
        return getDownloadURL(storedRef);
      })
      .then((url) => {
        const imgID = {
          imgURL: url,
          time: JSON.stringify(timeStamp),
        };
        const imagesRef = ref(database, DB_IMGDATA_KEY);
        push(imagesRef, imgID).then(() => {
          this.setState((prevState) => ({
            images: [...prevState.images, imgID], // add the image object to the component state
          }));
        });
      });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        {message.val.content}
        {message.val.date}
      </li>
    ));

    let imageListItems = this.state.images.map((image) => (
      <li key={image.key}>
        <img src={image.val.imgURL} alt={image.time} />
      </li>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit}>
            <input
              id="imgInput"
              type="file"
              onChange={(e) =>
                // e.target.files is a FileList object that is an array of File objects
                // e.target.files[0] is a File object that Firebase Storage can upload
                this.setState({ file: e.target.files[0] })
              }
            ></input>

            <input
              name="input"
              type="text"
              value={this.state.input}
              onChange={this.handleChange}
              autoComplete="off"
            ></input>
            <input type="submit" value="send" />
          </form>

          <ul>{messageListItems}</ul>
          <ul>{imageListItems}</ul>
        </header>
      </div>
    );
  }
}

export default App;
