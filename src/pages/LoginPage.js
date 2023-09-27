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
          <button className="font-fontspring animate-bounce rounded-full rounded-bl-none border-2 border-slate-600  p-4 pl-8 pr-8 text-[40px] hover:bg-red-100">
            Login Page
          </button>
        </div>
        <NavBar />
      </>
    );
  }
}
