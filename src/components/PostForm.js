import React, { useState, useRef, useEffect } from 'react';
import { push, ref, set } from 'firebase/database';
import { database, storage } from '../firebase';
import {
  ref as StorageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { FileDropComp } from './FileDrop';
import moment from 'moment';
import CloseButton from './closeButtonsvg';
import { alterImageDimensions } from '../utils/resize';

const RealTIME_DATABASE_KEY = 'posts';
const STORAGE_KEY = 'images/';

export const PostForm = () => {
  const [post, setPost] = useState([
    {
      title: '',
      caption: '',
      tags: '',
      date: '',
    },
  ]);

  useEffect(() => {
    console.log(post);
  }, [post]);

  const [fileName, setFileName] = useState('no file selected');
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

    setFileUpload(null);
    fileUploadRef.current.value = null;
    setFileName('no file selected');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    alterImageDimensions(file, setFileName, setFileUpload);
  };

  const writeData = (url) => {
    const postContent = {
      title: post.title,
      caption: post.caption || 'no caption',
      tags: post.tags || 'no tags',
      date: moment().format('MMMM Do YYYY, h:mm:ss a'),
      url: url,
    };

    setPost(postContent);
    const postListRef = ref(database, RealTIME_DATABASE_KEY);
    const newPostRef = push(postListRef);
    set(newPostRef, postContent);
    setPost({
      title: '',
      caption: '',
      tags: '',
      date: '',
    });
  };

  return (
    <>
      <div className="post_form">
        <CloseButton className="close_form" />
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
          <div className="file_upload">
            <input
              className="file_input"
              type="file"
              name="file"
              // ref used to set file input to blank after submit.
              ref={fileUploadRef}
              onChange={handleFileChange}
              required
            />
            <span className="file_uploaded"> {fileName}</span>
          </div>
          <FileDropComp
            setFileName={setFileName}
            setFileUpload={setFileUpload}
          />

          <button type="submit">Post</button>
        </form>
      </div>
    </>
  );
};
