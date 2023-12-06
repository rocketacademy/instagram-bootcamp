import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  remove,
  runTransaction,
  get,
} from "firebase/database";
import { database, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faHeart } from "@fortawesome/free-solid-svg-icons";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import "../App.css";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      textInputValue: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    onChildAdded(messagesRef, (data) => {
      this.setState((state) => ({
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleChange = (e) => {
    this.setState({ textInputValue: e.target.value });
  };

  writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.textInputValue,
      date: new Date().toLocaleString(),
      url: url,
      authorEmail: this.props.loggedInUser.email,
    });

    this.setState({
      textInputValue: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

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

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

export default Composer;
