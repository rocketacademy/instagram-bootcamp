import React from "react";
import { onChildAdded, push, ref, remove } from "firebase/database";
import {
  ref as storeRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database } from "./firebase";
import { storage } from "./firebase";
import { auth } from "./firebase";

import Card from "react-bootstrap/Card";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SignUpFormHooks from "./SignUpFormHooks";
import { Link } from "react-router-dom";

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
      uid: null,
      userEmail: null,
    };
  }

  componentDidMount() {
    // THIS BIT IS FOR MOUNTING THE IMAGES ON REFRESH OF PAGE:
    const imagesRef = ref(database, DB_IMGDATA_KEY);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.setState({
          uid: uid,
          userEmail: user.email,
        });
      }
    });

    onChildAdded(imagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        images: [...state.images, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleLogOut = () => {
    signOut(auth).then(() => {
      this.setState({
        uid: null,
        userEmail: null,
      });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // this.writeData(this.state.input);
    this.uploadImages(this.state.input, this.state.file);
    this.setState({
      input: "",
      file: null,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleDelete = (id) => {
    // Remove the corresponding image data from the state
    const updatedImages = this.state.images.filter((image) => image.id !== id);
    this.setState({ images: updatedImages });

    // Remove the corresponding image data from the database
    const imageRef = ref(database, `${DB_IMGDATA_KEY}/${id}`);
    remove(imageRef);
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

  uploadImages = (input, image) => {
    const timeStamp = new Date();

    const storedRef = storeRef(
      storage,
      `${STORE_IMAGE_KEY}/${timeStamp + image.name}`
    );
    uploadBytesResumable(storedRef, image)
      .then(() => {
        return getDownloadURL(storedRef);
      })

      .then((url) => {
        const imgID = {
          imgURL: url,
          time: JSON.stringify(timeStamp),
          content: input,
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
    let imageListItems = this.state.images.map((image) => (
      <div key={image.key}>
        {image.val.content}
        <img
          src={image.val.imgURL}
          alt={image.time}
          style={{ width: "50vh", height: "30vh" }}
        />
        {image.val.time}

        <button id={image.key} onClick={this.handleDelete}>
          Delete
        </button>
      </div>
    ));

    return (
      <div className="App">
        <Link to="/login">Login</Link>
        <br />
        <Link to="/signup">sign up</Link>
        {this.state.uid ? (
          <div>
            <h2>welcome back {this.state.userEmail}!!!</h2>
            <button onClick={this.handleLogOut}>logout</button>
          </div>
        ) : (
          <SignUpFormHooks />
        )}
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
        <Card>
          <div>{imageListItems}</div>
        </Card>
      </div>
    );
  }
}

export default App;
