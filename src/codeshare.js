import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class CodeShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("id of user", this.props.id);
    }

    render() {
        return (
            <div className="codeShareMain">
                <Link to={`/sharecode/${this.props.id}`}>
                    <h2 className="roomnav">Go to Coding Cube</h2>
                </Link>
            </div>
        );
    }
}
