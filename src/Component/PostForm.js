import React from "react";
import { push, ref, set } from "firebase/database";
import { realTimeDatabase, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const REALTIME_DATABASE_KEY = "posts";
const STORAGE_KEY = "posts/";

export default class PostForm extends React.Component {
  constructor() {
    super();

    this.state = {
      description: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  writeData = (url) => {
    const postListRef = ref(realTimeDatabase, REALTIME_DATABASE_KEY);
    const newPostRef = push(postListRef);

    set(newPostRef, {
      description: this.state.description,
      date: new Date().toLocaleTimeString(),
      url: url,
    });

    this.setState({
      description: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    this.setState({
      [name]: value,
    });
  };

  handleChangeForImages = (e) => {
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.file,
    });
  };

  submit = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    uploadBytes(fullStorageRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
        (url) => {
          this.writeData(url);
        }
      );
    });
  };

  render() {
    return (
      <div>
        <h1>Posts</h1>
        <input
          type="file"
          name="file"
          onChange={(e) => this.handleChangeForImages(e)}
        />
        <br />
        <label>Description</label>
        <br />
        <input
          type="text"
          name="description"
          value={this.state.description}
          placeholder="Insert Description Here"
          onChange={(e) => this.handleChange(e)}
        />
        <br />
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}
