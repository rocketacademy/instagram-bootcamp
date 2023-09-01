import React from 'react';
import { FileDrop } from 'react-file-drop';

export const FileDropComp = ({ setFileName, setFileUpload }) => {
  const handleDrop = (event) => {
    setFileName(event[0].name);
    setFileUpload(event[0]);
  };

  return (
    <div className="drop_container">
      <FileDrop onDrop={handleDrop}>
        <p>Drag a file here</p>
      </FileDrop>
    </div>
  );
};
