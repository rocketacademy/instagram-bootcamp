import React from "react";

import {
    onChildAdded,
    push,
    ref as dbRef,
    set,
    update,
    onChildChanged,
} from "firebase/database";
import {
    getDownloadURL,
    ref as sRef,
    uploadBytesResumable,
} from "firebase/storage";
import { database, storage, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignUpFunc from "./components/SignUpFunc";
import LogInFunc from "./components/LogInFunc";

const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGES_KEY = "images";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            message: "",

            fileInputFile: null,
            fileInputValue: "",

            loggedInUser: null,
            shouldRenderAuthForm: false,
        };
    }

    componentDidMount() {
        const messagesRef = dbRef(database, DB_MESSAGES_KEY);

        onChildAdded(messagesRef, (data) => {
            this.setState((state) => ({
                messages: [
                    {
                        key: data.key,
                        msg: data.val().message,
                        date: data.val().date,
                        imageURL: data.val().imageURL,
                        author: data.val().author,
                        likes: data.val().likes,
                    },
                    ...state.messages,
                ],
            }));
        });

        onChildChanged(messagesRef, (data) => {
            console.log("child changed");
            this.setState((state) => {
                let copy = [...state.messages];
                let currMessage = copy.find(
                    (message) => message.key === data.key
                );

                let index = copy.indexOf(currMessage);

                state.messages.splice(index, 1, {
                    key: data.key,
                    msg: data.val().message,
                    date: data.val().date,
                    imageURL: data.val().imageURL,
                    author: data.val().author,
                    likes: data.val().likes,
                });

                return {
                    copy,
                };
            });
        });

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user is signed in");
                this.setState({ loggedInUser: user });
            } else {
                console.log("no user currently signed in");
                this.setState({ loggedInUser: null });
            }
        });
    }

    writeData = (message, imageURL) => {
        const messageListRef = dbRef(database, DB_MESSAGES_KEY);
        const newMessageRef = push(messageListRef);

        set(newMessageRef, {
            message,
            imageURL,
            date: Date.now(),
            author: this.state.loggedInUser.email,
            likes: 0,
        });
    };

    uploadFile = async (file) => {
        if (file == null) return null;
        const imageRef = sRef(storage, `${STORAGE_IMAGES_KEY}/${file.name}`);

        await uploadBytesResumable(imageRef, this.state.fileInputFile);
        let imageURL = await getDownloadURL(imageRef);
        return imageURL;
    };

    sanitizeUIData = () => {
        this.setState({
            message: "",

            fileInputFile: null,
            fileInputValue: "",
            fileInputURL: "",
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        let imageURL = await this.uploadFile(this.state.fileInputFile);

        this.writeData(this.state.message, imageURL);
        this.sanitizeUIData();
    };

    handleChange = (e) => {
        this.setState({ message: e.target.value });
    };

    handleFileChange = (e) => {
        this.setState({
            fileInputFile: e.target.files[0],
            fileInputValue: e.target.value,
        });
    };

    handleLike = (postKey, uid) => {
        const currMessage = this.state.messages.find(
            (message) => message.key === postKey
        );

        const likesRef = dbRef(database, `${DB_MESSAGES_KEY}/${postKey}`);

        if (currMessage.likes[uid] === true) {
            let updates = { ...currMessage.likes };
            delete updates[uid];
            if (Object.keys(updates).length === 0) updates = 0;

            update(likesRef, {
                likes: updates,
            });
            return;
        }

        update(likesRef, {
            likes: {
                ...currMessage.likes,
                [uid]: true,
            },
        });
    };

    signOutUser = () => {
        if (this.state.loggedInUser == null) return;
        signOut(auth)
            .then(() => {
                console.log("user signed out");
            })
            .catch((error) => {
                console.log("error signing out user", error);
            });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Navbar
                                        loggedInUser={this.state.loggedInUser}
                                        signOutUser={this.signOutUser}
                                    />
                                }
                            >
                                <Route
                                    index
                                    element={
                                        <Home
                                            {...this.state}
                                            handleSubmit={this.handleSubmit}
                                            handleChange={this.handleChange}
                                            handleFileChange={
                                                this.handleFileChange
                                            }
                                            handleLike={this.handleLike}
                                        />
                                    }
                                />
                                <Route
                                    path="signup"
                                    element={<SignUpFunc />}
                                ></Route>
                                <Route
                                    path="login"
                                    element={<LogInFunc />}
                                ></Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </header>
            </div>
        );
    }
}

export default App;
