import React from "react";
import { get, onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      userId: "",
      inputMessage: "",
      year: "",
      month: "",
      date: "",
      hours: "",
      minutes: "",
      messages: [],
    };
  }

  componentDidMount() {
    const dbRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(dbRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, ...data.val() }],
      }));
    });
  }

  onChange = (e) => {
    let { id, value } = e.target;
    console.log(value);
    if (id === "message") {
      this.setState({
        inputMessage: value,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const dbRef = ref(database, DB_MESSAGES_KEY);
    push(dbRef, {
      userId: this.state.userId,
      inputMessage: this.state.inputMessage,
      year: `${new Date().getFullYear()}`,
      month: `${new Date().getMonth() + 1}`,
      date: `${new Date().getDate()}`,
      hours: `${new Date().getHours()}`,
      minutes: `${new Date().getMinutes()}`,
    });

    this.setState({
      userId: "",
      inputMessage: "",
      date: "",
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      let month = months[message.month];

      return (
        <div className="chat chat-end">
          <div className="chat-header">
            <time className="text-xs opacity-50">
              {message.date +
                "-" +
                month +
                " " +
                message.hours +
                ":" +
                message.minutes}
            </time>
          </div>
          <div key={message.key} className="chat-bubble text-right text-sm">
            {message.inputMessage}
          </div>
          <i className="fi fi-rr-paper-plane"></i>
        </div>
      );
    });

    return (
      <div className="App">
        <header className="navbar bg-base-100 text-2xl flex justify-between p-4 border-b">
          <a href="/" className="font-sans">
            Rocketgram 🚀
          </a>
          <i className="fi fi-rr-comments"></i>
        </header>

        <section
          className="absolute bottom-32 flex h-screen w-screen flex-col p-4 overflow-auto scroll-auto"
          style={{ height: "calc(100% - 208px)" }}
        >
          <div className="flex flex-col items-end justify-center">
            {messageListItems}
          </div>
        </section>

        <form
          onSubmit={(e) => this.handleSubmit(e)}
          className="absolute bottom-16 flex items-center justify-between w-screen p-4 gap-2"
        >
          <input
            type="text"
            id="message"
            placeholder="Input your text here"
            onChange={(e) => this.onChange(e)}
            value={this.state.inputMessage}
            className="input input-bordered w-full p-2 rounded"
          />
          <input className="btn" type="submit" />
        </form>

        <footer className="btm-nav">
          <button className="text-2xl active">
            <i className="fi fi-rr-home"></i>
          </button>
          <button className="text-2xl">
            <i className="fi fi-rr-search"></i>
          </button>
          <button className="text-2xl">
            <i className="fi fi-rr-add"></i>
          </button>
          <button className="text-2xl">
            <i className="fi fi-rr-video-camera-alt"></i>
          </button>
          <button className="text-2xl">
            <i className="fi fi-rr-circle-user"></i>
          </button>
        </footer>
      </div>
    );
  }
}

export default App;
