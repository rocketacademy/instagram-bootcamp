//-----------Imports-----------//
import React from "react";

//-----------Components-----------//
import MessageList from "../components/chat/MessageList";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
//-----------Firebase-----------//
//-----------Styling-----------//

export default class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Header />
        <div className="b flex h-max items-center justify-center">
          <MessageList />
        </div>
        <NavBar />
      </>
    );
  }
}
