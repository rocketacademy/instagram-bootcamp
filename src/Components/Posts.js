import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, database } from "../firebase.js";
import "../App.css";

const DB_POSTS_KEY = "posts";

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postCaption: "",
      postImageFile: null,
      postImageValue: "",
      posts: [],
    };
  }

  componentDidMount() {
    const postsCaptionsRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    this.unsubscribe = onChildAdded(postsCaptionsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store posts keys
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  writeData = (imgUrl) => {
    const postsRef = ref(database, DB_POSTS_KEY);
    const newPostsRef = push(postsRef);
    let newDate = new Date() - 0;
    set(newPostsRef, {
      caption: this.state.postCaption,
      date: newDate,
      name: this.props.name,
      url: imgUrl,
    }).then(
      this.setState({
        postCaption: "",
        postImageFile: null,
        postImageValue: "",
      })
    );
  };

  post = () => {
    const postsImagesRef = sRef(
      storage,
      DB_POSTS_KEY + this.state.postImageFile.name
    );
    uploadBytes(postsImagesRef, this.state.postImageFile).then((snapshot) => {
      const url = getDownloadURL(postsImagesRef, this.state.postImageFile.name);
      url.then((value) => {
        this.writeData(value);
      });
    });
  };

  handleChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleImage = (e) => {
    this.setState({
      postImageFile: e.target.files[0],
      postImageValue: e.target.file,
    });
  };

  render() {
    let postListItems = this.state.posts.map((post) => (
      <div className="post-container" key={post.key}>
        <p>{post.val.name}</p>
        <p>
          {new Date(post.val.date).toLocaleTimeString()},
          {new Date(post.val.date).toLocaleDateString()}
        </p>
        <p>{post.val.caption}</p>
        <div className="post-thumbnail">
          <img alt="" src={post.val.url} />
        </div>
      </div>
    ));
    return (
      <header className="App-header row">
        <h4>
          {this.props.name === ""
            ? "Please login."
            : `Currently logged in as: ${this.props.name}`}
        </h4>
        {this.props.name !== "" && (
          <div>
            <span>Enter post caption: </span>
            <input
              type="text"
              name="caption"
              value={this.state.postCaption}
              onChange={(e) => this.handleChange(e, "postCaption")}
            ></input>
            <br />
            <span>Enter post image: </span>
            <input
              type="file"
              name="image"
              onChange={(e) => this.handleImage(e)}
            ></input>
            <br />
            <button onClick={this.post}>Post</button>
          </div>
        )}
        {/* display post thumbnails */}
        {this.props.name === "" ? (
          "Your posts will be displayed when you log in."
        ) : (
          <div className="posts">{postListItems}</div>
        )}
      </header>
    );
  }
}

export default Posts;
