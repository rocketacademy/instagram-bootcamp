import React from "react";
import {
  onChildAdded,
  ref as databaseRef,
  push,
  set,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import FormControlLabel from "@mui/material/FormControlLabel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

class Newsfeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      comments: [],
      commentInputValue: "",
      commentKey: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //Retrieve from database
  componentDidMount() {
    const postsRef = databaseRef(database, DB_POSTS_KEY);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      let postDescription = data.val().description;
      let dateTime = data.val().datetime;
      let imageUrl = data.val().imagelink;
      let postAuthor = data.val().author;

      let comments = data.val().comments;

      this.setState((state) => ({
        comments: [...state.comments, { [data.key]: comments }],
      }));

      //Check the number of like object that contains true for isChecked
      if (data.val().likes !== undefined) {
        let amountOfLikes = Object.values(data.val().likes);
        let likes = amountOfLikes.filter((like) => like.isChecked === true);
        let userLikeState = amountOfLikes.find(
          (like) => like.user === this.props.username
        );

        // Add the subsequent child to local component state, initialising a new array to trigger re-render
        this.setState((state) => ({
          // Store message key so we can use it as a key in our list items when rendering messages
          posts: [
            ...state.posts,
            {
              key: data.key,
              val: postDescription,
              dateTimeCreated: dateTime,
              url: imageUrl,
              author: postAuthor,
              nolikes: likes.length,
              userLikePost:
                userLikeState === undefined ? false : userLikeState.isChecked,
            },
          ],
        }));
      } else {
        // Add the subsequent child to local component state, initialising a new array to trigger re-render
        this.setState((state) => ({
          // Store message key so we can use it as a key in our list items when rendering messages
          posts: [
            ...state.posts,
            {
              key: data.key,
              val: postDescription,
              dateTimeCreated: dateTime,
              url: imageUrl,
              author: postAuthor,
              nolikes: 0,
              userLikePost: false,
            },
          ],
        }));
      }
    });
  }

  componentDidUpdate() {
    //console.log(this.state.comments);
  }

  toggleChange = async (event) => {
    const DB_LIKES_KEY = `posts/${event.target.value}/likes`;
    const likesListRef = databaseRef(database, DB_LIKES_KEY);

    const queryConstraints = [
      orderByChild("user"),
      equalTo(this.props.username),
    ];
    const userExists = await get(query(likesListRef, ...queryConstraints));

    if (userExists.exists()) {
      userExists.forEach((child) => {
        const userKey = child.key;
        const specificLikeRef = databaseRef(
          database,
          DB_LIKES_KEY + `/${userKey}`
        );
        set(specificLikeRef, {
          user: this.props.username,
          isChecked: event.target.checked,
        });
      });
    } else {
      const newLikeRef = push(likesListRef);
      set(newLikeRef, {
        user: this.props.username,
        isChecked: event.target.checked,
      });
    }
  };

  handleChange(event) {
    this.setState({ commentInputValue: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const datakey = event.target.getAttribute("post-index");
    const DB_COMMENTS_KEY = `posts/${datakey}/comments`;
    const commentsRef = databaseRef(database, DB_COMMENTS_KEY);
    const newCommentRef = push(commentsRef);

    set(newCommentRef, {
      comment: this.state.commentInputValue,
      author: this.props.username,
    });
    // Reset input field after submit
    this.setState({ commentInputValue: "" });
  }

  displayComments(index) {
    for (let i = 0; i < this.state.comments.length; i++) {
      const datakey = Object.keys(this.state.comments[i])[0];
      if (datakey === index) {
        let commentObject = this.state.comments[i][datakey];

        if (commentObject !== undefined) {
          const commentArray = Object.values(commentObject);
          const commentKeys = Object.keys(commentObject);

          for (let i = 0; i < commentKeys.length; i++) {
            commentArray[i]["key"] = commentKeys[i];
          }

          return commentArray.map((comment) => (
            <Card key={comment.key}>
              <Card.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    {comment.author}
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={comment.comment}
                    />
                  </Col>
                </Form.Group>
              </Card.Body>
            </Card>
          ));
        }
      }
    }
  }

  render() {
    // Convert messages in state to message JSX elements to render
    let postsListItems = this.state.posts.map((post) => (
      <Col key={post.key} as={Link} to={`/posts/${post.key}`}>
        <Card
          className="bg-dark text-white text-center"
          border="info"
          style={{ flex: 1 }}
        >
          <Card.Header>{post.author}</Card.Header>
          <Card.Img variant="top" src={post.url} className="cardImage" />
          <Card.Body>
            <Card.Title></Card.Title>
            {/* showing different icons according to whether the checkbox is checked.   */}
            <FormControlLabel
              control={
                <Checkbox
                  icon={<FavoriteBorderIcon />}
                  checkedIcon={<FavoriteIcon />}
                  onChange={this.toggleChange}
                  value={post.key}
                  defaultChecked={post.userLikePost}
                  disabled={this.props.username === "" ? true : false}
                />
              }
              label={`${post.nolikes} Likes`}
            />
            <Card.Text>{post.val}</Card.Text>
            <Accordion flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Comments</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={this.handleSubmit} post-index={post.key}>
                    <Form.Group className="mb-3">
                      <Form.Label>Write your comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={this.state.commentInputValue}
                        onChange={this.handleChange}
                        disabled={this.props.username === "" ? true : false}
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={this.props.username === "" ? true : false}
                      >
                        Submit
                      </Button>
                      {this.displayComments(post.key)}
                    </Form.Group>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
          <Card.Footer className="text-muted">
            {post.dateTimeCreated}
          </Card.Footer>
        </Card>
      </Col>
    ));

    return (
      <div className="App">
        <h1>Newsfeed</h1>
        <br />
        <Row xs={1} md={2} className="g-4">
          {postsListItems}
        </Row>
      </div>
    );
  }
}

export default Newsfeed;

/*
const findUserRef = query(
      likesListRef,
      ...[orderByChild("user"), equalTo("abc@gmail.com")]
    );

*/
