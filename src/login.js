import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            error: "",
            emailid: "",
            password: ""
        };
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div className="loginForm">
                {this.state.error && (
                    <div className="error">
                        Email-id or password input seems to be wrong!!
                    </div>
                )}
                <h2 className="titletxt">LOGIN</h2>
                <input
                    type="email"
                    name="emailid"
                    onChange={this.handleChange}
                    placeholder="email-id"
                />
                <input
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                    placeholder="password"
                />
                <button
                    type="submit"
                    className="loginButton"
                    onClick={this.login}
                >
                    Log In
                </button>
                <p>
                    Not Registered yet?..,<Link to="/register">Register</Link>
                </p>
            </div>
        );
    }

    /* handles the change of values in input field and assigns to this.corrsponding*/
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    login() {
        axios
            .post("/login", {
                emailid: this.emailid,
                password: this.password
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ fname: data.username, logged: true });
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            });
    }
}
