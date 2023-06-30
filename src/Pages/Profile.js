import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function Profile(props) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const user = useContext(UserContext);
  const currUser = auth.currentUser;
  const STORAGE_KEY = "avatar/";

  useEffect(() => {
    if (currUser !== null) {
      setDisplayName(currUser.displayName);
      setEmail(currUser.email);
    } else {
      setEmail(user.email);
    }
  }, [currUser, user.email]);

  const updateUserProfile = (url) => {
    // if user updates display name and avatar photo
    if (displayName !== "" && props.avatarURL !== "") {
      updateProfile(currUser, {
        displayName: displayName,
        photoURL: url,
      })
        .then(() => {
          console.log("Name updated w photo!");
          console.log(`Photo URL set :`, props.avatarURL);
          console.log(`Photo URL on getAuth is : `, currUser.photoURL);
        })
        .catch((error) => {
          console.log("Error Updating Profile: ", error);
        });
    }
    // if user updates display name only and not avatar photo
    if (displayName !== "" && (photoURL === "" || photoURL === null)) {
      setPhotoURL(props.avatarURL);
      updateProfile(currUser, {
        displayName: displayName,
        photoURL: photoURL,
      })
        .then(() => {
          console.log("Display Name Updated!");
        })
        .catch((error) => {
          console.log("Error Updating Display Name: ", error);
        });
    }

    if (email !== "") {
      updateEmail(currUser, `${email}`)
        .then(() => {
          console.log("Email updated : ", email);
        })
        .catch((error) => {
          console.log("Error Updating email : ", error);
        });
    }
    if (newPassword !== "") {
      updatePassword(currUser, newPassword)
        .then(() => {
          console.log("Password updated : ", newPassword);
        })
        .catch((error) => {
          console.log("Error updating password :", error);
        });
    }

    setNewPassword("");
    setFileInputFile("");
    setFileInputValue("");
  };

  const handleFileInputChange = (event) => {
    setFileInputFile(event.target.files[0]);
    setFileInputValue(event.target.file);
  };

  const submit = () => {
    if (
      fileInputFile === null &&
      displayName === "" &&
      newPassword === "" &&
      email === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Ooops...",
        text: "You cannot leave all fields blank! Please try again.",
      });
      return;
    }

    if (fileInputFile !== "") {
      const fullStorageRef = storageRef(
        storage,
        STORAGE_KEY + fileInputFile.name
      );

      uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
        getDownloadURL(fullStorageRef, fileInputFile.name)
          .then((url) => {
            console.log("file uploaded successfully: ", url);
            props.setAvatarURL(url);
            setPhotoURL(props.avatarURL);
            console.log("Photo url on auth is : ", photoURL);
            updateUserProfile(url);
            Swal.fire({
              icon: "success",
              title: "Avatar Updated!",
              text: "You have successfully uploaded your avatar.",
            });
          })
          .catch((error) => {
            console.log(error);
            updateUserProfile("");
            Swal.fire({
              icon: "error",
              title: "Ooops!",
              text: "Avatar was not uploaded successfully. Please check and try again.",
            });
          });
      });
    }
  };

  return (
    <div>
      <h2>Profile Page</h2>
      <h3>Hello {displayName}!</h3>

      <Box>
        <TextField
          type="text"
          name="displayName"
          label="Display Name"
          color="secondary"
          variant="filled"
          value={displayName || ""}
          onChange={(event) => setDisplayName(event.target.value)}
          size="small"
          InputProps={{ sx: { height: 45 } }}
          focused
          required
        />
        <br />
        <TextField
          type="text"
          name="email"
          label="Email"
          color="secondary"
          variant="filled"
          value={email || ""}
          onChange={(event) => setEmail(event.target.value)}
          size="small"
          InputProps={{ sx: { height: 45 } }}
          focused
          required
        />
        <br />
        <TextField
          type="password"
          name="password"
          label="Password"
          color="secondary"
          variant="filled"
          size="small"
          value={newPassword || ""}
          placeholder="Leave blank if not updating"
          InputProps={{ sx: { height: 45 } }}
          onChange={(e) => setNewPassword(e.target.value)}
          focused
        />
        <br />
        <TextField
          type="file"
          name="file"
          color="secondary"
          variant="filled"
          label="Avatar Photo"
          size="small"
          value={fileInputValue}
          InputProps={{ sx: { height: 45 } }}
          onChange={(event) => handleFileInputChange(event)}
          focused
        />
        <br />
        <Button
          variant="contained"
          color="secondary"
          size="small"
          type="submit"
          value="submit"
          onClick={() => submit()}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
}
