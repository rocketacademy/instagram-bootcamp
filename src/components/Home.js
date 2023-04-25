import React, { Component } from "react";
import Newsfeed from "./Newsfeed";
import { Link } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import FormDialog from "./extras/FormDialog";

export default class Home extends Component {
    render() {
        return (
            <Container maxWidth={"xs"}>
                {this.props.loggedInUser == null && (
                    <Link to="/login">
                        <Button
                            variant="contained"
                            style={{
                                position: "absolute",
                                top: "90%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 99,
                            }}
                        >
                            Log In or Sign Up
                        </Button>
                    </Link>
                )}
                <Box
                    className={this.props.loggedInUser == null ? "paywall" : ""}
                >
                    <Newsfeed
                        messages={this.props.messages}
                        loggedInUser={this.props.loggedInUser}
                        handleLike={this.props.handleLike}
                    />
                    {this.props.loggedInUser != null && (
                        // <Composer {...this.props} />
                        <FormDialog {...this.props} />
                    )}
                </Box>

                {/* {this.state.shouldRenderAuthForm ? (
                    <>
                        <LogIn />
                        <br />
                        <button onClick={this.toggleAuthForm}>
                            Back to Main
                        </button>
                    </>
                ) : (
                    <>
                        <Newsfeed messages={this.state.messages} />
                        <button onClick={this.toggleAuthForm}>Log In</button>
                    </>
                )}
                {this.state.loggedInUser != null && (
                    <>
                        <Composer
                            handleSubmit={this.handleSubmit}
                            handleChange={this.handleChange}
                            handleFileChange={this.handleFileChange}
                            {...this.state}
                        />
                        <button onClick={this.signOutUser}>Sign Out</button>
                    </>
                )} */}
            </Container>
        );
    }
}
