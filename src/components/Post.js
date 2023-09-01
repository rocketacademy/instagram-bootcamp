import React, { useEffect, useState } from 'react';
import { onValue, ref, getDatabase } from 'firebase/database';
import moment from 'moment';

export const Post = () => {
  const [posts, setPosts] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const postListRef = ref(database, 'posts');
    onValue(postListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postList = Object.entries(data).map(([key, val]) => ({
          key,
          val,
        }));
        setPosts(postList);
      }
    });

    // Clean up the event listener when component unmounts
    return () => {
      onValue(postListRef, null);
    };
  }, [database]);

  if (posts.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {posts.map((post) => {
        const specificTime = moment(post.val.date, 'h:mm:ss A');
        const timeDifference = moment().diff(specificTime, 'minutes');
        const formattedTime = moment()
          .subtract(timeDifference, 'minutes')
          .fromNow();
        return (
          <div key={post.key} className="post_card">
            <div className="post_card-top">
              <div className="user_info">
                <span className="inline_circle"></span>
                <span className="username"> user</span>
              </div>

              <span className="posted_time">
                <i>{formattedTime}</i>
              </span>
              <h4>{post.val.title}</h4>
            </div>

            <div className="post_card_img">
              {post.val.url ? (
                <img
                  src={post.val.url}
                  alt={post.val.title}
                  width="300"
                  height="300"
                />
              ) : (
                <p>No image provided</p>
              )}
            </div>
            <div className="post_content">
              <div className="action_buttons"> </div>
              <p>{post.val.caption}</p>
              <p>{post.val.tags}</p>
            </div>
            <div>
              <input
                className="comments"
                type="text"
                placeholder="Write your comment"
              />
            </div>
          </div>
        );
      })}
    </>
  );
};
