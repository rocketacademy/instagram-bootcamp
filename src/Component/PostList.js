import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";

import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

export default class PostList extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      expanded: false,
    };
  }

  componentDidMount() {
    const postsRef = ref(database, DB_POSTS_KEY);

    onChildAdded(postsRef, (data) => {
      this.setState((state) => ({
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    const { posts } = this.state;
    const postsCopy = posts.slice();
    const reversedPosts = postsCopy.reverse();
    console.log(reversedPosts);
    return (
      <div className="align_center">
        <Box>
          {reversedPosts && reversedPosts.length > 0 ? (
            reversedPosts.map((postItem) => (
              <div>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    {postItem.val.url ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={postItem.val.url}
                        alt={postItem.val.name}
                      />
                    ) : (
                      <p>No images</p>
                    )}
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                      >
                        {postItem.val.date} - {postItem.val.userID}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {postItem.val.post}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <br />
              </div>
            ))
          ) : (
            <p>No posts yet. Make one now! 🤗</p>
          )}
        </Box>
      </div>
    );
  }
}