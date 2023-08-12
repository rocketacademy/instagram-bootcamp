import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthForm = () => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "emailInputValue") {
      setEmailInputValue(value);
    } else if (name === "passwordInputValue") {
      setPasswordInputValue(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      setEmailInputValue("");
      setPasswordInputValue("");
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");
      navigate("/");
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    if (isNewUser) {
      createUserWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser((prevState) => !prevState);
  };

  return (
    <div>
      <p>{errorCode ? `Error code: ${errorCode}` : null}</p>
      <p>{errorMessage ? `Error message: ${errorMessage}` : null}</p>
      <p>Sign in with this form to post.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email: </span>
          <input
            type="email"
            name="emailInputValue"
            value={emailInputValue}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          <span>Password: </span>
          <input
            type="password"
            name="passwordInputValue"
            value={passwordInputValue}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <input
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          disabled={!emailInputValue || !passwordInputValue}
        />
        <br />
        <Button variant="link" onClick={toggleNewOrReturningAuth}>
          {isNewUser
            ? "If you have an account, click here to login"
            : "If you are a new user, click here to create account"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;

// import React from "react";
// import Button from "react-bootstrap/Button";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { auth } from "../firebase";

// class AuthForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       emailInputValue: "",
//       passwordInputValue: "",
//       isNewUser: true,
//       errorCode: "",
//       errorMessage: "",
//     };
//   }

//   // Use a single method to control email and password form inputs
//   handleInputChange = (event) => {
//     this.setState({ [event.target.name]: event.target.value });
//   };

//   handleSubmit = (event) => {
//     event.preventDefault();

//     const closeAuthForm = () => {
//       // Reset auth form state
//       this.setState({
//         emailInputValue: "",
//         passwordInputValue: "",
//         isNewUser: true,
//         errorCode: "",
//         errorMessage: "",
//       });
//       // Toggle auth form off after authentication
//       this.props.toggleAuthForm();
//     };

//     const setErrorState = (error) => {
//       this.setState({
//         errorCode: error.code,
//         errorMessage: error.message,
//       });
//     };

//     // Authenticate user on submit
//     if (this.state.isNewUser) {
//       createUserWithEmailAndPassword(
//         auth,
//         this.state.emailInputValue,
//         this.state.passwordInputValue
//       )
//         .then(closeAuthForm)
//         .catch(setErrorState);
//     } else {
//       signInWithEmailAndPassword(
//         auth,
//         this.state.emailInputValue,
//         this.state.passwordInputValue
//       )
//         .then(closeAuthForm)
//         .catch(setErrorState);
//     }
//   };

//   toggleNewOrReturningAuth = () => {
//     this.setState((state) => ({ isNewUser: !state.isNewUser }));
//   };

//   render() {
//     return (
//       <div>
//         <p>
//           {this.state.errorCode ? `Error code: ${this.state.errorCode}` : null}
//         </p>
//         <p>
//           {this.state.errorMessage
//             ? `Error message: ${this.state.errorMessage}`
//             : null}
//         </p>
//         <p>Sign in with this form to post.</p>
//         <form onSubmit={this.handleSubmit}>
//           <label>
//             <span>Email: </span>
//             <input
//               type="email"
//               name="emailInputValue"
//               value={this.state.emailInputValue}
//               onChange={this.handleInputChange}
//             />
//           </label>
//           <br />
//           <label>
//             <span>Password: </span>
//             <input
//               type="password"
//               name="passwordInputValue"
//               value={this.state.passwordInputValue}
//               onChange={this.handleInputChange}
//             />
//           </label>
//           <br />
//           <input
//             type="submit"
//             value={this.state.isNewUser ? "Create Account" : "Sign In"}
//             // Disable form submission if email or password are empty
//             disabled={
//               !this.state.emailInputValue || !this.state.passwordInputValue
//             }
//           />
//           <br />
//           <Button variant="link" onClick={this.toggleNewOrReturningAuth}>
//             {this.state.isNewUser
//               ? "If you have an account, click here to login"
//               : "If you are a new user, click here to create account"}
//           </Button>
//         </form>
//       </div>
//     );
//   }
// }

// export default AuthForm;
