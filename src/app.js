import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Navigation from "./navigation";
import CodeEditor from "./codeeditor";
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
        const { fname, lname, id } = this.state;
        return (
            <BrowserRouter>
                <div className="appwrapper">
                    <div className="mainAppdiv">
                        <div className="headerappdiv">
                            <div className="logobrand">
                                <h1 className="logotxt">
                                    &lt;Code Together/&gt;
                                </h1>
                            </div>
                            <Navigation />
                            <div className="userloggeddiv">
                                <span className="userlogged">
                                    {fname} {lname}
                                </span>
                            </div>
                        </div>
                        <div className="codesharewrapper">
                            <Route
                                exact
                                path="/sharecode"
                                render={() => <CodeShare id={id} />}
                            />
                            <Route
                                exact
                                path="/sharecode/:id"
                                component={CodeEditor}
                            />
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
