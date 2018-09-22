import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineusers.js";

export default class CodeShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("id of user", this.props.id);
    }

    render() {
        return (
            <div className="codeShareMain">
                <p>Here Comes code editor</p>
                <div className="onlineUsers">
                    <OnlineUsers />
                </div>
                <div className="codeeditor">
                    <Link to={`/sharecode/${this.props.id}`}>
                        <h2>Start Coding Together</h2>
                    </Link>
                </div>
            </div>
        );
    }
}
