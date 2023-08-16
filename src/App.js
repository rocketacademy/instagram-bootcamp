import React from "react";
import { useEffect, useState } from "react";
import "./App.css";

import Newsfeed from "./Newsfeed";
import Authform from "./Authform";
import PostForm from "./CreatePost";
import PostCard from "./Postcard";
import Error from "./Error";

import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { Routes, Link, Route, Navigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "./logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

function RequireAuth({ children, redirectTo, user }) {
  console.log(user);
  const isAuthenticated = user.uid && user.accessToken;
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (userObj) => {
      if (userObj) {
        setUser(userObj);
      }
    });
  }, [user]);

  return (
    <div className="App">
      <Navbar fixed="top" bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand className="justify-content-start" as={Link} to="/">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Rocket Gram
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-start">
            {" "}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/posts">
                Newsfeed
              </Nav.Link>
              <Nav.Link as={Link} to="/posts/create">
                Create New Post
              </Nav.Link>
              {user.uid && user.accessToken ? null : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            {user.email !== undefined ? (
              <Navbar.Text>
                Signed in as: {user.email}&nbsp;&nbsp;&nbsp;&nbsp;
              </Navbar.Text>
            ) : (
              <Navbar.Text>
                Signed in as: Guest&nbsp;&nbsp;&nbsp;&nbsp;
              </Navbar.Text>
            )}
            {user.uid && user.accessToken ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  signOut(auth).then(() => {
                    setUser({});
                  })
                }
              >
                signOut
              </Button>
            ) : null}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header className="App-header">
        <Routes>
          <Route
            path="/"
            element={user.uid && user.accessToken ? <Newsfeed /> : <Authform />}
          />
          <Route path="/login" element={<Authform />} />
          <Route path="/posts">
            <Route
              index={true}
              element={
                <Newsfeed
                  username={user.uid && user.accessToken ? user.email : ""}
                />
              }
            />
            <Route path="/posts/:id" element={<PostCard />} />
            <Route
              path="create"
              element={
                <RequireAuth redirectTo="/login" user={user}>
                  <PostForm useremail={user.email} />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;

/*
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {},
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.setState({ isLoggedIn: true, user: user });
      }
    });
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div className="App">
        <NavbarComponent useremail={this.state.user.email} />
        <header className="App-header">
          {this.state.isLoggedIn === true && (
            <h2>Welcome back {this.state.user.email}</h2>
          )}

          {this.state.isLoggedIn === true && (
            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                this.setState({ isLoggedIn: false });
                signOut(auth);
                this.setState({ user: {} });
              }}
            >
              Logout!
            </Button>
          )}
          <br />
          {this.state.isLoggedIn === false ? (
            <Authform />
          ) : (
            <PostForm useremail={this.state.user.email} />
          )}
          <br />
          <Newsfeed username={this.state.isLoggedIn === true ? this.state.user.email : ""}/>
        </header>
      </div>
    );
  }
}
*/
