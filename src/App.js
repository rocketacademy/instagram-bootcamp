import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
    constructor(props) {
        super(props);
        // Initialise empty messages array in state to keep local state in sync with Firebase
        // When Firebase changes, update local state, which will update local UI
        this.state = {
            messages: [],
            message: "",
        };
    }

    componentDidMount() {
        const messagesRef = ref(database, DB_MESSAGES_KEY);
        // onChildAdded will return data for every child at the reference and every subsequent new child
        onChildAdded(messagesRef, (data) => {
            // Add the subsequent child to local component state, initialising a new array to trigger re-render
            this.setState((state) => ({
                // Store message key so we can use it as a key in our list items when rendering messages
                messages: [
                    ...state.messages,
                    {
                        key: data.key,
                        msg: data.val().message,
                        date: data.val().date,
                    },
                ],
            }));
        });
    }

    // Note use of array fields syntax to avoid having to manually bind this method to the class
    writeData = (message) => {
        const messageListRef = ref(database, DB_MESSAGES_KEY);
        // const newMessageRef = push(messageListRef);

        push(messageListRef, {
            message,
            date: Date.now(),
        });

        // set(newMessageRef, { message, date: Date.now() });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.writeData(this.state.message);
    };

    handleChange = (e) => {
        this.setState({ message: e.target.value });
    };

    render() {
        // Convert messages in state to message JSX elements to render
        let messageListItems = this.state.messages.map((message) => (
            <li key={message.key}>
                {message.msg}, timestamp:{" "}
                {new Date(message.date).toLocaleString("en-SG")}
            </li>
        ));
        return (
            <div className="App">
                <header className="App-header">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            value={this.message}
                            onChange={this.handleChange}
                            name="message"
                            autoComplete="off"
                        ></input>
                        <button type="submit">Send</button>
                    </form>

                    <ol>{messageListItems}</ol>
                </header>
            </div>
        );
    }
}

export default App;
