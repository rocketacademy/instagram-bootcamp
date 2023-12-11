import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";
import SideBar from "./SideBar";
import { UserContext } from "../App";

const DB_POSTS_KEY = "posts";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { isUserLoggedIn } = useContext(UserContext);

  useEffect(() => {
    const postListRef = ref(database, DB_POSTS_KEY);
    onChildAdded(postListRef, (data) => {
      setPosts((posts) => {
        return [...posts, { key: data.key, val: data.val() }];
      });
    });
  }, []);

  return (
    <>
      {isUserLoggedIn && (
        <div class="side-bar">
          <SideBar />
        </div>
      )}
      <div class="feed">
        {posts && (
          <div>
            {posts.map((post) => {
              return (
                <div key={post.key} class="feed-post">
                  {/* <Link to={`/feed/${post.val.url}`}> */}
                  <div>
                    {
                      <img
                        class="feed-img"
                        src={post.val.url}
                        alt={post.val.caption}
                      />
                    }
                  </div>
                  <div class="feed-context">
                    <div class="author">
                      {post.val.user} {""}
                      <span class="font-normal">{post.val.caption}</span>
                    </div>
                  </div>
                  {/* </Link> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;
