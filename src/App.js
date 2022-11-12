import React from "react";
import LoginForm from "./components/LoginForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm user={user} />} />

        <Route path="chat" element={<NavBar user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
