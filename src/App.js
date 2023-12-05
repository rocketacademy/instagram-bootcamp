import React from "react";
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

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: teal,
  },
});
// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      user: null,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      this.setState({ user: user });
    });
    const postsRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
    onChildChanged(postsRef, (data) => {
      const replacePostIndex = this.state.posts.findIndex(
        (post) => post.key === data.key
      );
      const replace = this.state.posts.toSpliced(replacePostIndex, 1, {
        key: data.key,
        val: data.val(),
      });
      this.setState({ posts: replace });
    });
  }

  updateUser = () => {
    this.setState({ user: auth.currentUser });
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <UserBar user={this.state.user} updateUser={this.updateUser} />
              <Routes>
                <Route
                  path="/"
                  element={
                    <MainPage
                      posts={this.state.posts}
                      handleLike={this.handleLike}
                      user={this.state.user}
                    />
                  }
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
}

export default App;
