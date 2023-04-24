import React, { Component } from "react";
import Newsfeed from "./Newsfeed";
import Composer from "./Composer";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";

export default class Home extends Component {
    render() {
        return (
            <Container maxWidth={"xs"}>
                <Newsfeed messages={this.props.messages} />
                {this.props.loggedInUser != null ? (
                    <Composer {...this.props} />
                ) : (
                    <Link to="/login">
                        <button>Log In</button>
                    </Link>
                )}

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
