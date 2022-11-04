import React, { useEffect, useState } from "react";
import { ref, uploadBytes, listAll } from "firebase/storage";
import { storage } from "../firebase";
import { FileDisplay } from "./FileDisplay";

export function FileUpload() {
  const [fileToBeUploaded, setFileToBeUploaded] = useState(null);
  const [filesFromStorage, setFilesFromStorage] = useState([]);

function choosingFile(e){
  setFileToBeUploaded(e.target.files[0]);
  console.log(e.target.files[0])
}

  function uploadFile(e) {
    e.preventDefault();
    if (fileToBeUploaded) {
      const fileRef = ref(storage, `files/${fileToBeUploaded.name}`);
      uploadBytes(fileRef, fileToBeUploaded)
        .then((snapshot) => {
          console.log(snapshot);
          console.log("file was uploaded successfully");
        })
        .catch((err) => {
          console.log("file uploading error", err);
        });
    }
  }

  useEffect(()=>{
    getFiles();
  },[]);

  function getFiles() {
    const filesRef = ref(storage, "files");
    listAll(filesRef)
      .then(({ items }) => {
        const files = items.map((item) => item.fullPath);
        setFilesFromStorage(files);
      })
      .catch((err) => {
        console.log("Could not download files", err);
      });
  }

    return (
      <>
        <h3>File Upload</h3>
        <form onSubmit={uploadFile}>
          <input type="file" onChange={choosingFile} />
          <input type="submit" />
        </form>
        <br></br>
        <h3>File List</h3>
        <div>
          {filesFromStorage.map((file, index) => (
            <div key={index} style={{ float: "left", padding: "10px" }}>
              <FileDisplay picture={file} />
            </div>
          ))}
        </div>
      </>
    );
        }