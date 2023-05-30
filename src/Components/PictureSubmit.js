import React from "react";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const REALTIME_DATABASE_KEY = "pics";
const STORAGE_KEY = "images/";

export default class PictureSubmit extends React.Component {
  constructor() {
    super();

    this.state = {
      
      description: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }
  writeData = (url) => {
    const picListRef = ref(database, REALTIME_DATABASE_KEY);
    const newPicRef = push(picListRef);

    set(newPicRef, {
      
      description: this.state.description,
      date: new Date().toLocaleString("en-GB"),
      url: url,
    });

    this.setState({
      
      description: this.state.description,
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

  submit = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    //Take referrence location and file data, so we can store the data online
    uploadBytes(fullStorageRef, this.state.fileInputFile).then((snapshot) => {
      // retrieve the URL to set the realtime database
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
        (url) => {
          this.writeData(url);
          this.setState({description:""})
        }
      );
    });

    
  };

  render() {
    return (
      <div>
       

       <label>Image Description</label>
        <br />
        <input
          type="text"
          name="description"
          value={this.state.description}
          placeholder="Insert Picture Description"
          onChange={(e) => this.handleChange(e)}
        />
        <br />
        
        <label>Image File</label>
        <br />
        <input
          type="file"
          name="file"
          value={this.state.fileInputValue}
          onChange={(e) => {
            this.setState({
              fileInputFile: e.target.files[0],
              fileInputValue: e.target.value,
            });
          }}
        />
        <br />
        <button onClick={this.submit}>Submit Data</button>
      </div>
    );
  }
}
