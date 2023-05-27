import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: "",
      passwordInputValue: "",
      isNewUser: true,
      messageLog: "",
      errorMsg: 0,
    };
    
  }

  // Use a single method to control email and password form inputs
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }); //corresponding to the state name from the fields
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        isNewUser: true,
      });
      // Toggle auth form off after authentication
      this.props.toggleAuthForm();

    };

    // Authenticate user on submit
    if (this.state.isNewUser) {
      createUserWithEmailAndPassword( //This will handle the user creation
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue
      )
        .then(closeAuthForm) //Once authenticated, it will close
        .catch((error) => {
            // Login error, handle the error
            const errorCode = error.code;
            // const errorMessage = error.message;
            // console.log('Creation error: ', errorCode, errorMessage);
            this.setState({
                messageLog: 'Creation error:' + errorCode,
                errorMsg: 2,
              });
          });
    } 
    
    else {
      signInWithEmailAndPassword(auth,this.state.emailInputValue,this.state.passwordInputValue)
      .then((userCredential) => { //This will handle the existing user sign-in
        // Login successful, handle the authenticated user
        const user = userCredential.user;
        // console.log('Logged in user: ', user);
        this.setState({
            messageLog: 'Successfully logged-in!: ' + user,
            errorMsg: 1,
          });
      })
      .then(closeAuthForm) //Once authenticated, it will close
      .catch((error) => { 
        // Login error, handle the error
        const errorCode = error.code;
        // const errorMessage = error.message;
        // console.log('Login error: ', errorCode, errorMessage);
        this.setState({
            messageLog: 'Login error: ' + errorCode,
            errorMsg: 2,
          });
      });
    }
  };

  toggleNewOrReturningAuth = () => {
    this.setState((state) => ({ isNewUser: !state.isNewUser }));
  };

  render() {
    return (
      <div>
 
        <p>Sign in with this form to post.</p>

        <form onSubmit={this.handleSubmit}>
          <label>
            <span>Email: </span>
            <input
              type="email"
              name="emailInputValue"
              value={this.state.emailInputValue}
              onChange={this.handleInputChange}
            />
          </label>
          <br />

          <label>
            <span>Password: </span>
            <input
              type="password"
              name="passwordInputValue"
              value={this.state.passwordInputValue}
              onChange={this.handleInputChange}
            />
          </label>

          <br />

          <input
            type="submit"
            value={this.state.isNewUser ? "Create Account" : "Sign In"}
            // Disable form submission if email or password are empty
            // Apparently you can do that when using a boo lean operator on string
            disabled={
              !this.state.emailInputValue || !this.state.passwordInputValue
            }
          />
          <br />
          <button onClick={this.toggleNewOrReturningAuth}>
            {this.state.isNewUser
              ? "If you have an account, click here to login"
              : "If you are a new user, click here to create account"}
          </button>

        </form>

        <div >
        <p className = {this.state.errorMsg === 1 ? 'msgLog' : 'errorLog'}>
          {(this.state.errorMsg !==0 ) ? `${this.state.messageLog}` : null}
        </p>
        </div>
        
      </div>
    );
  }
}

export default AuthForm;