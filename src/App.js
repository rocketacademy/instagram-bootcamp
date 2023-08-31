import { useState, useEffect, useRef } from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import { Card, Image, Text, Title, Flex, Space } from "@mantine/core";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages/";
const STORAGE_IMAGES_KEY = "images/";
const IMAGE_FILE_TYPES = ["image/jpeg", "image/png"];

function App() {
  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileLabel, setFileLabel] = useState("");

  const messagesRef = useRef(databaseRef(database, DB_MESSAGES_KEY));

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef.current, (data) => {
      const { message, timestamp, url } = data.val();
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevMessages) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [
          ...prevMessages,
          {
            key: data.key,
            message,
            timestamp: new Date(timestamp),
            url,
          },
        ]
      );
    });
  }, []);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event) => {
    setFileLabel(event.target.value);
    const newFile = event.target.files[0];

    if (newFile) {
      if (!IMAGE_FILE_TYPES.includes(newFile.type)) {
        alert("Invalid file type. Choose a JPG or PNG file.");
        setFileLabel("");
        return;
      }

      setFile(newFile);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newMessageRef = push(messagesRef.current);
    const timestamp = new Date().toISOString();

    const newFileRef = storageRef(storage, STORAGE_IMAGES_KEY + file.name);

    uploadBytes(newFileRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        set(newMessageRef, { message, timestamp, url });
        setMessage("");
        setFileLabel("");
      })
      .catch((error) => console.error("Upload error:", error));
  };

  // Convert messages in state to message JSX elements to render
  let cards = messages.map((message) => {
    return (
      <Card
        radius="lg"
        sx={{
          flex: "min(300px - 3rem, 100% - 3rem)",
        }}
      >
        <Card.Section>
          <Image src={message.url} height="275px" withPlaceholder />
        </Card.Section>

        <Card.Section>
          <Text size="md" my="xs" px="sm" lh="1.3">
            {message.message}
          </Text>
          <Text size="xs" mb="xs" px="sm" lh="1.3">
            {message.timestamp.toLocaleString("en-SG")}
          </Text>
        </Card.Section>
      </Card>
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <Title order={1} my="xl">
          Rocketgram
        </Title>
        <form onSubmit={handleSubmit}>
          <p>
            Enter message{" "}
            <input type="text" value={message} onChange={handleMessageChange} />
          </p>
          <p>
            <input
              type="file"
              value={fileLabel}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
            />
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>
        <Space h="sm" />
        <Flex gap="xl" justify="center" wrap="wrap" m="xl" maw="1200px">
          {cards}
        </Flex>
      </header>
    </div>
  );
}

export default App;
