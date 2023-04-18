const MessageBubble = (props) => {
  const date = new Date(JSON.parse(props.children.val.date));
  return (
    <li className="message">
      <p className="message-bubble">{props.children.val.content}</p>
      <p className="message-meta">{date.toLocaleTimeString()}</p>
    </li>
  );
};

export { MessageBubble };
