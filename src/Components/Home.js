import { useEffect } from "react";
import PostComposer from "./PostComposer";
import Post from "./Post/Post";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const { uid, userEmail, posts, file, input } = props;
  const navigate = useNavigate();
  let postFeedScroll;

  // Auto scroll to bottom
  useEffect(() => {
    postFeedScroll.scrollIntoView({ behavior: "smooth" });
  }, [postFeedScroll]);

  let postFeed = posts.map((post) => (
    <Post
      key={post.key}
      handleDelete={props.handleDelete}
      handleLikes={props.handleLikes}
      creator={post.val.creator}
      uid={uid}
    >
      {post}
    </Post>
  ));

  return (
    <>
      <div id="header">
        <h1>Instasham</h1>
        {uid ? (
          <div className="header-user">
            <p>{userEmail}</p>
            <button onClick={props.handleLogOut}>Log Out</button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")}>Sign Up/Log In</button>
        )}
      </div>

      <ul className="posts">
        {postFeed}
        <li
          ref={(e) => {
            postFeedScroll = e;
          }}
        ></li>
      </ul>
      <PostComposer
        handleSubmit={props.handleSubmit}
        handleFileChange={props.handleFileChange}
        handleChange={props.handleChange}
        file={file}
        input={input}
      />
    </>
  );
};

export default Home;
