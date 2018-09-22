import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="landing">
            <h2 className="landingtxt">Code together with your friends !</h2>
            <h3>Make Something special, Work together to success..</h3>
            <Link to="/register">
                <div className="signbtn">Sign up</div>
            </Link>
        </div>
    );
}
