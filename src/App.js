import React from "react";
import {
  onChildAdded,
  ref,
  remove,
  runTransaction,
  get,
} from "firebase/database";
import { database, storage } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import "./App.css";
// import MessageUpdate from "./Components/MessageUpdate";

import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import NavBar from "./Components/NavBar";
import { useNavigate } from "react-router-dom";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      // textInputValue: "",
      isEditing: false,
      // fileInputFile: null,
      // fileInputValue: "",

      numberOfLikes: 0,
      isLoggedIn: false,
      user: {},
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ isLoggedIn: true, user });
      }
    });

    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleChange = (e) => {
    this.setState({ textInputValue: e.target.value });
  };

  // writeData = (url) => {
  //   const messageListRef = ref(database, DB_MESSAGES_KEY);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, {
  //     message: this.state.textInputValue,
  //     date: new Date().toLocaleString(),
  //     url: url,
  //     numberOfLikes: this.state.numberOfLikes,
  //   });

  //   this.setState({
  //     textInputValue: "",
  //     fileInputFile: null,
  //     fileInputValue: "",
  //   });
  // };

  submit = (event) => {
    event.preventDefault();
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    uploadBytes(fullStorageRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name)
        .then((url) => {
          this.writeData(url);
        })
        .catch((err) => console.log(err));
    });
  };

  deleteMessage = (key) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${key}`);

    remove(messageRef)
      .then(() => {
        console.log("Data deleted");

        const updatedMessages = this.state.messages.filter(
          (el) => el.key !== key
        );

        this.setState({ messages: updatedMessages });
        console.log(this.state.messages);
      })
      .catch((err) => {
        console.log("Error in deleting data:", err);
      });
  };

  handleUpdateClick = () => {
    this.setState({ isEditing: true });
  };

  handleUpdateComplete = () => {
    this.setState({ isEditing: false });
  };

  handleMessageUpdate = (key, updatedMessage) => {
    const updatedMessages = this.state.messages.map((message) => {
      if (message.key === key) {
        return {
          key: message.key,
          val: { ...message.val, message: updatedMessage },
        };
      }

      return message;
    });

    this.setState({ messages: updatedMessages });
  };

  likePost = (key) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${key}`);

    runTransaction(messageRef, (currentData) => {
      if (!currentData) {
        return { numberOfLikes: 0 };
      }

      const currentLikes = currentData.numberOfLikes || 0;
      if (currentLikes < 1) {
        return { ...currentData, numberOfLikes: currentLikes + 1 };
      } else {
        return { ...currentData, numberOfLikes: currentLikes };
      }
    })
      .then(() => {
        // After successfully updating the likes in Firebase, fetch the updated data

        const updatedMessageRef = ref(database, `${DB_MESSAGES_KEY}/${key}`); // reference to the message node in Firebase is created for that message with its unique key

        return get(updatedMessageRef); // get() is called with that reference to retrieve the most recent data from Firebase at that message node
      })
      .then((snapshot) => {
        const updatedMessage = { key: snapshot.key, val: snapshot.val() }; // creates an object containing the key and value of the updated message from the previous then method (snapshot)

        const updatedMessages = this.state.messages.map((message) => {
          // We now map through the current state's messages array to update the message we just modified in Firebase
          if (message.key === key) {
            // if message's key matches the key of our snapshot, we replace the specific message with the updatedMessage
            return updatedMessage;
          }

          return message; // Else, we leave the message unchanged
        });
        this.setState({ messages: updatedMessages }); // we then set the state with the updated messages array that contains that 1 modified message object, updatedMessage
      })
      .catch((error) => {
        console.error("Error updating likes: ", error);
      });
  };

  logout = (e) => {
    this.setState({
      isLoggedIn: false,
      user: {},
    });

    signOut(auth);

    const { history } = this.props;
    if (history) {
      history.push("/");
    }
  };

  render() {
    console.log(this.state.messages);
    console.log(this.state.user);

    return (
      <div className="App">
        {this.state.isLoggedIn && this.state.user.email ? (
          <NavBar loggedInUser={this.state.user.email} />
        ) : (
          <div></div>
        )}
        <header className="App-header">
          <h1>Welcome to Rocketgram's Messaging App</h1>

          {this.state.isLoggedIn ? (
            <Composer loggedInUser={this.state.user} />
          ) : (
            <AuthForm />
          )}

          {this.state.isLoggedIn ? (
            <button onClick={this.logout}>Logout</button>
          ) : null}

          <form onSubmit={this.submit}>
            <div className="input-group">
              <input
                type="text"
                value={this.state.textInputValue}
                onChange={this.handleChange}
                placeholder="Add your message here"
                className="input"
              />
              <br />
            </div>
            <div className="input-group">
              <input
                type="file"
                name="file"
                value={this.state.fileInputValue}
                className="input"
                onChange={(e) => {
                  this.setState({
                    fileInputFile: e.target.files[0],
                    fileInputValue: e.target.value,
                  });
                }}
              />
              <br />
            </div>
            <button
              type="submit"
              disabled={!this.state.textInputValue}
              className="submit"
            >
              {this.state.textInputValue ? (
                <FontAwesomeIcon icon={faPaperPlane} bounce className="i" />
              ) : (
                <div className="input-group">Start Typing</div>
              )}
            </button>
          </form>

          <div>
            {this.state.isLoggedIn ? (
              <NewsFeed
                messages={this.state.messages}
                deleteMessage={this.deleteMessage}
                likePost={this.likePost}
              />
            ) : (
              <div></div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default App;

/** componentDidMount -> setting up a listener for new messages being added to the Firebase collection, keeping the React component's state in sync with the changes to the state's messages array
 
 *   componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY); // initializing a Firebase reference to the 'messages' collection in the Firebase database
   
    onChildAdded(messagesRef, (data) => {
      // onChildAdded listens to any new child added to the 'messages' collection. 
      
      this.setState((state) => ({
        // When a new child is detected, it updates the component's state by appending the new messages to the 'messages' array
        
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  - lifecycle method in React and is called after the component has been rendered in the DOM, making it a suitable place to perform tasks like fetching data, subscriptions and other operations once the component is mounted

 */

/** writeData -> handling submission of new messages to Firebase
 *   writeData = (event) => {
    event.preventDefault(); // prevents default form submission behaviour

    const messageListRef = ref(database, DB_MESSAGES_KEY); // creates new reference to the 'messages' collection in Firebase 

    const newMessageRef = push(messageListRef); // generates a new child node using push()

    set(newMessageRef, {
      // data (message and timestamp) is set under this new child node, newMessageRef, using set()

      message: this.state.textInputValue,

      date: new Date().toLocaleString(),
    });

    this.setState({ textInputValue: "" }); // clears textInputValue in the component's state to make the input field empty for the next message
  };
 
  
 */
