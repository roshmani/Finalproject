import React, { Component } from "react";
import { connect } from "react-redux";
/*************************code mirror headers*******************************************************/
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror";
import "codemirror/addon/lint/javascript-lint";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/swift/swift";
import "codemirror/mode/clojure/clojure";
import "codemirror/mode/python/python";
import "codemirror/mode/php/php";
import "codemirror/mode/erlang/erlang";
import "codemirror/mode/coffeescript/coffeescript";
import "codemirror/mode/crystal/crystal";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/bespin.css";
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/isotope.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/material.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/solarized.css";
import "codemirror/addon/lint/lint.css";
import { emit } from "./socket";
import RoomUsers from "./roomusers";
/***********************************************************************************************************/
let editor;
class CodeEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "",
            currentlyTyping: null,
            readOnly: false,
            mode: "javascript"
        };
        this.updateCode = this.updateCode.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.toggleReadOnly = this.toggleReadOnly.bind(this);
    }
    componentDidMount() {
        emit("room", { room: this.props.match.params.id });
        this.setState({ otherUserId: this.props.match.params.id });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.otherUserId != nextProps.match.params.id) {
            return {
                theId: nextProps.match.params.id
            };
        }
        return null;
    }
    componentDidUpdate() {
        console.log("code in componentDidUpdate", this.props.code);
        if (this.state.theId) {
            emit("room", { room: this.state.theId });
            this.setState({ otherUserId: this.state.theId, theId: null });
        }
    }
    componentWillUnmount() {
        emit("leaveRoom", {
            room: this.props.match.params.id
        });
    }

    updateCode(editor, data, newCode) {
        console.log("code in update:", newCode);
        emit("codeUpdate", {
            code: newCode,
            room: this.props.match.params.id
        });
    }

    updateCurrentlyTyping() {}

    changeMode(e) {
        var mode = e.target.value;
        this.setState({
            mode: this.state.mode,
            code: this.defaults[mode]
        });
    }
    toggleReadOnly() {
        this.setState(
            {
                readOnly: !this.state.readOnly
            },
            () => this.editor.focus()
        );
    }
    render() {
        let options = {
            lineNumbers: true,
            theme: "3024-night",
            readOnly: this.state.readOnly,
            mode: this.state.mode,
            gutters: ["CodeMirror-lint-markers"],
            lint: true,
            indentWithTabs: true,
            indentUnit: 4
        };
        /*if (!this.props.code) {
            return null;
        }*/
        return (
            <div className="codeRoom">
                <div className="codemirrordiv">
                    <CodeMirror
                        ref={e => (editor = e)}
                        value={this.props.code}
                        onBeforeChange={this.updateCode}
                        onChange={(editor, value) => {
                            console.log("changed value", { value });
                        }}
                        options={options}
                        autoFocus={true}
                        cursor={this.state.currentPosition}
                    />

                    <div style={{ marginTop: 10 }}>
                        <select
                            onChange={this.changeMode}
                            value={this.state.mode}
                        >
                            <option value="markdown">Markdown</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                        <button onClick={this.toggleReadOnly}>
                            Toggle read-only mode (currently{" "}
                            {this.state.readOnly ? "on" : "off"})
                        </button>
                    </div>
                </div>
                <RoomUsers />
            </div>
        );
    }
}
const mapCodetoProps = state => {
    return {
        code: state.code
    };
};

export default connect(mapCodetoProps)(CodeEditor);