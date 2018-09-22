import React, { Component } from "react";
import { connect } from "react-redux";
/*************************code mirror headers*******************************************************/
import Codemirror from "react-codemirror";
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

/***********************************************************************************************************/
export default class CodeEditor extends Component {
    constructor(props) {
        super(props);
        let defaults = {
            javascript: 'var component = {\n\tname: "Code-Together"\n};'
        };
        this.state = {
            codeState: defaults.javascript,
            currentlyTyping: null,
            readOnly: false,
            mode: "javascript"
        };

        this.updateCode = this.updateCode.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.toggleReadOnly = this.toggleReadOnly.bind(this);
    }

    updateCode(newCode) {
        this.setState({
            codeState: newCode
        });
    }
    changeMode(e) {
        var mode = e.target.value;
        this.setState({
            mode: this.state.mode,
            codeState: this.defaults[mode]
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
            mode: this.state.mode,
            gutters: ["CodeMirror-lint-markers"],
            lint: true,
            indentWithTabs: true,
            indentUnit: 4
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
