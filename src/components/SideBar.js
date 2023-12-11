import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPencil,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <>
      <div class="side-bar">
        <button type="button" onClick={() => navigate("/feed")}>
          <FontAwesomeIcon icon={faBook} />
        </button>
        <button type="button" onClick={() => navigate("/feed/post ")}>
          <FontAwesomeIcon icon={faPencil} />
        </button>
        <button type="button" onClick={() => navigate("/messenger ")}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      </div>
    </>
  );
};

export default SideBar;
