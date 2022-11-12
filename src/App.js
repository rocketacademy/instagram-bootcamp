import React from "react";
import LoginForm from "./components/LoginForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import NavBar from "./components/NavBar";

function App() {
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        console.log(user);
      },
      []
    );
  });
  return (
    <>
      <NavBar user={user} />
      <LoginForm user={user} />
    </>
  );
}

export default App;
