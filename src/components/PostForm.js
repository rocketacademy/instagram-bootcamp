import React, { useState, useRef } from 'react';
import { push, ref, set } from 'firebase/database';
import { database, storage } from '../firebase';
import {
  ref as StorageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

const RealTIME_DATABASE_KEY = 'posts';
const STORAGE_KEY = 'images/';

export const PostForm = ({ setMessages }) => {
  const [post, setPost] = useState({
    title: '',
    caption: '',
    tags: '',
  });

  const [fileUpload, setFileUpload] = useState(null);
  const fileUploadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    console.log(' I was called');
    e.preventDefault();

    if (fileUpload) {
      const fullStorageRef = StorageRef(storage, STORAGE_KEY + fileUpload.name);
      uploadBytes(fullStorageRef, fileUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          writeData(url);
        });
      });
    } else {
      writeData('');
    }

    setPost({
      title: '',
      caption: '',
      tags: '',
    });
    setFileUpload(null);
    fileUploadRef.current.value = null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileUpload(file);
  };

  const writeData = (url) => {
    const postListRef = ref(database, RealTIME_DATABASE_KEY);
    const newPostRef = push(postListRef);
    const postContent = {
      title: post.title,
      caption: post.caption,
      tags: post.tags,
      date: new Date().toLocaleTimeString(),
      url: url,
    };
    set(newPostRef, postContent);
    setMessages((prevState) => [...prevState, postContent]);
  };

  return (
    <>
      <div className="postForm">
        <form onSubmit={handleSubmit}>
          <label> Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
          />
          <label> Caption</label>
          <input
            type="text"
            name="caption"
            value={post.caption}
            onChange={handleChange}
          />
          <label> Tags</label>
          <input
            type="text"
            name="tags"
            value={post.tags}
            onChange={handleChange}
          />

          <label> Image Upload</label>
          <input
            type="file"
            name="file"
            // ref used to set file input to blank after submit.
            ref={fileUploadRef}
            onChange={handleFileChange}
          />

          <button type="submit">send post</button>
        </form>
      </div>
    </>
  );
};
