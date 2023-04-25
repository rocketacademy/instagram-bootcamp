import { IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

function ActionBar({ postId, loggedInUser, handleLike, likes }) {
    const [isLiked, setIsLiked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser && likes[loggedInUser.uid]) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [loggedInUser, likes]);

    const handleClick = () => {
        if (loggedInUser == null) {
            navigate("/login");
            return;
        }
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
