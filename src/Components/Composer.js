import React from "react";
import { Container } from "react-bootstrap";

const Composer = ({
  newInput,
  handleChange,
  submit,
  imageUploadSetState,
  fileInputValue,
  deleteData,
  messages,
}) => {
  return (
    <Container className="d-flex align-items-center justify-content-center">
      <div
        className="w-100"
        style={{
          maxWidth: "500px",
          position: "fixed",
          bottom: "5vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Type here"
          value={newInput}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          style={{ width: "40%" }}
        />

        <input
          type="file"
          className="form-control form-control-sm"
          value={fileInputValue}
          onChange={imageUploadSetState}
          style={{ width: "40%" }}
        />

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={submit}
        >
          Send
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={deleteData}
          disabled={messages.length === 0}
        >
          Delete
        </button>
      </div>
    </Container>
  );
};

export default Composer;
