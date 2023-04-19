import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { Component } from "react";
import { auth } from "../firebase";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    signUpUser = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(userCredential);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error.message);
                // ..
            });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.signUpUser(this.state.email, this.state.password);
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };

    render() {
        return (
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
                <button type="submit">Create Account</button>
            </form>
        );
    }
}

export default SignUp;
