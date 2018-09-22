import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <div className="main-header">
            <div className="nav">
                <ul className="navbar">
                    <li>
                        <Link to="/sharecode">Start Coding</Link>
                    </li>
                    <li>
                        <a href="/logout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
