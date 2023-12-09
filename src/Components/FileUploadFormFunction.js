import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";
import { useState } from "react";

export const FileUploadFormFunction = () => {
  const STORAGE_KEY = "/posts";

  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const handleChange = (e) => {
    setFileInputFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  const writeData = (url) => {
    const messageListRef = ref(database, STORAGE_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      url: url,
    });
  };

  const uploadFile = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + fileInputFile.name
    );
    uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        writeData(url);
      });
    });
  };

  return (
    <form className="ml-10 mr-5 flex items-center">
      <input type="file" value={fileInputValue} onChange={handleChange} />
      <div className="btn" onClick={uploadFile}>
        Upload
      </div>
    </form>
  );
};
