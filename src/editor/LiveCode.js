import React from 'react';
// import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Menu} from 'semantic-ui-react';
import {changeTaskEditorCode, changeTaskEditorMode} from './EditorActions';
var Babel = require('babel-standalone');
// var uniter = require('uniter');

class LiveCode extends React.Component { 
    constructor(props) {
        super(props);
        // this.compileCode = this.compileCode.bind(this);
        // this.executeCode = this.executeCode.bind(this);
        this.updatePreview = this.updatePreview.bind(this);
        this.saveCode = this.saveCode.bind(this);
        this.compileCodeJSX = this.compileCodeJSX.bind(this);
        // this.compileCodePHP = this.compileCodePHP.bind(this);
    }

    // componentDidMount() {
    //     this.updatePreview(this.props.codehtml, this.props.codecss, this.props.codejs);
    // }

    // componentDidUpdate(prevProps) {
    //     let codeHTML = prevProps.codehtml;
    //     let codeCSS = prevProps.codecss; 
    //     let codeJS = prevProps.codejs;
    //     if (this.props.codehtml !== prevProps.codehtml) {
    //         codeHTML = this.props.codehtml;
    //     }
    //     if (this.props.codecss !== prevProps.codecss) {
    //         codeCSS = this.props.codecss;
    //     }
    //     if (this.props.codejs !== prevProps.codejs) {
    //         codeJS = this.props.codejs;
    //     }
    //     this.updatePreview(codeHTML, codeCSS, codeJS);
    // }

    compileCodeJSX(codeJSX) {
        var code = Babel.transform(codeJSX, {
            minified: true,
            presets: [require('babel-preset-es2015'), require('babel-preset-react')]
        }).code;
        return code;
    }

    updatePreview() {
        var previewFrame = this.refs.iframe;
        let codeCSS = this.props.data[this.props.taskID].css.code;
        let codeHTML = this.props.data[this.props.taskID].html.code;
        let codeJS = this.props.data[this.props.taskID].js.code;
        var preview =  previewFrame.contentDocument || previewFrame.contentWindow.document;
        preview.open();
        preview.write(`<style>${codeCSS}</style>${codeHTML}<script>${codeJS}</script>`);
        preview.close();
    }

    saveCode() {
        console.log(this.props.data[this.props.taskID]);
    }

    // compileCodePHP(codePHP) {
    //     var updatePreview = this.updatePreview;
    //     var code = '';
    //     try {    
    //         var phpEngine = uniter.createEngine('PHP');

    //         phpEngine.getStdout().on('data', function (data) {
    //             console.log(data);
    //             code += data;
    //             updatePreview(code);
    //         });
            
    //         phpEngine.getStderr().on('data', function (err) {
    //             updatePreview(err);
    //         });

    //         phpEngine.execute(codePHP);
    //     } catch (e) {
    //         updatePreview(e.toString());
    //     }
    // }

    // executeCode() {
    //     var mountNode = this.refs.mount;
    //     try {
    //         ReactDOM.unmountComponentAtNode(mountNode);
    //     } catch (e) {}

    //     try {
    //         var compiledCode = this.compileCode();
    //         ReactDOM.render(eval(compiledCode), mountNode);
    //     } catch (err) {
    //         setTimeout(function () {
    //             ReactDOM.render(
    //                 <div className="playgroundError">{err.toString()}</div>, mountNode);
    //         }, 500);
    //     }
    // }

    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Menu attached={'top'}>
                    <Menu.Menu position='left'>
                        <Menu.Item name='save' onClick={this.saveCode}>
                            Save
                        </Menu.Item>
                        <Menu.Item name='run' onClick={this.updatePreview}>
                            Run
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <iframe style={{width: '100%', height: 'calc(100% - 42px)', border: '1px solid #d4d4d5', overflow: 'auto'}} ref="iframe"></iframe>
                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {data: state.editorReducer};
}


export default connect(mapStateToProps)(LiveCode);