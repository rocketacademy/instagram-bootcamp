import React, { useEffect, useState } from "react";
//This line is importing specific functions from the Firebase Realtime Database library that you need to work with the database.
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

const DB_POST_KEY = "insta-post";
const STORAGE_KEY = "post/";
const DB_LOGGED_IN_USER_KEY = "logged_in_user";

export default function InstaForm() {
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");
  const [loggedInUser, setLoggedInUser] = useState([]);

  useEffect(() => {
    const loggedInUserRef = databaseRef(database, DB_LOGGED_IN_USER_KEY);
    onChildAdded(loggedInUserRef, (data) => {
      setLoggedInUser((prevData) => [
        ...prevData,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  console.log("loggedInUser:", loggedInUser);
  //console.log("profileData:", profileData);

  const writeData = async (url, commentText = "") => {
    //we are creating a reference (messageListRef) to a specific location in the Firebase database.
    //ref(database, DB_MESSAGES_KEY);: The ref function is used to create a reference to a specific location in your Firebase database.
    //Here, `database` is the reference to the entire database, and `DB_MESSAGES_KEY` is a constant representing the key for a specific location in the database, which is where messages are stored.
    const postRef = databaseRef(database, DB_POST_KEY);
    //push(messageListRef);: The push function generates a new reference with a unique key within the location specified by messageListRef.
    //This is typically used to add new data (messages) with an auto-generated key, ensuring each message has a unique identifier
    const newPostRef = push(postRef);
    // Get the unique key of the new post
    const newPostKey = newPostRef.key;
    //The `set` function sets the value of the new reference (in this case, newMessageRef) to a specific value.
    //the info of latest loggedInUser will be always at index 0.
    await set(newPostRef, {
      username: loggedInUser[0].val.username,
      profilePicture: loggedInUser[0].val.profilePicture,
      caption: textInputValue,
      url: url,
      likes: 0,
    });

    if (commentText.trim() !== "") {
      // If there's a comment text, add it to the comments section of the post
      const commentsRef = databaseRef(
        database,
        `${DB_POST_KEY}/${newPostKey}/comments`
      );
      const newCommentRef = push(commentsRef);

      await set(newCommentRef, {
        username: loggedInUser[0].val.username,
        profilePicture: loggedInUser[0].val.profilePicture,
        text: commentText,
      });
    }

    setFileInputFile(null);
    setFileInputValue("");
    setTextInputValue("");
  };

  const handleSubmit = async () => {
    //The code within the try block is the main logic of the submit function.
    //It attempts to execute the following operations, and if any error occurs, it will be caught by the catch block.
    try {
      //a new variable called fullStorageRef is created. This variable holds a reference to a specific location in Firebase Storage where the uploaded file will be stored.
      //The storageRef function is used, and it's provided with two arguments:
      //storage: This is a reference to the Firebase Storage service.
      //STORAGE_KEY + fileInputFile.name: This is a combination of a storage key (path) and the name of the file that's been selected to be uploaded. It creates a unique location for the file in the storage.
      const fullStorageRef = storageRef(
        storage,
        STORAGE_KEY + fileInputFile.name
      );
      //This line is using the uploadBytes function to start uploading the contents of the fileInputFile to the fullStorageRef location in Firebase Storage.
      //The await keyword makes the function wait for the upload to complete before proceeding.
      await uploadBytes(fullStorageRef, fileInputFile);
      //The getDownloadURL function retrieves the secure URL of the uploaded file from Firebase Storage using the fullStorageRef.
      //The await keyword makes the function wait for the URL to be retrieved.
      const url = await getDownloadURL(fullStorageRef, fileInputFile.name);
      // The writeData function is called with the obtained URL as an argument. This function is expected to save information about the uploaded file, like its URL, along with other data in Firebase Realtime Database.
      // Also pass the commentText to the writeData function
      writeData(url, textInputValue);
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error("Error submitting:", error);
    }
  };

  return (
    <>
      <h2>Rocketgram</h2>
      <input
        type="file"
        // Set state's fileInputValue to "" after submit to reset file input
        value={fileInputValue}
        onChange={(e) =>
          // e.target.files is a FileList object that is an array of File objects
          // e.target.files[0] is a File object that Firebase Storage can upload
          {
            setFileInputFile(e.target.files[0]);
            setFileInputValue(e.target.value);
          }
        }
      />
      <input
        type="text"
        value={textInputValue}
        onChange={(e) => setTextInputValue(e.target.value)}
        placeholder="Enter post caption"
      />
      <button onClick={handleSubmit}>Create Post</button>
    </>
  );
}
