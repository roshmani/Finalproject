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
            emit("chat", e.target.value);
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
                Chat Messages
                {this.props.messages.map(message => (
                    <div className="chats" key={message.chatid}>
                        <div className="userprof">
                            {message.fname} {message.lname}
                        </div>
                        <div className="chat">
                            <p>{message.send_at}</p>
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
