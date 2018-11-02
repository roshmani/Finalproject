import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ShareUrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        console.log("props:", this.props);
        return (
            <div className="mail">
                {this.state.error && (
                    <div className="error">Something went wrong in mail!!</div>
                )}
                <button className="close" onClick={this.props.onClick}>
                    X
                </button>
                <h2 className="titletxt">Share your Code Room Link</h2>

                <input
                    type="email"
                    name="toemail"
                    onChange={this.handleChange}
                    placeholder="email-id to send link to"
                />

                <button
                    type="submit"
                    className="shareButton"
                    onClick={this.submit}
                >
                    Share Link
                </button>
            </div>
        );
    }

    /* handles the change of values in input field and assigns to this.corrsponding*/
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios
            .post("/sendMail", {
                emailid: this.toemail,
                sharedUrl: window.location.href
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ send: true });
                    console.log("Message send!");
                } else {
                    this.setState({ error: true });
                }
            });
    }
}
