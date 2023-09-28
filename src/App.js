import React, { useState, useEffect } from "react";
import { database, auth, storage } from "./firebase";
import {
  ref,
  onChildAdded,
  onChildRemoved,
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
  List,
  ListItem,
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

    const authUnsub = onAuthStateChanged(auth, (userInfo) => {
      setIsLoggedIn(!!userInfo);
    });

    return () => {
      childAddedUnsub();
      childRemovedUnsub();
      authUnsub();
    };
  }, []);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
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

    let messageLikes = message.likes || [];

    if (messageLikes.includes(userID)) {
      // Unlike
      messageLikes = messageLikes.filter((id) => id !== userID);
    } else {
      // Like
      messageLikes.push(userID);
    }

    await update(messageRef, { likes: messageLikes });
  };

  const handleComment = async (messageKey) => {
    const comment = comments[messageKey];
    if (comment) {
      const messageRef = ref(database, `${DB_MESSAGES_KEY}/${messageKey}`);
      const message = (await get(messageRef)).val();

      let messageComments = message.comments || [];
      messageComments.push(comment);

      await update(messageRef, { comments: messageComments });
      // Update local state
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

      setComments({ ...comments, [messageKey]: "" }); // Clear the comment input
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
      displayName, // from useState
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
            <Button onClick={handleSignOut}>Sign out</Button>
            <ol>
              {/* START of the mapping over messages */}
              {messages.map((message) => (
                <Box key={message.key} p={4} borderWidth={1} borderRadius="lg">
                  <Text fontSize="xl">{message.val.displayName}</Text>
                  <Text>{message.val.message}</Text>

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
                      likedMessages.includes(message.key) ? "teal" : "gray"
                    }
                  >
                    Like
                  </Button>

                  <FormControl>
                    {/* Displaying the Comments */}
                    <FormLabel>Comments</FormLabel>
                    {message.val.comments &&
                      message.val.comments.map((comment) => (
                        <Text key={comment}>{comment}</Text>
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
