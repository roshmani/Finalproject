import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import LandingPage from "./landingpage";
import Login from "./login";
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div className="landingpagediv">
                <div className="headerdiv">
                    <div className="logobrand">
                        <h1 className="logotxt">&lt;Code Cube/&gt;</h1>
                    </div>
                    <div className="signinbtndiv">
                        <Link to="/login">
                            <p className="signinbtn">Sign In</p>
                        </Link>
                    </div>
                </div>
                <div className="welcomediv">
                    <div className="componentdiv">
                        <Route exact path="/" component={LandingPage} />
                        <Route
                            exact
                            path="/register"
                            component={Registration}
                        />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </div>
        </HashRouter>
    );
}
