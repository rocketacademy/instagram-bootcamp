import React from "react";
import "../App.css"
import Header from "../../components/class-based-components/header.js"
import Footer from "../../components/class-based-components/footer.js"
import { redirect } from "react-router-dom";

import { database, storage } from "../../firebase.js";

import {
    ref,
    push,
  } from "firebase/database";

import { 
    ref as sRef, 
    uploadBytes, 
    getDownloadURL,
  } from "firebase/storage";

const DB_POSTS_KEY = "posts";
const STORAGE_KEY = "posts";

export default class PostUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          file: null,
          fileInputValue: "",
          imagePreviewURL: "",
          postDescription: "",
          posts: [],
          shouldRedirect: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        // Upload image into storage and get the image url
        const fileRef = sRef(storage, `${STORAGE_KEY}/${this.state.file.name}`);
        uploadBytes(fileRef, this.state.file)
          .then(() => {
            // Get Image URL
            return getDownloadURL(fileRef);
          })
          .then((url) => {
            console.log("url:", url);
            // Pushing up into realtime database
            let dbRef = ref(database, DB_POSTS_KEY);
            push(dbRef, {
              userId: "123456",
              userName: "user001",
              postedDate: `${new Date()}`,
              imageURL: url,
              postDescription: this.state.postDescription,
              likes: {},
              comments: {},
            });
          })
          .then(() => {
            this.setState({
              file: null,
              fileInputValue: "",
              postDescription: "",
              shouldRedirect: true
            });
          })
          .then(() => {
            redirect("/")
          })
          // THEN SWITCH TO FEED PAGE....
    }

    onChange = (e) => {
    let { id, value } = e.target;

    this.setState({
        [id]: value,
    });
    }

    fileChange = (e) => {
        // "e.target.files" gets all the information of the selected file
        console.log(e.target.files[0]);
        this.setState({
          file: e.target.files[0],
          imagePreviewURL: URL.createObjectURL(e.target.files[0]),
        });
    }
    
    // componentDidMount() {
    //   const dbRef = ref(database, DB_POSTS_KEY);
    //   // onChildAdded will return data for every child at the reference and every subsequent new child
    //   onChildAdded(dbRef, (data) => {
    //       // Add the subsequent child to local component state, initialising a new array to trigger re-render
    //       this.setState((state) => ({
    //       // Store message key so we can use it as a key in our list items when rendering messages
    //       posts: [...state.posts, { key: data.key, ...data.val() }],
    //       }));
    //   });

    //   onChildRemoved();

    // }

    render () {
      // if (this.state.shouldRedirect) {
      //   return <redirect to="/" />;
      // }
      
      let { imagePreviewURL } = this.state;

      let uploadPhotoButton = (
        <div>
          <br />
          <label 
            htmlFor="image_upload" 
            className="btn btn-circle"
          >
            <i className="fi fi-rr-upload"></i>
          </label>
          <br />
          <input
            type="file"
            id="image_upload"
            accept="image/*"
            // Set state's fileInputValue to "" after submit to reset file input
            value={this.state.fileInputValue}
            onChange={(e) => this.fileChange(e)}
            style={{opacity: 0}}
          />
        </div>
      )
      let changePhotoButton = (
        <div>
          <label 
            htmlFor="image_upload"
            className="text-sm cursor-pointer"
          >
              Change Photo
          </label>
          <br />
          <input
            type="file"
            id="image_upload"
            accept="image/*"
            // Set state's fileInputValue to "" after submit to reset file input
            value={this.state.fileInputValue}
            onChange={(e) => this.fileChange(e)}
            style={{opacity: 0}}
          />
        </div>
      )

        return (
            <div className="App">
                <Header/>
                <form 
                  onSubmit={(e) => this.handleSubmit(e)}
                  className="m-10"
                >
                  {(imagePreviewURL) ? 
                    <div>
                      <div className="avatar">
                        <div className=" w-44 rounded">
                          <img src={imagePreviewURL} alt="uploadedPhoto"/>
                        </div>
                      </div>
                      <br />
                      {changePhotoButton}
                    </div> 
                    : 
                    uploadPhotoButton
                  }

                  <textarea 
                    name="postDescription" 
                    id="postDescription"
                    placeholder="Input description here"
                    cols="40" 
                    rows="3"
                    style={{resize: "none"}}
                    onChange={(e) => this.onChange(e)}
                    value={this.state.postDescription}
                    className="textarea textarea-bordered"
                  ></textarea>
                  <br />
                  <input 
                    type="submit"
                    className="btn"
                  />
                </form>
                <Footer/>
            </div>
        );
    }
}