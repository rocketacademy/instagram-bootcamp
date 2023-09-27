//-----------React-----------//
import React from "react";
//-----------Components-----------//
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import Feed from "../components/feed/Feed";
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
        <div className="flex h-screen items-center justify-center">
          <Feed />
        </div>
        <NavBar />
      </>
    );
  }
}
