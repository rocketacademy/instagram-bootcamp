import { IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function ActionBar({ postId, loggedInUser, handleLike, likes }) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (likes[loggedInUser.uid]) {
            setIsLiked(true);
        }
    }, []);

    const handleClick = () => {
        handleLike(postId, loggedInUser.uid);
        setIsLiked((prevState) => !prevState);
    };

    return (
        <Stack direction={"row"}>
            <IconButton onClick={handleClick} style={{ padding: 0 }}>
                {isLiked ? (
                    <FavoriteIcon color="error" />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>
            <p>{typeof likes === "object" ? Object.keys(likes).length : "0"}</p>
        </Stack>
    );
}

export default ActionBar;
