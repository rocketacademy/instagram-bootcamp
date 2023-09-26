import React from "react";
import "../App.css";
import Chat from "../components/Chat";
import InstaForm from "../components/InstaForm";
import NewsFeed from "../components/NewsFeed";

function Insta() {
  // Return the JSX content to render on the webpage
  return (
    <div className="">
      <header className="App-header">
        <div>
          <Chat />
          <InstaForm />
          <NewsFeed />
        </div>
      </header>
    </div>
  );
}

export default Insta; // Export the App component as the default export
