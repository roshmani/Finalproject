import React, { Component } from "react";
import { connect } from "react-redux";
/*************************code mirror headers*******************************************************/
import Codemirror from "react-codemirror";
require("codemirror/lib/codemirror");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/xml/xml");
require("codemirror/mode/markdown/markdown");
require("codemirror/mode/ruby/ruby");
require("codemirror/mode/swift/swift");
require("codemirror/mode/clojure/clojure");
require("codemirror/mode/python/python");
require("codemirror/mode/php/php");
require("codemirror/mode/erlang/erlang");
require("codemirror/mode/coffeescript/coffeescript");
require("codemirror/mode/crystal/crystal");
/***********************************************************************************************************/
export default class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeState: "",
            currentlyTyping: null,
            readOnly: false
        };
        this.updateCode = this.updateCode.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.toggleReadOnly = this.toggleReadOnly.bind(this);
    }
    componentDidMount() {
        /*this.editor = Codemirror(this.editor, {
            value: "function myScript(){return 100;}\n",
            mode: "javascript"
        });*/
    }
    updateCode(newCode) {
        this.setState({
            codeState: newCode
        });
    }
    changeMode(e) {
        var mode = e.target.value;
        this.setState({
            mode: mode,
            codeState: ""
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
            theme: "monokai",
            readOnly: this.state.readOnly,
            mode: this.state.mode
        };
        return (
            <div className="codemirrordiv">
                <Codemirror
                    ref={editor => (this.editor = editor)}
                    value={this.state.codeState}
                    onChange={this.updateCode}
                    options={options}
                    autoFocus={true}
                />

                <div style={{ marginTop: 10 }}>
                    <select onChange={this.changeMode} value={this.state.mode}>
                        <option value="markdown">Markdown</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                    <button onClick={this.toggleReadOnly}>
                        Toggle read-only mode (currently{" "}
                        {this.state.readOnly ? "on" : "off"})
                    </button>
                </div>
            </div>
        );
    }
}
/*const mapCodetoProps = state => {
    return {
        codeState: state.codeState
    };
};

export default connect(mapCodetoProps)(CodeEditor);*/
