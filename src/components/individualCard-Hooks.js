import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App-Hooks.js";

const IndividualCard = ({
  postId,
  userId,
  userName,
  postedDate,
  imageURL,
  postDescription,
  likes,
  comments,
  commentText,
  handleCommentSubmit,
  onTextboxChange,
  onLikeButtonChange,
}) => {
  const { user } = useContext(UserContext);

  const displayPostedDate = (time) => {
    let postedTime = new Date(time);
    let curentTime = new Date();
    let timeDifference = curentTime - postedTime;
    let display;

    // Display years
    if (timeDifference / 1000 / 60 / 60 / 24 / 7 / 52 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60 / 24 / 7 / 4) + "y";
      // Display weeks
    } else if (timeDifference / 1000 / 60 / 60 / 24 / 7 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60 / 24 / 7) + "w";
      // Display days
    } else if (timeDifference / 1000 / 60 / 60 / 24 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60 / 24) + "d";
      // Display hours
    } else if (timeDifference / 1000 / 60 / 60 > 1) {
      display = parseInt(timeDifference / 1000 / 60 / 60) + "h";
      // Display minutes
    } else if (timeDifference / 1000 / 60 > 1) {
      display = parseInt(timeDifference / 1000 / 60) + "m";
      // Display now
    } else {
      display = "now";
    }

    return display;
  };

  const calculateLikeCount = (likeObject) => {
    let likeCount = 0;
    if (likeObject) {
      Object.values(likeObject).forEach((bool) => {
        if (bool) {
          likeCount++;
        }
      });
      return likeCount;
    }
  };

  const parsedPostedDate = () => {
    return displayPostedDate(postedDate);
  };

  const likeCount = () => {
    return calculateLikeCount(likes);
  };

  const userSelfLike = () => {
    if (likes) {
      if (likes[user.uid]) {
        return likes[user.uid];
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const commentsList = () => {
    if (comments) {
      let commentsKey = Object.keys(comments);
      if (commentsKey.length > 0) {
        return commentsKey.map((key) => {
          return (
            <ul className="list-none text-left text-xs" key={key}>
              <li>
                <div>
                  <h3 className="font-bold">
                    {comments[key].userName}{" "}
                    <span className="font-normal">
                      {comments[key].commentText}
                    </span>
                  </h3>
                  <p className="text-slate-400">
                    {displayPostedDate(comments[key].commentDate)}
                  </p>
                </div>
              </li>
            </ul>
          );
        });
      };
    };
  };

  return (
    <div className="card card-compact w-auto bg-base-100 rounded-none border-b">
      {/* Post Header */}
      <div className="flex justify-between text-center content-center px-4 py-1 h-11">
        <div className="flex justify-center text-center content-center gap-2 h-8">
          <div className="avatar placeholder">
            <div className=" bg-slate-300 text-neutral-content rounded-full w-8 h-8">
              <span className="text-xs text-slate-950">
                {userName ? userName.charAt(0).toUpperCase() : "A"}
              </span>
            </div>
          </div>
          <h4 className="card-title text-xs font-bold h-8">
            {userName ? userName : "anonymous"}
            <span className="text-slate-400"> • {parsedPostedDate()}</span>
          </h4>
        </div>
        <button className="btn-sm btn-ghost pl-4 pr-0 pt-1">
          <i className="fi fi-rr-menu-dots"></i>
        </button>
      </div>
      <figure>
        <img src={imageURL} alt="postImage" />
      </figure>
      <div className="card-body gap-1">
        {/* Buttons Row */}
        <div className="flex justify-between text-center content-center">
          <div className="flex justify-between text-center content-center">
            {userSelfLike() ? (
              <form
                name="true"
                id={postId}
                onSubmit={(e) => onLikeButtonChange(e)}
              >
                <button
                  type="submit"
                  className="btn-sm btn-ghost text-xl pl-0 pr-2"
                >
                  <i className="fi fi-sr-heart"></i>
                </button>
              </form>
            ) : (
              <form
                name="false"
                id={postId}
                onSubmit={(e) => onLikeButtonChange(e)}
              >
                <button
                  type="submit"
                  className=" btn-sm btn-ghost text-xl pl-0 pr-2"
                >
                  <i className="fi fi-rr-heart"></i>
                </button>
              </form>
            )}
            <button className="btn-sm btn-ghost text-xl px-2">
              <i className="fi fi-rr-comment-dots"></i>
            </button>
            <button className="btn-sm btn-ghost text-xl px-2">
              <i className="fi fi-rr-paper-plane"></i>
            </button>
          </div>
          <button className="btn-sm btn-ghost text-xl pl-2 pr-0">
            <i className="fi fi-rr-bookmark"></i>
          </button>
        </div>

        {/* Like Count Row */}
        {likeCount() > 0 ? (
          <p className="text-left text-xs font-bold">{likeCount()} likes</p>
        ) : (
          ""
        )}

        {/* Post Description Row */}
        <p className="text-left text-xs">
          <span className="font-bold ">{userName ? userName : "anonymous"}</span> {postDescription}
        </p>

        {/* View Comments Button */}
        <button className="btn btn-ghost btn-xs text-slate-400">
          View all comments
        </button>

        {/* Comment List */}
        {commentsList()}

        {/* Insert New Comment */}
        <form
          onSubmit={(e) => handleCommentSubmit(e)}
          className="flex items-center justify-between"
        >
          <input
            name="commentText"
            id={postId}
            type="text"
            placeholder="Add a comment..."
            onChange={(e) => onTextboxChange(e)}
            value={commentText}
            className="input input-ghost input-xs w-full max-w-xs"
          />
          <input
            className=" btn btn-ghost btn-xs text-slate-400"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default IndividualCard;
