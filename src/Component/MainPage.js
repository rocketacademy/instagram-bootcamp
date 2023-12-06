import Posts from "./Posts";
import Clock from "./Clock";
import Composer from "./Composer";

export default function MainPage(props) {
  return (
    <div className="main-page">
      <Posts posts={props.posts} user={props.user} />
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
