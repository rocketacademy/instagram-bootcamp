//-----------React-----------//
import React from "react";
//-----------Components-----------//
import MessageList from "./components/chat/MessageList";
import NavBar from "./components/NavBar";

//-----------Firebase-----------//
//-----------Styling-----------//
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className=" bg-slate-100">
        <p className="font-fontspring fixed flex h-auto w-full items-center justify-center bg-slate-100 text-[40px]">
          Rocketgram 🚀
        </p>
        <MessageList />
        <NavBar />
      </div>
    );
  }
}

export default App;
