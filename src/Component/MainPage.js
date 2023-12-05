import Posts from "./Posts";
import Clock from "./Clock";
import Composer from "./Composer";

export default function MainPage(props) {
  return (
    <div>
      <Posts
        posts={props.posts}
        handleLike={props.handleLike}
        user={props.user}
      />
      <Clock />
      {props.user && (
        <Composer
          author={
            props.user.displayName ? props.user.displayName : props.user.email
          }
        />
      )}
    </div>
  );
}
