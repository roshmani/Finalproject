import React, { Component } from "react";
import { connect } from "react-redux";
import { emit } from "./socket";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.savechatMessage = this.savechatMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    savechatMessage(e) {
        if (e.which === 13) {
            console.log("emitting chat", this.props.room);
            emit("chat", { message: e.target.value, room: this.props.room });
            e.target.value = "";
        }
    }

    scrollToBottom() {
        this.element.scrollTop =
            this.element.scrollHeight - this.element.clientHeight;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    render() {
        if (!this.props.messages) {
            return null;
        }
        return (
            <div
                className="chatMessages"
                ref={element => (this.element = element)}
            >
                <h3 onClick={this.props.toggleChat} className="chatheader">
                    Chat Messages
                </h3>
                {this.props.messages.map(message => (
                    <div className="chats" key={message.chatid}>
                        <div className="userprof">
                            <p>
                                {message.fname} {message.lname}
                            </p>
                            <p>{message.send_at}</p>
                        </div>
                        <div className="chat">
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
                <textarea
                    className="chatmsg"
                    onKeyDown={this.savechatMessage}
                    placeholder="enter chat"
                />
            </div>
        );
    }
}

const mapChatMessagestoProps = state => {
    return {
        messages: state.messages
    };
};

export default connect(mapChatMessagestoProps)(Chat);
