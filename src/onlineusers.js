import React, { Component } from "react";
import { connect } from "react-redux";

class OnlineUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="onlinewrapper">
                <div className="onlinefriends">
                    <h3>Online Users</h3>
                    {this.props.onlineUsers.map(onlineuser => (
                        <div className="onlineuser" key={onlineuser.id}>
                            {onlineuser.fname} {onlineuser.lname}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
const mapOnlineUserstoProps = state => {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(mapOnlineUserstoProps)(OnlineUsers);
