import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Navigation from "./navigation.js";
import CodeShare from "./codeshare";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/getUserDetails").then(({ data }) => {
            this.setState(data);
            /************* or you can also do this to be explicit  ***************************/
            /*const { id, fname, lname, emailid, bio, imageUrl } = data;
            this.setState({
                id,
                fname,
                lname,
                emailid,
                bio,
                imageUrl: imageurl
            });*/
            /*********************************************************************************/
        });
    }

    render() {
        if (!this.state.id) {
            return <div>Loading...</div>;
        }
        const { fname, lname } = this.state;
        return (
            <BrowserRouter>
                <div>
                    <div className="mainAppdiv">
                        <div className="headerdiv">
                            <div className="logodiv">
                                <h1 className="logoimg">Code Together</h1>
                            </div>
                            <div className="userloggeddiv">
                                <span className="userlogged">
                                    {fname} {lname}
                                </span>
                            </div>
                            <Navigation />
                        </div>
                        <Route exact path="/sharecode" component={CodeShare} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
