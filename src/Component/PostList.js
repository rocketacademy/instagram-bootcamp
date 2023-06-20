import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

export default class PostList extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    const postsRef = ref(database, DB_POSTS_KEY);

    onChildAdded(postsRef, (data) => {
      this.setState((state) => ({
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
                  <h4>
                    {postItem.val.date} - {postItem.val.userID}
                  </h4>
                  <p>{postItem.val.post}</p>

                  {postItem.val.url ? (
                    <img
                      src={postItem.val.url}
                      alt={postItem.val.name}
                      width="200"
                    />
                  ) : (
                    <p>No images</p>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>No posts yet. Make one now! 🤗</p>
          )}
        </ol>
      </div>
    );
  }
}
