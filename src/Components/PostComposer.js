const PostComposer = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <label
        htmlFor="image-upload"
        className={`image-upload ${props.file && "complete"}`}
      >
        <img
          src={`./icons/${props.file ? "done.svg" : "camera.svg"}`}
          alt="upload"
        />
      </label>
      <input id="image-upload" type="file" onChange={props.handleFileChange} />
      <input
        name="input"
        type="text"
        value={props.input}
        onChange={props.handleChange}
        autoComplete="off"
        placeholder="Type here"
      />

      <input type="submit" value="⬆" />
    </form>
  );
};

export default PostComposer;
