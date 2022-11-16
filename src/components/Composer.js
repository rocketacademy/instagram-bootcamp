import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
import { database, storage } from "../firebase";
import { Button, Col, Form } from "react-bootstrap";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

export function Composer({ loggedInUser }) {
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");

  const handleFileInputChange = (event) => {
    setFileInputFile(event.target.files[0]);
    setFileInputValue(event.target.value);
  };

  const handleTextInputChange = (event) => {
    setTextInputValue(event.target.value);
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const handleSubmit = (event) => {
    // Prevent default form submit behaviour that will reload the page
    event.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: textInputValue,
          authorEmail: loggedInUser.email,
        });
        // Reset input field after submit
        setFileInputFile(null);
        setFileInputValue("");
        setTextInputValue("");
      });
    });
  };

  return (
    <Col
      className="d-flex align-items-center flex-column m-auto"
      style={{ maxWidth: "600px" }}
    >
      <Form onSubmit={handleSubmit}>
        <p>{loggedInUser ? loggedInUser.email : null}</p>
        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            name="description"
            type="text"
            value={textInputValue}
            onChange={handleTextInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            value={fileInputValue}
            onChange={handleFileInputChange}
          />
        </Form.Group>
        <Form.Group className="d-flex justify-content-center">
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={!textInputValue}
          >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Col>
  );
}
