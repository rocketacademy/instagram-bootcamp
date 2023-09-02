import Resizer from 'react-image-file-resizer';

export const resizeFile = (file) =>
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
      'file',
      300
    );
  });

export const alterImageDimensions = async (
  file,
  setFileName,
  setFileUpload
) => {
  try {
    const image = await resizeFile(file);
    // Create a new File object with the resized image data
    const resizedFile = new File([image], file.name, { type: file.type });
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
