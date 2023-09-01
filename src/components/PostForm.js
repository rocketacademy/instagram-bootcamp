import React, { useState, useRef } from 'react';
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
import Resizer from 'react-image-file-resizer';

const RealTIME_DATABASE_KEY = 'posts';
const STORAGE_KEY = 'images/';

export const PostForm = ({ setMessages }) => {
  const [post, setPost] = useState({
    title: '',
    caption: '',
    tags: '',
    date: moment().format('MMM Do YY'),
  });

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
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });

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

    setPost({
      title: '',
      caption: '',
      tags: '',
    });
    setFileUpload(null);
    fileUploadRef.current.value = null;
    setFileName('no file selected');
  };

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      console.log(image);

      // Create a new File object with the resized image data
      const resizedFile = new File([image], file.name, { type: file.type });

      console.log(resizedFile);

      if (resizedFile.name.length > 18) {
        let fileExt = resizedFile.name.match(/\.[0-9a-z]+$/i)[0];
        let truncFileName = resizedFile.name.slice(0, 8);
        const newFileName = `${truncFileName}${fileExt}`;
        setFileName(newFileName);
      } else {
        setFileName(resizedFile.name);
      }

      setFileUpload(resizedFile);
    } catch (err) {
      console.log(err);
    }
  };

  const writeData = (url) => {
    const postContent = {
      title: post.title,
      caption: post.caption,
      tags: post.tags,
      date: new Date().toLocaleTimeString(),
      url: url,
    };

    setMessages((prevPosts) => [...prevPosts, { val: postContent }]);

    const postListRef = ref(database, RealTIME_DATABASE_KEY);
    const newPostRef = push(postListRef);
    set(newPostRef, postContent);
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