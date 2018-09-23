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
                <p>Here Comes code editor</p>
                <Link to={`/sharecode/${this.props.id}`}>
                    <h2>Start Coding Together</h2>
                </Link>
            </div>
        );
    }
}
