import React from "react";
import { ref, uploadBytes, listAll } from "firebase/storage";
import { storage } from "../firebase";
import { FileDisplay } from "./FileDisplay";

export class FileUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null,
      files: [],
    };
  }

  uploadFile(e) {
    e.preventDefault();
    if (this.state.file) {
      const fileRef = ref(storage, `files/${this.state.file.name}`);
      uploadBytes(fileRef, this.state.file)
        .then((snapshot) => {
          console.log(snapshot);
          console.log("file was uploaded successfully");
        })
        .catch((err) => {
          console.log("file uploading error", err);
        });
    }
  }

  componentDidMount() {
    this.getFiles();
  }

  getFiles() {
    const filesRef = ref(storage, "files");
    listAll(filesRef)
      .then(({ items }) => {
        const files = items.map((item) => item.fullPath);
        this.setState({
          files,
        });
      })
      .catch((err) => {
        console.log("Could not download files", err);
      });
  }

  render() {
    console.log(this.state.file);
    return (
      <>
        <h3>File Upload</h3>
        <form onSubmit={(e) => this.uploadFile(e)}>
          <input
            type="file"
            onChange={(e) => this.setState({ file: e.target.files[0] })}
          />
          <input type="submit" />
        </form>
        <h3>File List</h3>
        {this.state.files.map((file, index) => (
          <div key={index}>
            {file}
            <FileDisplay imageRef={file} />
          </div>
        ))}
      </>
    );
  }
}

// create one more component and let them be mapped with the file path as a prop
