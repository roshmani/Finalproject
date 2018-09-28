import React, { Component } from "react";
import { connect } from "react-redux";

class RoomUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        console.log("users:", this.props.users);
        if (!this.props.users) {
            return null;
        }
        return (
            <div className="userwrapper">
                <div className="users">
                    <h3>Current Coders in the cube</h3>
                    {this.props.users.map(user => (
                        <div className="roomuser" key={user.id}>
                            {user.fname} {user.lname}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
const mapUserstoProps = state => {
    return {
        users: state.users
    };
};

export default connect(mapUserstoProps)(RoomUsers);
