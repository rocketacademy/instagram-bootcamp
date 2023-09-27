//-----------React-----------//
import React from "react";
//-----------Components-----------//
import NavBar from "../components/NavBar";
import Header from "../components/Header";

//-----------Firebase-----------//
//-----------Styling-----------//

export default class HomePage extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div className="flex h-screen flex-col items-center justify-center bg-slate-200">
          <h1 className="font-fontspring border-y-8 border-red-700 p-4 text-[42px]">
            Welcome to Rocketgram 🏠
          </h1>
          <p className="m-4 animate-pulse border-2 border-slate-600 px-5 py-1 text-slate-600">
            Hit a button below to begin
          </p>
        </div>
        <NavBar />
      </>
    );
  }
}
