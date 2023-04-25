import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

const LogInFunc = (props) => {
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const logInUser = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                // const user = userCredential.user;
                // ...
            })
            .then(() => navigate("/"))
            .catch((error) => {
                alert("Wrong username or password!");
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        logInUser(state.email, state.password);
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
};

export default LogInFunc;
