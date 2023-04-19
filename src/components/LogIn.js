import React, { Component } from "react";
import SignUp from "./SignUp";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRenderLogin: true,
            email: "",
            password: "",
        };
    }

    toggleLoginOrSignUp = () => {
        this.setState((prevState) => {
            return {
                shouldRenderLogin: !prevState.shouldRenderLogin,
            };
        });
    };

    logInUser = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.logInUser(this.state.email, this.state.password);
    };

    render() {
        return (
            <>
                {this.state.shouldRenderLogin ? (
                    <>
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            ></input>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            ></input>
                            <button type="submit">Log In</button>
                        </form>
                        <p>No account yet?</p>
                        <button onClick={this.toggleLoginOrSignUp}>
                            Create an account
                        </button>
                    </>
                ) : (
                    <>
                        <SignUp />
                        <br />
                        <button onClick={this.toggleLoginOrSignUp}>
                            Log In Instead
                        </button>
                    </>
                )}
            </>
        );
    }
}

export default LogIn;
