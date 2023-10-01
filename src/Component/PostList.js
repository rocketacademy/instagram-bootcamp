import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";

const DB_POSTS_KEY = "posts";

export default class MessageList extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    const postsRef = ref(realTimeDatabase, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    return (
      <div>
        <ol>
          {this.state.posts && this.state.posts.length > 0 ? (
            this.state.posts.map((postItem) => (
              <li key={postItem.key}>
                <div>
                  <h3>{postItem.val.description}</h3>
                  <p>{postItem.val.date}</p>

                  {postItem.val.url ? (
                    <img src={postItem.val.url} alt={postItem.val.name} />
                  ) : (
                    <p>No images</p>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>No Posts Yet</p>
          )}
        </ol>
      </div>
    );
  }
}
