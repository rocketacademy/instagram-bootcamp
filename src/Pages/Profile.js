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

export default function Profile() {
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
      setPhotoURL(currUser.photoURL);
    } else {
      setEmail(user.email);
    }
  }, [currUser, user.email]);

  const updateUserProfile = (url) => {
    if (displayName !== "" && photoURL !== "") {
      updateProfile(currUser, {
        displayName: displayName,
        photoURL: url,
      })
        .then(() => {
          console.log("Profile Updated!");
          console.log(`Photo URL set :`, photoURL);
          user.photoURL = photoURL;
        })
        .catch((error) => {
          console.log("Error Updating Profile: ", error);
        });
    }

    if (email !== "") {
      updateEmail(currUser, `${email}`)
        .then(() => {
          console.log("Email updated : ", email);
        })
        .catch((error) => {
          console.log("Error Updating : ", error);
        });
    }
    if (newPassword !== "") {
      updatePassword(currUser, newPassword)
        .then(() => {
          console.log("Password updated : ", newPassword);
        })
        .catch((error) => {
          console.log("Error occured with password update :", error);
        });
    }

    setNewPassword("");
    setFileInputFile("");
    setFileInputValue("");
  };

  const submit = () => {
    if (
      fileInputFile === null &&
      displayName === "" &&
      newPassword === "" &&
      email === "" &&
      photoURL === ""
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
        getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
          console.log("file uploaded successfully!");
          updateUserProfile(url);
          setPhotoURL(url);
        });
      });
    }

    if (photoURL !== "") {
      updateUserProfile(photoURL);
    } else {
      updateUserProfile("");
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
          onChange={(e) => {
            console.log(e.target);
            setFileInputFile(e.target.files[0]);
            setFileInputValue(e.target.file);
          }}
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
