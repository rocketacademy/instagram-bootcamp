import React from 'react';
import { FileDrop } from 'react-file-drop';
import { resizeFile } from '../utils/resize';

export const FileDropComp = ({ setFileName, setFileUpload }) => {
  const handleDrop = async (event) => {
    try {
      const file = event[0];
      const image = await resizeFile(file);
      const resizedFile = new File([image], file.name, { type: file.type });
      setFileName(resizedFile.name);
      setFileUpload(resizedFile);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="drop_container">
      <FileDrop onDrop={handleDrop}>
        <p>Drag a file here</p>
      </FileDrop>
    </div>
  );
};
