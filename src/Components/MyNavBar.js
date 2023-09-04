import React, { Component } from "react";
import "../App.css"
//import { Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";
import Error from "./Error";
import MessageSubmit from "./MessageSubmit";
import PictureSubmit from "./PictureSubmit";
import PictureList from "./PictureList";
import Home from "./Home";

class MyNavbar extends Component {
  // constructor(props){
  //   super(props)
  // }
  render() {
    const {name} = this.props;
    return (
      <div>
       
        <BrowserRouter>
          <div >
            <Link className="Navigation-btns" to="/">Home </Link>
            <Link className="Navigation-btns" to="/chat">Chat </Link>
            <Link className="Navigation-btns" to="/picture/form"> Fruit Form </Link>

            <Link className="Navigation-btns" to="/picture/list">Fruit Lists</Link>
          </div>
          <Routes>
            <Route path="/" element={<Home name={name} />} />
            <Route
              path="/chat"
              element={<MessageSubmit displayName={name} />}
            />
            <Route
              path="/picture/form"
              element={<PictureSubmit displayName={name} />}
            />
            <Route path="/picture/list" element={<PictureList />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default MyNavbar;
