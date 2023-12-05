import { onChildAdded, onChildChanged, ref } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import UserBar from "./Component/UserBar";
import { createTheme, ThemeProvider } from "@mui/material";
import { indigo, teal } from "@mui/material/colors";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Component/MainPage";
import LogInForm from "./Component/LogInForm";
import SignUpForm from "./Component/SignUpForm";
import { useState, useEffect } from "react";

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: teal,
  },
});
const DB_POSTS_KEY = "posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const postsRef = ref(database, DB_POSTS_KEY);

    onChildAdded(postsRef, (data) => {
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    });

    onChildChanged(postsRef, (data) => {
      setPosts((prevPosts) => {
        const replacePostIndex = prevPosts.findIndex(
          (post) => post.key === data.key
        );
        const replace = prevPosts.slice();
        replace[replacePostIndex] = { key: data.key, val: data.val() };
        return replace;
      });
    });
  }, []);

  const updateUser = () => {
    setUser(auth.currentUser);
  };

  return (
    <div className="App">
      <div className="App-header">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <UserBar user={user} updateUser={updateUser} />
            <Routes>
              <Route
                path="/"
                element={<MainPage posts={posts} user={user} />}
              />
              <Route path="/logIn" element={<LogInForm />} />
              <Route path="/signUp" element={<SignUpForm />} />
              <Route path="/*" element={<div>404</div>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </div>
  );
}
