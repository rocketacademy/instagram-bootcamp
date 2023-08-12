import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";
import AuthForm from "./AuthForm";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import { auth } from "../firebase";
import logo from "../logo.png";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setLoggedInUser(null);
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };

  const authForm = <AuthForm />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const createAccountOrSignInButton = (
    <div>
      <Link to="authform">Create Account or Sign In</Link>
      <br />
    </div>
  );

  const composerAndNewsFeed = (
    <div className="composer-and-newsfeed-wrapper">
      {loggedInUser ? (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <br />
          {composer}
        </div>
      ) : (
        createAccountOrSignInButton
      )}
      <br />
      <NewsFeed />
    </div>
  );

  const logoStyle = {
    height: "60px", // Adjust the height as per your preference
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">
          <img src={logo} className="App-logo" alt="logo" style={logoStyle} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            {loggedInUser ? (
              <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="authform">
                Create Account or Sign In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="content-wrapper">
        <header className="App-header">
          <Routes>
            <Route path="/" element={composerAndNewsFeed} />
            <Route path="authform" element={authForm} />
          </Routes>
        </header>
      </div>
    </div>
  );
};

export default App;

// import { onAuthStateChanged } from "firebase/auth";
// import React from "react";
// import "./App.css";
// import AuthForm from "./AuthForm";
// import Composer from "./Composer";
// import NewsFeed from "./NewsFeed";
// import { auth } from "../firebase";
// import logo from "../logo.png";

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loggedInUser: null,
//       shouldRenderAuthForm: false,
//     };
//   }

//   componentDidMount() {
//     onAuthStateChanged(auth, (user) => {
//       // If user is logged in, save logged-in user to state
//       if (user) {
//         this.setState({ loggedInUser: user });
//         return;
//       }
//       // Else set logged-in user in state to null
//       this.setState({ loggedInUser: null });
//     });
//   }

//   toggleAuthForm = () => {
//     this.setState((state) => ({
//       shouldRenderAuthForm: !state.shouldRenderAuthForm,
//     }));
//   };

//   render() {
//     const authForm = <AuthForm toggleAuthForm={this.toggleAuthForm} />;
//     const composer = <Composer loggedInUser={this.state.loggedInUser} />;
//     const createAccountOrSignInButton = (
//       <div>
//         <button onClick={this.toggleAuthForm}>Create Account Or Sign In</button>
//         <br />
//       </div>
//     );
//     const composerAndNewsFeed = (
//       <div>
//         {/* Render composer if user logged in, else render auth button */}
//         {this.state.loggedInUser ? composer : createAccountOrSignInButton}
//         <br />
//         <NewsFeed />
//       </div>
//     );
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <br />
//           {this.state.shouldRenderAuthForm ? authForm : composerAndNewsFeed}
//         </header>
//       </div>
//     );
//   }
// }

// export default App;
