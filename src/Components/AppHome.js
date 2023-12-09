import { useState, useEffect } from "react";
import {
  ref,
  onChildAdded,
  runTransaction,
  get,
  update,
  set,
} from "firebase/database";
import { database, auth } from "../firebase";
import NewsFeedMain from "./NewsFeedMain";
import Composer from "./Composer";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AppHome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser);
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });
  }, []);

  useEffect(() => {
    const messagesRef = ref(database, "messages");

    onChildAdded(messagesRef, (snapshot) => {
      const newData = { key: snapshot.key, val: snapshot.val() };
      setMessages((prevMessages) => [...prevMessages, newData]);
    });
  }, []);

  console.log(messages);

  const Logout = (e) => {
    setIsLoggedIn(false);
    setUser({});

    signOut(auth);

    navigate("/");
  };

  const LikePost = (key) => {
    const messageRef = ref(database, `messages/${key}`);

    const likedByUserRef = ref(database, `messages${key}/likedBy/${user.uid}`);

    get(likedByUserRef).then((snapshot) => {
      const likedByData = snapshot.val();
      console.log(likedByData);

      if (likedByData) {
        console.log("You already liked this post");
      } else {
        set(ref(database, `messages/${key}/likedBy/${user.uid}`), true).then(
          () => {
            runTransaction(messageRef, (currentData) => {
              console.log(currentData);
              const currentLikes = currentData.numberOfLikes || 0;
              if (
                !currentData.likedBy ||
                !currentData.likedBy[user.uid] ||
                currentLikes < 1
              ) {
                // The user hasn't previously liked the post, update the likes count

                currentData.likedBy = {
                  ...currentData.likedBy,
                  [user.uid]: true,
                };
                return {
                  ...currentData,
                  numberOfLikes: currentLikes + 1,
                };
              }
            })
              .then(() => {
                const updatedMessageRef = ref(database, `messages/${key}`);

                return get(updatedMessageRef);
              })
              .then((snapshot) => {
                const updatedMessage = {
                  key: snapshot.key,
                  val: snapshot.val(),
                };

                console.log(updatedMessage);

                const updatedMessages = messages.map((message) => {
                  if (message.key === key) {
                    return updatedMessage;
                  }

                  return message;
                });

                setMessages(updatedMessages);
              });
          }
        );
      }

      // runTransaction(messageRef, () => {
      //   const updatedMessageRef = ref(database, `messages/${key}`);
      //   return get(updatedMessageRef);
      // }).then((snapshot) => {
      //   console.log(snapshot);
      // });
    });

    // runTransaction(messageRef, (currentData) => {
    //   if (!currentData) {
    //     return { numberOfLikes: 0 };
    //   }
    //   console.log(user);

    //   const currentLikes = currentData.numberOfLikes || 0;

    //   if (currentData.numberOfLikes < 1 && user) {
    //     return { ...currentData, numberOfLikes: currentLikes + 1 };
    //   } else {
    //     return { ...currentData, numberOfLikes: currentLikes };
    //   }
    // })
    //   .then(() => {
    //     const updatedMessageRef = ref(database, `messages/${key}`);

    //     return get(updatedMessageRef);
    //   })
    //   .then((snapshot) => {
    //     const updatedMessage = { key: snapshot.key, val: snapshot.val() };

    //     const updatedMessages = messages.map((message) => {
    //       if (message.key === key) {
    //         return updatedMessage;
    //       }

    //       return message;
    //     });

    //     setMessages(updatedMessages);
    //   })
    //   .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <h1>Welcome to the Rocketgram App</h1>
      {isLoggedIn ? <Composer loggedInUser={user} /> : <div></div>}

      <NewsFeedMain
        messages={messages}
        likePost={LikePost}
        isLoggedIn={isLoggedIn}
      />

      {isLoggedIn ? (
        <button onClick={Logout}>Logout</button>
      ) : (
        <p>Please log in to post and like/comment</p>
      )}
    </div>
  );
};

export default AppHome;
