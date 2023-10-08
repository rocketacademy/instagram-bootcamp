import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import Header from "../components/header-Hooks.js";
import Footer from "../components/footer-Hooks.js";
import IndividualCard from "../components/individualCard-Hooks.js";

import { database } from "../firebase.js";
import { UserContext } from "../App-Hooks.js";

import {
  ref,
  set,
  push,
  onChildAdded,
  onChildRemoved,
  onValue,
} from "firebase/database";

const DB_POSTS_KEY = "posts";

const Feeds = (props) => {
  // Delayed data transmission for useContext();
  const { user } = useContext(UserContext);
  // const [userId, setUserId] = useState(user.uid);
  // const [userName, setUserName] = useState(user.displayName);
  const [postId, setPostId] = useState("");
  const [likeButtonStatus, setLikeButtonStatus] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [posts, setPosts] = useState({});
  
  const handleCommentSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    console.log(user.uid);
    console.log(user.displayName);

    let dbRefForComments = ref(database, `${DB_POSTS_KEY}/${postId}/comments`);

    if (user.uid && commentText) {
      onChildAdded(dbRefForComments, (data) => {
        if (posts[postId].comments === undefined) {
          posts[postId]["comments"] = {};
          posts[postId].comments[data.key] = data.val();

          setCommentText("");
          setPosts(posts);
        } else {
          posts[postId].comments[data.key] = data.val();

          setCommentText("");
          setPosts(posts);
        }
      }); 

      console.log(user.uid);
      console.log(user.displayName);
      // Message submit to firebase
      push(dbRefForComments, {
        userId: user.uid,
        userName: user.displayName,
        commentText: commentText,
        commentDate: `${new Date()}`,
      });
      console.log(posts);
    }
  };

  const handleLikeSubmit = () => {
    console.log(postId);
    console.log(user.uid);
    let dbRefForLikes = ref(database, `${DB_POSTS_KEY}/${postId}/likes/${user.uid}`);

    onValue(dbRefForLikes, (data) => {
      console.log(data.val());
      if (posts[postId].likes === undefined) {
        posts[postId]["likes"] = {}
        posts[postId].likes[user.uid] = data.val();

        console.log(posts);
        setLikeButtonStatus(null);
        setPosts(posts);
      } else {
        posts[postId].likes[user.uid] = data.val();

        console.log(posts);
        setLikeButtonStatus(null);
        setPosts(posts);
      };
    })
    
    console.log(likeButtonStatus);
    // Toggle Like button
    if (likeButtonStatus === "true") {
        set(dbRefForLikes, false);
    } else if (likeButtonStatus === "false") {
        set(dbRefForLikes, true);
    }
  };

  const onTextboxChange = (e) => {
    if (e !== undefined) {
      let { name, id, value } = e.target;
      setPostId(id);
      console.log(postId);
      if (name === "commentText") {
        setCommentText(value);
      };
      console.log(commentText);
    }
  };

  const onLikeButtonChange = (e) => {
    console.log(e);
    e.preventDefault();

    let { name, id } = e.target;

    setPostId(id);
    setLikeButtonStatus(name);

    // Async await issues here. "setPostId()" & "setLikeButtonStatus()" tooks time to execute, shall I use async await?
    console.log(postId);
    console.log(likeButtonStatus);
  };
  
  //Calling "handleLikeSubmit()" right after setting the state of "postId" & "likeButtonStatus"
  useEffect(() => {
    if (postId !== null && likeButtonStatus !== null) {
      console.log("postId & likeButtonVerified");
      handleLikeSubmit();
    }
  }, [postId, likeButtonStatus]);
  
  //Represent "componentDidMount()"
  useEffect(() => {
    const dbRefForPosts = ref(database, DB_POSTS_KEY);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(dbRefForPosts, (data) => {
      setPosts(prevPosts => {
        return {
          ...prevPosts,
          [data.key]: {...data.val()},
        }
      });
    });
  }, []);

  const postRender = () => {
    // "user" brought in via "useContext" not showing. 
    let userId = user.uid;
    let userName = user.displayName;

    // console.log(userId);
    // console.log(userName);

    let postKeys = Object.keys(posts);
    return postKeys.map((key) => {
      return (
        <IndividualCard
          key={key}
          postId={key}
          userId={posts[key].userId}
          userName={posts[key].userName}
          postedDate={posts[key].postedDate}
          imageURL={posts[key].imageURL}
          postDescription={posts[key].postDescription}
          likes={posts[key].likes}
          comments={posts[key].comments}
          commentText={commentText}
          handleCommentSubmit={handleCommentSubmit}
          onTextboxChange={onTextboxChange}
          onLikeButtonChange={onLikeButtonChange}
        />
      );
    });
  }

  return (
    <div className="App">
      <Header />
        <div 
        className="flex flex-col h-screen justify-center text-center content-center overflow-auto"
        style={{ height: "calc(100% - 128px)" }}
        >
          {postRender()}
        </div>
      <Footer />
    </div>
  )
}

export default Feeds
