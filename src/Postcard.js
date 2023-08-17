import React from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import { ref as databaseRef, get, child } from "firebase/database";
import { database } from "./firebase";

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  // etc... other react-router-dom v6 hooks

  return (
    <WrappedComponent
      {...props}
      params={params}
      // etc...
    />
  );
};

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

class PostCard extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: {},
    };
  }

  componentDidMount() {
    const postsRef = databaseRef(database, DB_POSTS_KEY);
    get(child(postsRef, `/${this.props.params.id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const data = snapshot.val();
          let postDescription = data.description;
          let dateTime = data.datetime;
          let imageUrl = data.imagelink;
          let postAuthor = data.author;
          this.setState({
            posts: {
              key: this.props.params.id,
              val: postDescription,
              dateTimeCreated: dateTime,
              url: imageUrl,
              author: postAuthor,
            },
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidUpdate() {
    console.log(this.state.posts);
  }

  render() {
    return (
      <Card className="bg-dark text-white">
        <Card.Img
          src={this.state.posts.url}
          style={{ width: 650, height: "100%" }}
          alt="Card image"
        />
        <Card.ImgOverlay>
          <Card.Title>{this.state.posts.author}</Card.Title>
          <Card.Text>{this.state.posts.val}</Card.Text>
          <Card.Text>{this.state.posts.dateTimeCreated}</Card.Text>
        </Card.ImgOverlay>
      </Card>
    );
  }
}

export default withRouter(PostCard);
