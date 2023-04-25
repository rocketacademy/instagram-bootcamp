import { motion } from "framer-motion";
import { formatHour, formatMinute, formatDay } from "../../utils";
import "./Post.css";

const Post = ({ creator, uid, handleLikes, handleDelete, children }) => {
  const date = new Date(JSON.parse(children.val.date));
  const ampm = date.getHours() > 12 ? "PM" : "AM";
  let hour = formatHour(date.getHours());
  let minute = formatMinute(date.getMinutes());
  let day = formatDay(date.getDay());
  let likes = null;
  if (Object.keys(children.val.likes).length > 0) {
    likes = Object.keys(children.val.likes).length - 1;
  }

  const displayDate = `${day} ${hour}:${minute} ${ampm}`;
  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      className="post"
      id={children.key}
    >
      <div className="post-user">
        <img
          className="post-user-pic"
          src="./icons/profile.svg"
          alt="profile pic"
        />
        <div className="post-user-name">
          <p>{creator}</p>
          <p className="post-meta">{displayDate}</p>
        </div>
      </div>

      {children.val.imgURL && (
        <img
          className="post-image"
          src={children.val.imgURL}
          alt="cool thing"
        />
      )}
      <div className="post-content">
        <p>{children.val.content}</p>
        <button onClick={handleLikes} className="post-likes">
          <img src="./icons/heart.svg" alt="likes button" />
          {likes > 0 && <p>{likes}</p>}
        </button>
      </div>
      {children.val.uid === uid && (
        <button className="post-delete" onClick={handleDelete}>
          𐄂
        </button>
      )}
    </motion.li>
  );
};

export default Post;
