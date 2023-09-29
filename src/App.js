import React, { useState, useEffect } from "react";
import { database, auth, storage, updateProfile } from "./firebase";
import {
  ref,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  push,
  set,
  get,
  update,
} from "firebase/database";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import logo from "./logo.png";
import "./App.css";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, CheckCircleIcon } from "@chakra-ui/icons";

const DB_MESSAGES_KEY = "messages";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [postTimestamp, setPostTimestamp] = useState("");
  const [comments, setComments] = useState({});
  const [likedMessages, setLikedMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    const childAddedUnsub = onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });

    const childRemovedUnsub = onChildRemoved(messagesRef, (data) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.key !== data.key)
      );
    });

    const childChangedUnsub = onChildChanged(messagesRef, (data) => {
      setMessages((prevMessages) => {
        return prevMessages.map((message) =>
          message.key === data.key
            ? { key: data.key, val: data.val() }
            : message
        );
      });
    });

    const authUnsub = onAuthStateChanged(auth, (userInfo) => {
      setIsLoggedIn(!!userInfo);
      if (userInfo) {
        setDisplayName(userInfo.displayName || "");
      }
    });

    return () => {
      childAddedUnsub();
      childRemovedUnsub();
      childChangedUnsub();
      authUnsub();
    };
  }, []);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        // Auto-generate display name using UID for uniqueness
        const defaultDisplayName =
          "User" + userCredential.user.uid.substr(0, 6);

        await updateProfile(userCredential.user, {
          displayName: defaultDisplayName,
        });

        // Update state with the auto-generated display name
        setDisplayName(defaultDisplayName);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during signup: ", error);
      alert("Error during signup. Try again?");
    }
  };

  const handlePasswordReset = async () => {
    await sendPasswordResetEmail(auth, email);
    setEmail("");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleLike = async (messageKey) => {
    const userID = auth.currentUser.uid;
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${messageKey}`);
    const message = (await get(messageRef)).val();

    let messageLikes = message.likes || {};

    if (messageLikes[userID]) {
      delete messageLikes[userID]; // Unlike
    } else {
      messageLikes[userID] = true; // Like
    }

    await update(messageRef, { likes: messageLikes });
  };

  const handleComment = async (messageKey) => {
    const commentText = comments[messageKey];
    const currentCommentTime = new Date().toUTCString(); // Current time in UTC format

    if (commentText && auth.currentUser) {
      // Fetching display name directly from auth.currentUser
      const currentDisplayName = auth.currentUser.displayName;

      try {
        const messageRef = ref(database, `${DB_MESSAGES_KEY}/${messageKey}`);
        const message = (await get(messageRef)).val();

        const newComment = {
          text: commentText,
          timestamp: currentCommentTime,
          displayName: currentDisplayName,
        };

        let messageComments = message.comments
          ? [...message.comments, newComment]
          : [newComment];

        await update(messageRef, { comments: messageComments });

        // Update local state to reflect the changes
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.key === messageKey) {
              return {
                ...msg,
                val: {
                  ...msg.val,
                  comments: messageComments,
                },
              };
            }
            return msg;
          });
        });

        // Clear the comment input for the current message
        setComments({ ...comments, [messageKey]: "" });
      } catch (error) {
        console.error("Error adding comment: ", error);
        alert("Error adding comment. Please try again.");
      }
    }
  };

  const handleUpdateDisplayName = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        alert("Display name updated!");
      } else {
        throw new Error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error updating display name: ", error);
      alert("Error updating display name. Try again?");
    }
  };

  const writeData = async (e) => {
    e.preventDefault();
    const currentTime = new Date().toUTCString(); // Current time in UTC format

    let imageUrl = ""; // Update image URL to firebase storage

    // Handle image uploads
    if (file) {
      const storageRef = sRef(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const messagesRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      message: postMessage,
      timestamp: currentTime,
      displayName,
      imageUrl,
      likes: [],
      userId: auth.currentUser.uid, // Assuming 'auth' is your firebase auth instance
    });

    setPostMessage("");
    setFile(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Rocketgram</p>
        {isLoggedIn ? (
          <>
            <form onSubmit={writeData}>
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Input
                  type="text"
                  placeholder="Post a message"
                  onChange={(e) => setPostMessage(e.target.value)}
                  value={postMessage}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </form>
            <FormControl mt={4}>
              <FormLabel>Update Display Name</FormLabel>
              <HStack>
                <Input
                  type="text"
                  placeholder="New Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Button onClick={handleUpdateDisplayName}>Update</Button>
              </HStack>
            </FormControl>
            <Button onClick={handleSignOut}>Sign out</Button>
            <ol>
              {/* START of the mapping over messages */}
              {messages.map((message) => (
                <Box key={message.key} p={4} borderWidth={1} borderRadius="lg">
                  <Text fontSize="l">
                    {message.val.displayName}: {message.val.message} at{" "}
                    {message.val.timestamp}
                  </Text>

                  <Text>
                    {message.val.imageUrl && (
                      <Image
                        src={message.val.imageUrl}
                        alt="Uploaded content"
                        boxSize="400px"
                        objectFit="cover"
                      />
                    )}
                  </Text>

                  <Button
                    onClick={() => handleLike(message.key)}
                    colorScheme={
                      message.val.likes &&
                      message.val.likes[auth.currentUser.uid]
                        ? "teal"
                        : "gray"
                    }
                  >
                    Like {Object.keys(message.val.likes || {}).length}
                  </Button>

                  <FormControl>
                    {/* Displaying the Comments */}
                    <FormLabel>Comments</FormLabel>
                    {message.val.comments &&
                      message.val.comments.map((commentObj) => (
                        <Text key={commentObj.text}>
                          {commentObj.displayName}: {commentObj.text} at{" "}
                          {commentObj.timestamp}
                        </Text>
                      ))}

                    {/* Add a Comment Form */}
                    <FormLabel>Add a Comment</FormLabel>
                    <Input
                      type="text"
                      placeholder="Your comment..."
                      onChange={(e) =>
                        setComments({
                          ...comments,
                          [message.key]: e.target.value,
                        })
                      }
                      value={comments[message.key] || ""}
                    />
                    <Button mt={2} onClick={() => handleComment(message.key)}>
                      Post Comment
                    </Button>
                  </FormControl>
                </Box>
              ))}
              {/* END of the mapping over messages */}
            </ol>
          </>
        ) : (
          <>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormControl>
            <HStack spacing={4}>
              <Button onClick={handleSignup}>Sign up</Button>
              <Button onClick={handleLogin}>Log in</Button>
              <Button onClick={handlePasswordReset}>Forgot password</Button>
            </HStack>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
