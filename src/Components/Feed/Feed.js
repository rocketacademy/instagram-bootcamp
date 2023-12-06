import React from "react";
import {
  getStorage,
  uploadBytes,
  ref as Sref,
  getDownloadURL,
  listAll,
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

  componentDidMount() {
    const storage = getStorage();
    const listRef = Sref(storage, "");
    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          console.log(folderRef);
        });
        res.items.forEach((itemRef) => {
          console.log(itemRef);
          getDownloadURL(itemRef).then((url) => {
            this.setState({
              postList: [...this.state.postList, url],
            });
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
      <div>
        <div className="Feed-header">
          {this.state.postList.map((url, index) => (
            <Card
              //style={{ width: "50vw", height: "30vh" }}
              key={index}
              src={url}
            >
              <Card.Img className="Card" src={url} />
            </Card>
          ))}
        </div>
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
