import { motion } from "framer-motion";
import { formatHour, formatMinute, formatDay } from "../../utils";
import "./Post.css";

const Post = (props) => {
  const date = new Date(JSON.parse(props.children.val.date));
  const ampm = date.getHours() > 12 ? "PM" : "AM";
  let hour = formatHour(date.getHours());
  let minute = formatMinute(date.getMinutes());
  let day = formatDay(date.getDay());

  const displayDate = `${day} ${hour}:${minute} ${ampm}`;
  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      className="post"
      id={props.children.key}
    >
      <div className="post-user">
        <img
          className="post-user-pic"
          src="./icons/profile.svg"
          alt="profile pic"
        />
        <div className="post-user-name">
          <p>{props.creator}</p>
          <p className="post-meta">{displayDate}</p>
        </div>
      </div>

      {props.children.val.imgURL && (
        <img
          className="post-image"
          src={props.children.val.imgURL}
          alt="cool thing"
        />
      )}
      <div className="post-content">
        <p>{props.children.val.content}</p>
        <button onClick={props.handleLikes} className="post-likes">
          <img src="./icons/heart.svg" alt="likes button" />
          {props.children.val.likes !== 0 && <p>{props.children.val.likes}</p>}
        </button>
      </div>
      {props.children.val.uid === props.uid && (
        <button className="post-delete" onClick={props.handleDelete}>
          𐄂
        </button>
      )}
    </motion.li>
  );
};

export default Post;
