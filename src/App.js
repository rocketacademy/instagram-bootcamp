import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { NavBar } from "./Components/NavBar";
import { ChatMessagesFunction } from "./Components/ChatMessagesFunction";
import { FileUploadFormFunction } from "./Components/FileUploadFormFunction";
import { MessageFormFunction } from "./Components/MessageFormFunction";
import { PostDisplayFunction } from "./Components/PostDisplayFunction";
import { useEffect, useState } from "react";

export const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [user, setUser] = useState({});

  const signOutUser = () => {
    setLoggedInUser(false);
    setUser({});
    signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(true);
        setUser(user);
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-col justify-between lg:flex-row ">
        {loggedInUser ? (
          <p className="btn btn-ghost text-xl">Hello, {user.email}</p>
        ) : (
          <p className="btn btn-ghost text-xl">
            Please sign in to chat and post~
          </p>
        )}
        <NavBar loggedInUser={loggedInUser} signOut={signOutUser} />
      </div>
      <div className="flex flex-col items-start pb-10 lg:flex-row lg:justify-around">
        <div className="flex flex-col h-[680px] mt-2">
          <ChatMessagesFunction />
          <div className="flex lg:justify-between m-2">
            {loggedInUser ? <MessageFormFunction email={user.email} /> : null}
          </div>
        </div>
        <div className="h-[500px] mt-5">
          <p className="text-lg text-center font-semibold"> Album Highlights</p>
          <PostDisplayFunction />
          {loggedInUser ? <FileUploadFormFunction /> : null}
        </div>
      </div>
    </>
  );
};
