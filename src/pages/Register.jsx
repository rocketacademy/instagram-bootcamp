import React, { useState } from "react";
import { register } from "../api/authentication";
import { updateProfile } from "firebase/auth";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  get,
} from "firebase/database";
import { database, storage } from "../firebase"; // Import Firebase database instance
//when you use storageRef, you're essentially creating a reference to a specific file or location in your Firebase Storage and then using its methods to do things like uploading, downloading, or managing that file.
//uploadBytes: This is one of the functions we're importing. It's a function that allows you to upload data (usually a file's bytes) to Firebase storage.
//getDownloadURL: This function helps retrieve a URL that you can use to access a file stored in Firebase storage. This URL is a way to securely access the file without needing to make your storage bucket publicly accessible.
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const DB_PROFILE_KEY = "profile-data";
const STORAGE_PROFILE_KEY = "profile-data/";

const Register = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    username: "",
    profilePicture: null,
  });

  const registerUser = async () => {
    try {
      const user = await register(state.email, state.password);

      if (state.profilePicture) {
        const fullStorageRef = storageRef(
          storage,
          STORAGE_PROFILE_KEY + state.profilePicture.name
        );
        //This line is using the uploadBytes function to start uploading the contents of the profilePicture to the fullStorageRef location in Firebase Storage.
        //The await keyword makes the function wait for the upload to complete before proceeding.
        await uploadBytes(fullStorageRef, state.profilePicture);
        //The getDownloadURL function retrieves the secure URL of the uploaded file from Firebase Storage using the fullStorageRef.
        //The await keyword makes the function wait for the URL to be retrieved.
        const url = await getDownloadURL(
          fullStorageRef,
          state.profilePicture.name
        );

        // Update the user's profile with the provided username and profilePictureUrl
        await updateProfile(user, {
          displayName: state.username,
          photoURL: url, // Set the user's photoURL to the profile picture URL
        });

        //UPDATE profileData, which are username & profilePictureUrl to realtime database.
        const profileData = {
          username: state.username,
          profilePictureUrl: url,
        };
        const profileRef = databaseRef(database, DB_PROFILE_KEY);

        //push(messageListRef);: The push function generates a new reference with a unique key within the location specified by messageListRef.
        //This is typically used to add new data (messages) with an auto-generated key, ensuring each message has a unique identifier
        const newProfileRef = push(profileRef);

        //The `set` function sets the value of the new reference (in this case, newMessageRef) to a specific value.
        set(newProfileRef, profileData);
      }
      setState({
        email: "",
        password: "",
        username: "",
        profilePicture: null,
      });
      console.log("User registered:", user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error at register: ${errorCode} ${errorMessage}`);
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setState({
      ...state,
      profilePicture: file,
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <br />
      <label>Username:</label>
      <br />
      <input
        type="text"
        name="username"
        value={state.username}
        placeholder="Enter Username"
        onChange={(e) => handleChange(e)}
      />
      <br />
      <label>Profile Picture:</label>
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e)}
      />
      <br />
      <label>Email:</label>
      <br />
      <input
        type="text"
        name="email"
        value={state.email}
        placeholder="Enter Email"
        onChange={(e) => handleChange(e)}
      />
      <br />
      <label>Password (8 characters minimum):</label>
      <br />
      <input
        type="text"
        name="password"
        minLength={8}
        value={state.password}
        placeholder="Enter Password"
        onChange={(e) => handleChange(e)}
      />
      <br />
      <br />
      <button onClick={registerUser}>Register</button>
      <div>
        Go back to Sign in page: <a href="/">Sign in</a>
      </div>
    </div>
  );
};

export default Register;
