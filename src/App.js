import React from 'react';
import { onChildAdded, push, ref, set } from 'firebase/database';
import { database } from './firebase';
import logo from './logo.png';
import './App.css';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = 'messages';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      messageInput: '',
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    const newMessage = {
      text: this.state.messageInput,
      dateTime: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    };
    set(newMessageRef, newMessage);
    this.setState({ messageInput: '' });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <Row key={message.key}>
        <Col>{message.val.dateTime}</Col>
        <Col>{message.val.text}</Col>
      </Row>
    ));
    return (
      <div className='App'>
        <header className='App-header'>
          <Container>
            <Row>
              <Col>
                <img src={logo} className='App-logo' alt='logo' />
                {/* TODO: Add input field and add text input as messages in Firebase */}
                <Form
                  style={{
                    border: '1px solid #eeeeee',
                    padding: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <Form.Group>
                    <label>Enter your message:</label>
                    <br />
                    <input
                      type='text'
                      value={this.state.messageInput}
                      onChange={(e) =>
                        this.setState({ messageInput: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Button
                    onClick={this.writeData}
                    type='submit'
                    variant='primary'
                  >
                    Send
                  </Button>
                </Form>
              </Col>
            </Row>
            {messageListItems}
          </Container>
        </header>
      </div>
    );
  }
}

export default App;
