import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_STUDENTS_KEY = "students";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      students: [],
      name: "",
    };
  }

  componentDidMount() {
    const studentsRef = ref(database, DB_STUDENTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(studentsRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        students: [...state.students, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const studentListRef = ref(database, DB_STUDENTS_KEY);
    const newStudentRef = push(studentListRef);
    set(newStudentRef, {
      name: this.state.name,
      date: new Date().toLocaleString(),
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let studentListItems = this.state.students.map((student) => (
      <li key={student.key}>
        {student.val.date}- {student.val.name}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <input
            type="text"
            value={this.state.name}
            onChange={(e) => {
              this.setState({
                name: e.target.value,
              });
            }}
            placeholder="Add a name here"
          />
          <button onClick={this.writeData}>Send</button>
          <ol>{studentListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
