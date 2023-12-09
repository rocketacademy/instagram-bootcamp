import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Posts from "./Posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPencil,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div class="fixed left-0 h-screen px-6 bg-gray-100 space-y-8 flex-col flex justify-center">
        <button type="submit" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faBook} />
        </button>
        <button type="submit" onClick={() => setIsPostModalOpen(true)}>
          <FontAwesomeIcon icon={faPencil} />
        </button>
        <button type="submit" onClick={() => navigate("/messenger ")}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      </div>
      {isPostModalOpen && <Posts setIsPostModalOpen={setIsPostModalOpen} />}
    </>
  );
};

export default SideBar;
