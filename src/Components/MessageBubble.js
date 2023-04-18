const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MessageBubble = (props) => {
  const date = new Date(JSON.parse(props.children.val.date));
  const ampm = date.getHours() > 12 ? "PM" : "AM";
  let hour;
  if (date.getHours() > 12) {
    hour = date.getHours() - 12;
  } else if (date.getHours() === 0) {
    hour = 12;
  }
  const displayDate = `${
    days[date.getDay()]
  } ${hour}:${date.getMinutes()} ${ampm}`;
  return (
    <li className="message">
      <p className="message-bubble">{props.children.val.content}</p>
      <p className="message-meta">{displayDate}</p>
    </li>
  );
};

export { MessageBubble };
