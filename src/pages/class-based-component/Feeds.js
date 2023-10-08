import React from "react";
import "../App.css";
import Header from "../../components/class-based-components/header.js";
import Footer from "../../components/class-based-components/footer.js";
import IndividualCard from "../../components/class-based-components/individualCard";

import { database } from "../../firebase.js";

import {
  ref,
  set,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
} from "firebase/database";

const DB_POSTS_KEY = "posts";

export default class Feeds extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: "123456",
      userName: "user001",
      postId: "",
      likeButtonStatus: "",
      commentText: "",
      commentsListener: null,
      likesListener: null,
      posts: {},
    };
  }

  // Functional based Hook's component
  // user = () => {
  //   useContext(UserContext)
  // } 

  // onChildAddedCallbackForComment = (data) => {
  //   let { postId, posts } = this.state;
  //   posts[postId].comments[data.key] = data.val();
  //   this.setState({
  //     //Synchronize post with Firebase DB
  //     posts: posts,
  //   });
  // }

  // onChildAddedCallbackForLike = (data) => {
  //   let { userId, postId, posts } = this.state;
  //   posts[postId].likes[userId] = data.val();
  //   this.setState({
  //     //Synchronize post with Firebase DB
  //     posts: posts,
  //   });
  // }

  handleCommentSubmit = (e) => {
    e.preventDefault();
    let { userId, userName, postId, commentText, posts } = this.state;
    let dbRefForComments = ref(database, `${DB_POSTS_KEY}/${postId}/comments`);

    if (userId && commentText) {
      onChildAdded(dbRefForComments, (data) => {
        if (posts[postId].comments === undefined) {
          posts[postId]["comments"] = {};
          posts[postId].comments[data.key] = data.val();
          this.setState({
            commentText: "",
            posts: posts
          });
        } else {
          posts[postId].comments[data.key] = data.val();
          this.setState({
            commentText: "",
            posts: posts
          });
        }
      }); 

      // Define the callback function
      // const onChildAddedCallback = (data) => {
      //   posts[postId].comments[data.key] = data.val();
      //   this.setState({
      //     //Clear message
      //     commentText: "",
      //     //Synchronize post with Firebase DB
      //     posts: posts,
      //   });
      // };

      // Add the listener
      // const commentsListener = dbRefForComments.on('child_added', this.onChildAddedCallbackForComment);
      // this.setState({
      //   commentsListener: commentsListener
      // });

      // Message submit to firebase
      push(dbRefForComments, {
        userId: userId,
        userName: userName,
        commentText: commentText,
        commentDate: `${new Date()}`,
      });
      console.log(posts);
    }
  };

  handleLikeSubmit = () => {
    let { userId, postId, likeButtonStatus, posts } = this.state;
    let dbRefForLikes = ref(database, `${DB_POSTS_KEY}/${postId}/likes/${userId}`);

    onValue(dbRefForLikes, (data) => {
      if (posts[postId].likes === undefined) {
        posts[postId]["likes"] = {}
        posts[postId].likes[userId] = data.val();
        this.setState({
          posts: posts
        });
      } else {
        posts[postId].likes[userId] = data.val();
        this.setState({
          posts: posts
        });
      };
    })

    // Listen for changes to the items in a list.

    // if (posts[postId].likes[userId] === true || posts[postId].likes[userId] === false) {
    //   likesListener = dbRefForLikes.on('child_changed', this.onChildAddedCallbackForLike);
    //   this.setState({
    //     likesListener: likesListener
    //   });
    // } else {
    //   // Retrieve lists of items or listen for additions to a list of items.
    //   likesListener = dbRefForLikes.on('child_added', this.onChildAddedCallbackForLike);
    //   this.setState({
    //     likesListener: likesListener
    //   });
    // }
    
    // Toggle Like button
    if (likeButtonStatus === "true") {
        set(dbRefForLikes, false);
    } else if (likeButtonStatus === "false") {
        set(dbRefForLikes, true);
    }
  };

  onTextboxChange = (e) => {
    let { name, id, value } = e.target;

    this.setState({
      [name]: value,
      postId: id,
    });
  };

  onLikeButtonChange = (e) => {
    e.preventDefault();
    let { name, id } = e.target;

    this.setState({
      postId: id,
      likeButtonStatus: name
    }, this.handleLikeSubmit);
  }

  componentDidMount() {
    const dbRefForPosts = ref(database, DB_POSTS_KEY);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(dbRefForPosts, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: {
          ...state.posts, 
          [data.key]: {...data.val()},
        }
      }));
    });

    //onChildRemoved();
  }

  componentDidUpdate() {
    let { userId, postId, commentsListener, likesListener } = this.state;
    
    if (commentsListener !== null) {
      let dbRefForComments = ref(database, `${DB_POSTS_KEY}/${postId}/comments`);
    
      // Remove comments listener
      dbRefForComments.off('child_added', commentsListener);
      this.setState({
        //Clear message
        postId: "",
        commentText: "",
        commentsListener: null,
      });

    } else if (likesListener !== null) {
      let dbRefForLikes = ref(database, `${DB_POSTS_KEY}/${postId}/likes/${userId}`);

      // Remove likes listener
      // NEED TO HAVE IF ELSE STATEMENT HERE TO CONTROL WHICH LISTENER TO REMOVE ??????
      dbRefForLikes.off('child_added', likesListener);
      dbRefForLikes.off('child_changed', likesListener);
      this.setState({
        //Clear message
        postId: "",
        likeButtonStatus: "",
        likesListener: null,

      });
    };
  }

  render() {
    let { posts, commentText } = this.state;
    let postKeys = Object.keys(posts);
    let postsDisplay = postKeys.map((key) => {
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
          handleCommentSubmit={this.handleCommentSubmit}
          onTextboxChange={this.onTextboxChange}
          onLikeButtonChange={this.onLikeButtonChange}
        />
      );
    });

    return (
      <div className="App">
        <Header />
          <div 
          className="flex flex-col h-screen justify-center text-center content-center overflow-auto"
          style={{ height: "calc(100% - 128px)" }}
          >
            {postsDisplay}
          </div>
        <Footer />
      </div>
    );
  }
}
