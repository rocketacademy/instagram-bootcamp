import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { Component } from "react";
import { auth } from "../firebase";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

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
            <>
                <form onSubmit={this.handleSubmit}>
                    <Stack
                        p={3}
                        spacing={2}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
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
                    </Stack>
                </form>

                <Stack
                    p={3}
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Link to="/">
                        <button>Log In Instead</button>
                    </Link>

                    <Link to="/">
                        <button>Back to Main</button>
                    </Link>
                </Stack>
            </>
        );
    }
}

export default SignUp;
