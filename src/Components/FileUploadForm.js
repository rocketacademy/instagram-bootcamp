import React from "react";
import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";

const STORAGE_KEY = "/posts";

export default class FileUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value,
    });
  };

  writeData = (url) => {
    const messageListRef = ref(database, STORAGE_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      url: url,
    });
  };

  uploadFile = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );
    uploadBytes(fullStorageRef, this.state.fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
        (url) => {
          this.writeData(url);
        }
      );
    });
  };

  render() {
    return (
      <form className="ml-10 mr-5 flex items-center">
        <input
          type="file"
          value={this.state.fileInputValue}
          onChange={this.handleChange}
        />
        <div className="btn" onClick={this.uploadFile}>
          Upload
        </div>
      </form>
    );
  }
}
