import React from 'react';
import {connect} from 'react-redux';
import {Segment, Menu, Dropdown, Icon, Grid} from 'semantic-ui-react';
import CodeMirror from 'react-codemirror';
import LiveCode from './LiveCode';
import {changeTaskEditorCode, changeTaskEditorMode} from './EditorActions';
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

let optionsDropdown = [
    {
        text: 'C',
        value: 'text/x-csrc'
    }, {
        text: 'C++',
        value: 'text/x-c++src'
    }, {
        text: 'C#',
        value: 'text/x-csharp'
    },  {
        text: 'CSS',
        value: 'text/css'
    }, {
        text: 'CoffeeScript',
        value: 'text/x-coffeescript'
    }, {
        text: 'Dockerfile',
        value: 'text/x-dockerfile'
    }, {
        text: 'HTML',
        value: 'htmlmixed'
    }, {
        text: 'Java',
        value: 'text/x-java'
    }, {
        text: 'Javascript',
        value: 'text/javascript'
    }, {
        text: 'Javascript(JSX)',
        value: 'text/typescript-jsx'
    }, {
        text: 'PHP',
        value: 'php'
    }, {
        text: 'Python',
        value: 'text/x-python'
    }, {
        text: 'Perl',
        value: 'text/x-perl'
    }, {
        text: 'Ruby',
        value: 'text/x-ruby'
    }, {
        text: 'SCSS',
        value: 'text/x-scss'
    }, {
        text: 'SASS',
        value: 'text/x-sass'
    }
];

let mapLanguage = {
    html: 'htmlmixed',
    css: 'text/css',
    js: 'text/javascript'
};

class CodemirrorEditor extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     code: this.props.code,
        //     mode: this.props.mode
        // };
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
                "Ctrl-Space": "autocomplete",
                "Ctrl-F": "findPersistent"
            }
        };
        this.updateCode = this
            .updateCode
            .bind(this);
        this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
        this.handleChangeModeCodemirror = this.handleChangeModeCodemirror.bind(this);
    }
    updateCode(newCode) {
        //this.setState({code: newCode});
        this.props.changeTaskEditorCode(this.props.taskID, newCode, this.props.modeInit);
        // this.props.receiveCode(newCode, this.props.mode);
    }
    componentDidMount() {
        console.log(this.props.modeInit);
        let code = this.props.data[this.props.taskID][this.props.modeInit].code ? this.props.data[this.props.taskID][this.props.modeInit].code : '';
        let mode = this.props.data[this.props.taskID][this.props.modeInit].mode ? this.props.data[this.props.taskID][this.props.modeInit].mode : mapLanguage[this.props.modeInit];
        this.props.changeTaskEditorCode(this.props.taskID, code, this.props.modeInit);
        let codemirror = this.refs.CodeMirror.getCodeMirror();
        let codeMirrorInstance = this.refs.CodeMirror.getCodeMirrorInstance();
        this.handleChangeModeCodemirror(mode, codemirror, codeMirrorInstance);
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
            let info = CodeMirror.findModeByExtension(m[1]);
            if (info) {
                mode = info.mode;
                spec = info.mime;
            }
        } else if (/\//.test(val)) {
            let info = CodeMirror.findModeByMIME(val);
            if (info) {
                mode = info.mode;
                spec = val;
            }
        } else {
            mode = spec = val;
        }
        if (mode) {
            // console.log(codeMirrorValue, mode, spec);
            //this.setState({ mode: mode });
            this.props.changeTaskEditorMode(this.props.taskID, spec, this.props.modeInit);
            // this.props.receiveMode(spec, this.props.mode);

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
        return (
            <div>
                <CodeMirror
                    className='codemirror'
                    ref="CodeMirror"
                    autoFocus={true}
                    value={this.props.data[this.props.taskID][this.props.modeInit].code ? this.props.data[this.props.taskID][this.props.modeInit].code : ''}
                    onChange={this.updateCode}
                    options={this.options}/>
                <Menu attached={'bottom'}>
                    <Menu.Menu position='right'>
                        <Dropdown
                            placeholder='Select language'
                            defaultValue={this.props.data[this.props.taskID][this.props.modeInit].mode ? this.props.data[this.props.taskID][this.props.modeInit].mode : mapLanguage[this.props.modeInit]}
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

const mapStateToProps = (state) => {
    return {data: state.editorReducer};
}

const mapDispatchToProps = {
    changeTaskEditorCode, 
    changeTaskEditorMode
};

export default connect(mapStateToProps, mapDispatchToProps)(CodemirrorEditor);