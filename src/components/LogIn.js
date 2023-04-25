import React, { Component } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Stack } from "@mui/material";

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRenderLogin: true,
            email: "",
            password: "",
        };
    }

    logInUser = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                return <Navigate to="/" />;
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
                            autoComplete="off"
                        ></input>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        ></input>
                        <button type="submit">Log In</button>
                    </Stack>
                </form>
                <Stack
                    p={3}
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <p>No account yet?</p>
                    <Link to="/signup">
                        <button>Create an account</button>
                    </Link>

                    <Link to="/">
                        <button>Back to Main</button>
                    </Link>
                </Stack>
            </>
        );
    }
}

export default LogIn;
