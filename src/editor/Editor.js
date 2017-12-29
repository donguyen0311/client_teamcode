import React from 'react';
import {Grid, Tab} from 'semantic-ui-react';
import CodeMirrorEditor from './CodemirrorEditor';
import LiveCode from './LiveCode';
import {connect} from 'react-redux';
import {initTaskEditorCode} from './EditorActions';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     modehtml: 'htmlmixed',
        //     modecss: 'text/css',
        //     modejs: 'text/javascript',
        //     codehtml: '',
        //     codecss: '',
        //     codejs: ''
        // }
        // this.receiveMode = this.receiveMode.bind(this);
        // this.receiveCode = this.receiveCode.bind(this);
        this.props.initTaskEditorCode(this.props.taskID);
    }

    // receiveMode(mode, prevMode) {
    //     var key = '';
    //     if (prevMode === this.state.modehtml) {
    //         key = 'modehtml';
    //     } else if (prevMode === this.state.modecss) {
    //         key = 'modecss';
    //     } else if (prevMode === this.state.modejs) {
    //         key = 'modejs';
    //     }
    //     this.setState({
    //         [key]: mode
    //     });
    // }

    // receiveCode(code, mode) {
    //     var key = '';
    //     if (mode === this.state.modehtml) {
    //         key = 'codehtml';
    //     } else if (mode === this.state.modecss) {
    //         key = 'codecss';
    //     } else if (mode === this.state.modejs) {
    //         key = 'codejs';
    //     }
    //     this.setState({
    //         [key]: code
    //     });
    // }

    // runCode() {

    // }

    render() {
        const panes = [
            {menuItem: 'HTML', render: () => <Tab.Pane style={{padding: 0}} key={1}><CodeMirrorEditor taskID={this.props.taskID} modeInit={'html'} /></Tab.Pane>},
            {menuItem: 'CSS', render: () => <Tab.Pane style={{padding: 0}} key={2}><CodeMirrorEditor taskID={this.props.taskID} modeInit={'css'} /></Tab.Pane>},
            {menuItem: 'JS', render: () => <Tab.Pane style={{padding: 0}} key={3}><CodeMirrorEditor taskID={this.props.taskID} modeInit={'js'} /></Tab.Pane>},
        ];
        return (
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column>
                        <Tab panes={panes} />
                    </Grid.Column>
                    <Grid.Column>
                        <LiveCode
                            taskID={this.props.taskID}
                            // modehtml={this.state.modehtml} 
                            // modecss={this.state.modecss}
                            // modejs={this.state.modejs}
                            // codehtml={this.state.codehtml}
                            // codecss={this.state.codecss}
                            // codejs={this.state.codejs}  
                        />
                    </Grid.Column>
                </Grid.Row>  
            </Grid>
        );
    }
}

const mapDispatchToProps = {
    initTaskEditorCode
};

export default connect(null, mapDispatchToProps)(Editor);