import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

const STORAGE_KEY = "/posts";

export default class PostDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    const postsRef = ref(database, STORAGE_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    // Convert messages in state to message JSX elements to render
    let postListItems = this.state.posts.map((post) => (
      <div className="carousel-item h-full">
        <img src={post.val.url} alt={post.val.url} />
      </div>
    ));

    return (
      <div className="m-10 h-96 carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
        {postListItems}
      </div>
    );
  }
}
