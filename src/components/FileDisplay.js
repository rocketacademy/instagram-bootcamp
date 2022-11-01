import React from "react";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export class FileDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      url: "",
    };
  }
  componentDidMount() {
    getDownloadURL(ref(storage, this.props.imageRef))
      .then((url) => {
        this.setState({
          url,
        });
      })
      .catch((error) => {
        console.log("Error in FileDisplay" + error);
      });
  }

  render() {
    return (
      <>
        {this.state.url != "" && (
          <img
            src={this.state.url}
            alt={this.props.imageRef}
            width="500rem"
            height="500rem"
          />
        )}
      </>
    );
  }
}
