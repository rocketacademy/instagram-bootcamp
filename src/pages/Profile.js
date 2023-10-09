import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "../App.css";

import { auth } from "../firebase.js";
import Header from "../components/header-Hooks.js";
import Footer from "../components/footer-Hooks.js";
import { UserContext } from "../App-Hooks.js";

const Profile = (props) => {
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);
  
  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth)
    .then(() => {
      console.log("Signed Out");
      setUser({});
      setIsLoggedIn(false);
      navigate('/');
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <div className="App">
      <Header />
      <br />
      <div>
        Username: <span className="font-bold">{user.displayName}</span>
      </div>
      <div>
        Email: <span className="font-bold">{user.email}</span>
      </div>
      <br />
      <div>
        <button className="btn" onClick={logOut}>
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

// export default class Profile extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state={};
//     }

//     render () {
//         return (
//             <div className="App">
//                 <Header/>
//                 <br />
//                 <div>
//                     <p>Work In Progress</p>
//                 </div>
//                 <Footer/>
//             </div>
//         );
//     }
// }
