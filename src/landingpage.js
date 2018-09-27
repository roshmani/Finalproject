import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="landing">
            <h2 className="landingtxt">Code together with others !</h2>
            <h3>
                Solve coding challenges with others realtime, Work together to
                success..
            </h3>
            <div className="signupbtndiv">
                <Link to="/register">
                    <p className="signupbtn">Sign Up</p>
                </Link>
            </div>
        </div>
    );
}
