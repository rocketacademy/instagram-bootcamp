import React, { useEffect, useState } from 'react';
import { onValue, ref, getDatabase } from 'firebase/database';
import moment from 'moment';
import 'moment-timezone';

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
  }, [database]);

  if (posts.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {posts.map((post) => {
        const userTimezoneString =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        const userTime = moment()
          .tz(userTimezoneString)
          .format('MMMM Do YYYY, h:mm:ss a');
        const postTime = moment(post.val.date, 'MMMM Do YYYY, h:mm:ss a');
        const timeAgo = postTime.from(
          moment(userTime, 'MMMM Do YYYY, h:mm:ss a')
        );
        const tagsArray = post.val.tags.split(' ');
        const hashTags = tagsArray.map((tag) => '#' + tag).join(' ');

        return (
          <div key={post.key} className="post_card">
            <div className="post_card-top">
              <div className="user_info">
                <span className="inline_circle"></span>
                <span className="username"> user</span>
              </div>

              <span className="posted_time">
                <i>{timeAgo}</i>
              </span>
              <h4>{post.val.title}</h4>
            </div>

            <div className="post_card_img">
              {post.val.url ? (
                <img src={post.val.url} alt={post.val.title} />
              ) : (
                <p>No image provided</p>
              )}
            </div>
            <div className="post_content">
              <div className="action_buttons"> </div>
              <p className="break-words">{post.val.caption}</p>
              <p className="hashtags">{hashTags}</p>
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
