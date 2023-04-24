import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { Component, useState } from "react";
import { auth } from "../firebase";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

function SignUpFunc(props) {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const signUpUser = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(userCredential);
                // ...
            })
            .then(() => navigate("/"))
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error.message);
                // ..
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signUpUser(state.email, state.password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
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
                        value={state.email}
                        onChange={handleChange}
                        autoComplete="off"
                    ></input>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={state.password}
                        onChange={handleChange}
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

export default SignUpFunc;
