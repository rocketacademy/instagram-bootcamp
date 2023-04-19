import { motion } from "framer-motion";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Post = (props) => {
  const date = new Date(JSON.parse(props.children.val.date));
  const ampm = date.getHours() > 12 ? "PM" : "AM";
  let hour = date.getHours();
  if (date.getHours() > 12) {
    hour = date.getHours() - 12;
  } else if (date.getHours() === 0) {
    hour = 12;
  }
  const displayDate = `${
    days[date.getDay()]
  } ${hour}:${date.getMinutes()} ${ampm}`;
  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      className="message"
      id={props.children.key}
    >
      <div className="message-bubble">
        {props.children.val.imgURL && (
          <img src={props.children.val.imgURL} alt="cool thing" />
        )}
        <p>{props.children.val.content}</p>
      </div>
      <p className="message-meta">{displayDate}</p>
      <button onClick={props.handleDelete}>Delete</button>
    </motion.li>
  );
};

export { Post };
