//-----------React-----------//
import React from "react";
//-----------Components-----------//
import NavBar from "../components/NavBar";
import Header from "../components/Header";
//-----------Firebase-----------//
//-----------Styling-----------//

export default class ChatPage extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl">Login Page</p>
        </div>
        <NavBar />
      </>
    );
  }
}
