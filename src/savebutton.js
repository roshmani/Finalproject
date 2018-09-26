import React, { Component } from "react";
import axios from "./axios";

export default class SaveButton extends Component {
    constructor(props) {
        super(props);
        this.state = { code: this.props.code, filename: this.props.filename };
    }

    render() {
        return (
            <form method="GET" action="/savecode">
                <button className="savefile">Save</button>
                <input type="hidden" name="code" value={this.props.code} />
                <input
                    type="hidden"
                    name="filename"
                    value={this.props.filename}
                />
            </form>
        );
    }
}
