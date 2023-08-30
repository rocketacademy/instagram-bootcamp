import React from 'react';

export const Post = ({ posts }) => {
  const { title, caption, tags, url } = posts;

  return (
    <>
      <div className="PostCard">
        <h4> {title}</h4>
        <img src={url} alt="{title" />

        <p> {tags}</p>

        <p> {caption}</p>
      </div>
    </>
  );
};
