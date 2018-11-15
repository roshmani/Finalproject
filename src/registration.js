import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            error: false,
            fname: "",
            lnmae: "",
            emailid: "",
            password: ""
        };
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div className="regForm">
                {this.state.error && (
                    <div className="error">
                        Something went wrong in Registration!!
                    </div>
                )}
                <h2 className="titletxt">CREATE YOUR ACCOUNT</h2>
                <input
                    type="text"
                    name="fname"
                    onChange={this.handleChange}
                    placeholder="First name"
                />
                <input
                    type="text"
                    name="lname"
                    onChange={this.handleChange}
                    placeholder="Last name"
                />
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
                    className="regButton"
                    onClick={this.submit}
                >
                    Register
                </button>
                <p>
                    Already a member?,<Link to="/login">Log In</Link>
                </p>
            </div>
        );
    }

    /* handles the change of values in input field and assigns to this.corrsponding*/
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios
            .post("/register", {
                fname: this.fname,
                lname: this.lname,
                emailid: this.emailid,
                password: this.password
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ logged: true });
                    location.replace("/codecube");
                } else {
                    this.setState({ error: true });
                }
            });
    }
}
