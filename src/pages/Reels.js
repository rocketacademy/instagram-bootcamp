import React from "react";
import "../App.css"

import Header from "../components/class-based-components/header.js"
import Footer from "../components/class-based-components/footer.js"

export default class Reels extends React.Component{
    constructor(props) {
        super(props);
        this.state={};
    }

    render () {
        return (
            <div className="App">
                <Header/>
                <br />
                <div>
                    <p>Work In Progress</p>
                </div>
                <Footer/>
            </div>
        );
    }
}