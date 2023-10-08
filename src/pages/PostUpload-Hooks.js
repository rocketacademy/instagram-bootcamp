import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Header from "../components/header-Hooks.js";
import Footer from "../components/footer-Hooks.js";

import { database, storage } from "../firebase.js";
import { UserContext } from "../App-Hooks.js";

import { ref, push } from "firebase/database";

import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const DB_POSTS_KEY = "posts";
const STORAGE_KEY = "posts";

const PostUpload = (props) => {
  const { user } = useContext(UserContext);

  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [imagePreviewURL, setImagePreviewURL] = useState("");
  const [postDescription, setPostDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Upload image into storage and get the image url
    const fileRef = sRef(storage, `${STORAGE_KEY}/${file.name}`);
    uploadBytes(fileRef, file)
      .then(() => {
        // Get Image URL
        return getDownloadURL(fileRef);
      })
      .then((url) => {
        console.log("url:", url);
        // Pushing up into realtime database
        let dbRef = ref(database, DB_POSTS_KEY);
        push(dbRef, {
          userId: user.uid,
          userName: user.displayName,
          postedDate: `${new Date()}`,
          imageURL: url,
          postDescription: postDescription,
          likes: {},
          comments: {},
        });
      })
      .then(() => {
        setFile(null);
        setPostDescription("");
      });
    navigate("/Feeds");
  };

  const onChange = (e) => {
    let { id, value } = e.target;

    if (id === "postDescription") {
      setPostDescription(value);
    }
  };

  const fileChange = (e) => {
    // "e.target.files" gets all the information of the selected file
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setImagePreviewURL(URL.createObjectURL(e.target.files[0]));
  };

  const uploadPhotoButton = () => {
    return (
      <div>
        <br />
        <label htmlFor="image_upload" className="btn btn-circle">
          <i className="fi fi-rr-upload"></i>
        </label>
        <br />
        <input
          type="file"
          id="image_upload"
          accept="image/*"
          // Set state's fileInputValue to "" after submit to reset file input
          value={fileInputValue}
          onChange={(e) => fileChange(e)}
          style={{ opacity: 0 }}
        />
      </div>
    )
  };

  const changePhotoButton = () => {
    return (
      <div>
        <label htmlFor="image_upload" className="text-sm cursor-pointer">
          Change Photo
        </label>
        <br />
        <input
          type="file"
          id="image_upload"
          accept="image/*"
          // Set state's fileInputValue to "" after submit to reset file input
          value={fileInputValue}
          onChange={(e) => fileChange(e)}
          style={{ opacity: 0 }}
        />
      </div>
    )
  };

  return (
    <div className="App">
      <Header />
      <form onSubmit={(e) => handleSubmit(e)} className="m-10">
        {imagePreviewURL ? (
          <div>
            <div className="avatar">
              <div className=" w-44 rounded">
                <img src={imagePreviewURL} alt="uploadedPhoto" />
              </div>
            </div>
            <br />
            {changePhotoButton()}
          </div>
        ) : (
          uploadPhotoButton()
        )}

        <textarea
          name="postDescription"
          id="postDescription"
          placeholder="Input description here"
          cols="40"
          rows="3"
          style={{ resize: "none" }}
          onChange={(e) => onChange(e)}
          value={postDescription}
          className="textarea textarea-bordered"
        ></textarea>
        <br />
        <input type="submit" className="btn" />
      </form>
      <Footer />
    </div>
  );
};

export default PostUpload;
