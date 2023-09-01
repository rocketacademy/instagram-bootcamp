import React from 'react';
import { FileDrop } from 'react-file-drop';

export const FileDropComp = ({ handleFileDrop }) => {
  const handleDrop = (files, event) => {
    event.preventDefault();
    handleFileDrop(files);
  };

  return (
    <div className="drop_container">
      <FileDrop onDrop={handleDrop}>
        <p>Drag a file here</p>
      </FileDrop>
    </div>
  );
};
