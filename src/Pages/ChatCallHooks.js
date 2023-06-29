import { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";
import { TextField, FormControl, Button } from "@mui/material";
import { UserContext } from "../App";
import { useContext } from "react";
import MessageList from "./MessageList";
import Swal from "sweetalert2";
// import {ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
// const STORAGE_KEY='images/'

export default function ChatCallHooks() {
  const [message, setMessage] = useState("");
  const user = useContext(UserContext);

  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const writeData = () => {
    if (message !== "") {
      const messageListRef = ref(database, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef);
      set(newMessageRef, {
        userID: user.displayName,
        message: message,
        date: new Date().toLocaleString(),
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oooops...",
        text: "Your message cannot be blank.",
        footer: "Type something to chat!",
      });
    }
    setMessage("");
  };

  return (
    <div>
      {user.isLoggedIn && user.displayName.length > 0 ? (
        <h3>{user.displayName}'s Chatroom</h3>
      ) : user.isLoggedIn ? (
        <div>
          <h3>Chatroom</h3>
          <h4>
            You don't have a display name. Click on Profile ↗️ to set one.{" "}
          </h4>
          <p>Otherwise your message will have no name.</p>
        </div>
      ) : (
        <div>
          <h3>Chatroom</h3>
        </div>
      )}
      {user.isLoggedIn ? (
        <div>
          <FormControl>
            <TextField
              name="message"
              label="Message"
              value={message}
              onChange={(e) => handleChange(e)}
              multiline
              maxRows={4}
              color="secondary"
              variant="standard"
              size="small"
              required
              focused
            />
          </FormControl>
          <br />
          <Button
            variant="contained"
            color="secondary"
            size="small"
            type="submit"
            value="submit"
            onClick={() => writeData()}
          >
            Send
          </Button>
        </div>
      ) : (
        <div>
          {" "}
          <h3>Please login if you wish to chat. ↗️ </h3>
        </div>
      )}
      <div>
        <MessageList />
      </div>
    </div>
  );
}
