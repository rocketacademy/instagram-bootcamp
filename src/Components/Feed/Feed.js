import React from "react";
import {
  getStorage,
  uploadBytes,
  ref as Sref,
  getDownloadURL,
} from "firebase/storage";
import Card from "react-bootstrap/Card";
import "./Feed.css";

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileInputFile: null,
      fileInputValue: "",
      downloadURL: "",
      newPost: null,
      postList: [],
    };
  }

  addPost = (event) => {
    event.preventDefault();
    const storage = getStorage();
    // Creates a child reference and imagesRef now points to a dynamic reference to the images folder
    const imagesRef = Sref(storage, this.state.fileInputValue);
    // Initialize file as new File
    uploadBytes(imagesRef, this.state.fileInputFile).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    getDownloadURL(Sref(storage, this.state.fileInputValue)).then((url) => {
      this.setState({
        postList: [...this.state.postList, url],
        fileInputValue: "",
      });
    });
    console.log("post added");
  };

  render() {
    return (
      <div className="Feed">
        <header className="Feed-header">
          {this.state.postList.map((url, index) => (
            <Card className="Card" key={index} src={url}>
              <Card.Img variant="top" src={url} />
            </Card>
          ))}
        </header>
        <input
          type="file"
          onChange={(event) =>
            this.setState({
              fileInputFile: event.target.files[0],
              fileInputValue: event.target.files[0].name,
            })
          }
        ></input>
        <button onClick={(event) => this.addPost(event)}>Upload File</button>
      </div>
    );
  }
}

export default Feed;
