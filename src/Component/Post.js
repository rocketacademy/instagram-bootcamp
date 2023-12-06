import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useLocation } from "react-router-dom";

export default function Post(props) {
  const location = useLocation();
  const path = location.pathname.slice(9);
  const index = props.posts.findIndex(({ key }) => key === path);
  let prevPost = path;
  let nextPost = path;

  if (props.posts.length > 1) {
    prevPost =
      props.posts[index === 0 ? props.posts.length - 1 : index - 1].key;
    nextPost =
      props.posts[index === props.posts.length - 1 ? 0 : index + 1].key;
  }
  console.log(prevPost, nextPost);
  return (
    <div className="comment-container">
      <h1>Post:</h1>
      <div className="post-content">
        <Link to={`/comment/${prevPost}`}>
          <ArrowBackIosIcon color="primary" />
        </Link>
        <Outlet />
        <Link to={`/comment/${nextPost}`}>
          <ArrowForwardIosIcon color="primary" />
        </Link>
      </div>

      <Link to="/" className="X-button">
        <HighlightOffIcon color="primary" />
      </Link>
    </div>
  );
}
