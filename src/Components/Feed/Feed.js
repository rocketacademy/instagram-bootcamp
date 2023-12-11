import React, { useEffect, useState } from "react";
import {
  getStorage,
  uploadBytes,
  ref as Sref,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import "./Feed.css";

export default function Feed() {
  const [fileInputFile, setFileInputFile] = useState({
    file: null,
    fileName: "",
  });
  //const [downloadURL, setDownloadURL] = useState("");
  // const [newPost, setNewPost] = useState("");
  const [postList, setPostList] = useState([]);
  const navigate = useNavigate();

  console.log("Rendering Feed");

  //Listing all images uploaded by user upon mounting
  useEffect(() => {
    const storage = getStorage();
    const listRef = Sref(storage, "uploads/");
    listAll(listRef)
      .then((res) => {
        const urlPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
        Promise.all(urlPromises).then((urls) => {
          const newPostList = urls.map((url) => ({ imageUrl: url }));
          setPostList(newPostList);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Function to handle file upload and add a post
  const addPost = () => {
    if (fileInputFile && fileInputFile.file) {
      const storage = getStorage();
      const imagesRef = Sref(storage, "uploads/" + fileInputFile.fileName);

      uploadBytes(imagesRef, fileInputFile.file)
        .then(() => getDownloadURL(imagesRef))
        .then((url) => {
          setPostList((currentList) => [...currentList, { imageUrl: url }]);
          setFileInputFile({ file: null, fileName: "" }); // Reset file input
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleFileChange = (event) => {
    setFileInputFile({
      file: event.target.files[0],
      fileName: event.target.files[0].name,
    });
  };

  const goToChat = () => {
    console.log("Goto Chat button");
    navigate("/chat");
  };

  return (
    <div>
      <div className="Feed-header">
        {postList.map((post, index) => (
          <Card
            //style={{ width: "50vw", height: "30vh" }}
            key={index}
            src={post.imageUrl}
          >
            <Card.Img className="Card" src={post.imageUrl} />
          </Card>
        ))}
      </div>
      <input type="file" onChange={handleFileChange}></input>
      <button onClick={addPost}>Upload File</button>
      <button onClick={goToChat}> Go to Chat</button>
    </div>
  );
}

//export default Feed;

//     addPost = (event) => {
//   event.preventDefault();
//   const storage = getStorage();
//   // Creates a child reference and imagesRef now points to a dynamic reference to the images folder
//   const imagesRef = Sref(storage, this.state.fileInputValue);
//   // Initialize file as new File
//   uploadBytes(imagesRef, this.state.fileInputFile).then((snapshot) => {
//     console.log("Uploaded a blob or file!");
//   });
//   getDownloadURL(Sref(storage, this.state.fileInputValue)).then((url) => {
//     this.setState({
//       postList: [...this.state.postList, url],
//       fileInputValue: "",
//     });
//   });
//   console.log("post added");
// };

// class Feed extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       fileInputFile: null,
//       fileInputValue: "",
//       downloadURL: "",
//       newPost: null,
//       postList: [],
//     };
//   }

// componentDidMount() {
//   const storage = getStorage();
//   const listRef = Sref(storage, "");
//   listAll(listRef)
//     .then((res) => {
//       res.prefixes.forEach((folderRef) => {
//         console.log(folderRef);
//       });
//       res.items.forEach((itemRef) => {
//         console.log(itemRef);
//         getDownloadURL(itemRef).then((url) => {
//           this.setState({
//             postList: [...this.state.postList, url],
//           });
//         });
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// addPost = (event) => {
//   event.preventDefault();
//   const storage = getStorage();
//   // Creates a child reference and imagesRef now points to a dynamic reference to the images folder
//   const imagesRef = Sref(storage, this.state.fileInputValue);
//   // Initialize file as new File
//   uploadBytes(imagesRef, this.state.fileInputFile).then((snapshot) => {
//     console.log("Uploaded a blob or file!");
//   });
//   getDownloadURL(Sref(storage, this.state.fileInputValue)).then((url) => {
//     this.setState({
//       postList: [...this.state.postList, url],
//       fileInputValue: "",
//     });
//   });
//   console.log("post added");
// };

//   render() {
//     const navigate = useNavigate();

//     return (
//       <div>
//         <div className="Feed-header">
//           {this.state.postList.map((url, index) => (
//             <Card
//               //style={{ width: "50vw", height: "30vh" }}
//               key={index}
//               src={url}
//             >
//               <Card.Img className="Card" src={url} />
//             </Card>
//           ))}
//         </div>
//         <input
//           type="file"
//           onChange={(event) =>
//             this.setState({
//               fileInputFile: event.target.files[0],
//               fileInputValue: event.target.files[0].name,
//             })
//           }
//         ></input>
//         <button onClick={(event) => this.addPost(event)}>Upload File</button>
//         <button onClick = {(event) => navigate("/chat")}></button>
//       </div>
//     );
//   }
// }

// export default Feed;
