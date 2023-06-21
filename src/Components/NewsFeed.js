import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../firebase";
import { ref as databaseRef, remove } from "firebase/database";

const POST_KEY = "posts";

function NewsFeed({ posts, handleDelete }) {
  // Convert posts in props to JSX elements to render
  console.log(posts);
  let postItems = posts.map((post) => (
    <Card key={post.key}>
      {post.val.url ? (
        <>
          <Card.Img variant="top" src={post.val.url} className="Card-img" />{" "}
          <Button variant="white" onClick={onclick}>
            ❤ {post.val.likeCount}
          </Button>
        </>
      ) : (
        <p>No images</p>
      )}

      <Card.Body>
        <Card.Title>Author: {post.val.email}</Card.Title>
        <Card.Text>Date: {post.val.date} </Card.Text>
        <Card.Text>{post.val.textInput} </Card.Text>
        <Button
          variant="dark"
          onClick={(e) => {
            // Delete image from storage
            const imageDeletionRef = storageRef(storage, post.val.imageRef);
            deleteObject(imageDeletionRef).then(() => {
              console.log("image deleted");
            });

            // Delete an entire post from database
            const postDeletionRef = databaseRef(
              database,
              `${POST_KEY}/${post.key}`
            );
            remove(postDeletionRef).then(() => {
              console.log("entire post deleted");
            });
          }}
        >
          Delete
        </Button>
      </Card.Body>
    </Card>
  ));

  return (
    <div>
      <ol>{postItems.reverse()}</ol>
    </div>
  );
}

export default NewsFeed;
