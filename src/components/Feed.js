import React, { useState, useEffect } from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";

const DB_POSTS_KEY = "posts";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
      {posts && (
        <div style={{ border: "10px solid red" }}>
          {posts.map((post) => {
            return (
              <div key={post.key} class="min-w-md rounded-lg shadow-md m-5">
                <div>
                  {
                    <img
                      class="object-cover h-48 w-96"
                      src={post.val.url}
                      alt={post.val.caption}
                    />
                  }
                </div>
                <div class="flex justify-between m-1.5 text-sm text-sm ">
                  <div class="font-bold p-2">
                    {post.val.user} {""}
                    <span class="font-normal">{post.val.caption}</span>
                  </div>

                  <button onClick={() => navigate("/individual")} class="p-2">
                    View post
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Feed;
