import React from 'react';
import { FileDrop } from 'react-file-drop';
import { alterImageDimensions } from '../utils/resize';

export const FileDropComp = ({ setFileName, setFileUpload }) => {
  const handleDrop = async (event) => {
    const file = event[0];
    alterImageDimensions(file, setFileName, setFileUpload);
  };

  return (
    <div className="drop_container">
      <FileDrop onDrop={handleDrop}>
        <p>Drag a file here</p>
      </FileDrop>
    </div>
  );
};
