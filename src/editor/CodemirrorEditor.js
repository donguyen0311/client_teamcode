import React from 'react';
import {Segment, Menu, Dropdown, Icon} from 'semantic-ui-react';
import CodeMirror from 'react-codemirror';

// const io = require('socket.io-client');
// const socket = io();

require('codemirror/lib/codemirror.css');
require('codemirror/addon/lint/lint.css');
require('codemirror/addon/scroll/simplescrollbars.css');
require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/dialog/dialog.css');
require('codemirror/addon/search/matchesonscrollbar.css');
require('codemirror/addon/tern/tern.css');
require('codemirror/addon/fold/foldgutter.css');
require('codemirror/addon/hint/show-hint.css');

// require('codemirror/addon/util/formatting.js');
require('codemirror/addon/scroll/simplescrollbars.js');
require('codemirror/addon/edit/closetag.js');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/selection/active-line.js');
require('codemirror/addon/dialog/dialog.js');
require('codemirror/addon/tern/tern.js');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/search/matchesonscrollbar.js');
require('codemirror/addon/search/jump-to-line.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/comment-fold.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/indent-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/hint/javascript-hint.js');
require('codemirror/addon/hint/html-hint.js');
require('codemirror/addon/hint/css-hint.js');
require('codemirror/addon/hint/sql-hint.js');
require('codemirror/addon/hint/xml-hint.js');
require('codemirror/addon/hint/anyword-hint.js');
require('codemirror/addon/lint/lint.js');
require('codemirror/addon/lint/javascript-lint.js');
require('codemirror/addon/lint/json-lint.js');
// require('codemirror/addon/lint/css-lint.js');
require('codemirror/addon/lint/coffeescript-lint.js');
require('codemirror/addon/lint/yaml-lint.js');

require('codemirror/addon/mode/loadmode.js');
require('codemirror/mode/meta.js');
// require('codemirror/mode/javascript/javascript.js');
// require('codemirror/mode/php/php.js');
function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}
requireAll(require.context("codemirror/mode", true, /^\.\/.*\.js$/))

class CodemirrorEditor extends React.Component {
    constructor(props) {
        super(props);
        this.options = {
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 2,
            lint: true,
            scrollbarStyle: "simple",
            matchTags: {
                bothTags: true
            },
            matchBrackets: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
            foldGutter: true,
            gutters: [
                "CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"
            ],
            extraKeys: {
                "*": "autocomplete",
                "Ctrl-F": "findPersistent"
            }
        };
        this.state = {
            code: 'Hello!!! No way!'
        };
        this.updateCode = this
            .updateCode
            .bind(this);
        this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
    }
    updateCode(newCode) {
        this.setState({code: newCode});
    }
    componentDidMount() {
        let codemirror = this.refs.CodeMirror.getCodeMirror();
        let codeMirrorInstance = this.refs.CodeMirror.getCodeMirrorInstance();
        this.handleChangeModeCodemirror('foo.js', codemirror, codeMirrorInstance); // demo
    }
    handleChangeDropdown(e, {name, value}) {
        //console.log(name, value);
        let codemirror = this.refs.CodeMirror.getCodeMirror();
        let codeMirrorInstance = this.refs.CodeMirror.getCodeMirrorInstance();
        this.handleChangeModeCodemirror(value, codemirror, codeMirrorInstance);
    }
    handleChangeModeCodemirror(modeValue, codeMirrorValue, CodeMirror) {
        var val = modeValue, m, mode, spec;
        if (m = /.+\.([^.]+)$/.exec(val)) {
            var info = CodeMirror.findModeByExtension(m[1]);
            if (info) {
                mode = info.mode;
                spec = info.mime;
            }
        } else if (/\//.test(val)) {
            var info = CodeMirror.findModeByMIME(val);
            if (info) {
                mode = info.mode;
                spec = val;
            }
        } else {
            mode = spec = val;
        }
        if (mode) {
            console.log(codeMirrorValue, mode, spec);
            if(Array.isArray(spec)) {
                codeMirrorValue.setOption("mode", spec[0]);
            }
            else {
                codeMirrorValue.setOption("mode", spec);
            }
            CodeMirror.autoLoadMode(codeMirrorValue, mode);
        }
        else {
            console.log("Could not find a mode corresponding to " + val);
        }
    }
    render() {
        let optionsDropdown = [
            {
                text: 'Javascript',
                value: 'javascript'
            }, {
                text: 'PHP',
                value: 'php'
            }
        ]
        return (
            <div>
                <CodeMirror
                    ref="CodeMirror"
                    autoFocus={true}
                    value={this.state.code}
                    onChange={this.updateCode}
                    options={this.options}/>
                <Menu attached={'bottom'}>
                    <Menu.Menu position='right'>
                        <Dropdown
                            placeholder='Select language'
                            defaultValue={"javascript"}
                            upward
                            className='link item'
                            options={optionsDropdown}
                            onChange={this.handleChangeDropdown}/>
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default CodemirrorEditor;