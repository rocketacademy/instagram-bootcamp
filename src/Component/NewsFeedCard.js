import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { ref, update } from "firebase/database";
import { database } from "../firebase";

export default function NewsFeedCard({ posts, username }) {
  const postRef = ref(database);

  const handlelikes = ({ username, post }) => {
    console.log(`${username} has liked ${post.key}`);
    const updates = {};
    const likeBy = post.val.likeBy || "";
    if (likeBy.includes(username)) {
      post.val.likeCounts--;
      post.val.likeBy = likeBy.replace(username, "").replace(",,", ",");
    } else {
      post.val.likeCounts++;
      post.val.likeBy = likeBy ? `${likeBy},${username}` : username;
    }
    if (post.val.likeBy.startsWith(",") || post.val.likeBy.endsWith(",")) {
      post.val.likeBy = post.val.likeBy.replace(",", "");
    }

    updates[`posts/${post.key}/likeCounts`] = post.val.likeCounts;
    updates[`posts/${post.key}/likeBy`] = post.val.likeBy;
    update(postRef, updates);
  };

  return posts.map((post) => (
    <Card key={post.key} sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "hotpink" }}>
            {post.val.author.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={post.val.author}
        subheader={post.val.date}
      />
      <CardMedia
        component="img"
        height="194"
        image={post.val.url}
        alt={post.val.posts}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.val.posts}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Checkbox
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite sx={{ color: "hotpink" }} />}
          checked={post.val.likeBy.includes(username)}
          onClick={() => {
            handlelikes({ username, post });
          }}
        />
        <h6>{post.val.likeCounts} likes. </h6>
        <h6>
          {" "}
          {post.val.likeBy === "" ? (
            <> Nobody has liked the post</>
          ) : (
            <>{post.val.likeBy} like the post</>
          )}
        </h6>
      </CardActions>
    </Card>
  ));
}
