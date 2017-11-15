import React from 'react';
import {Grid, Tab} from 'semantic-ui-react';
import SideBar from '../app/Sidebar';
import SplitterLayout from 'react-splitter-layout';
import SplitPane from 'react-split-pane';
import {ReflexContainer, ReflexSplitter, ReflexElement} from 'react-reflex';
import CodeMirrorEditor from './CodemirrorEditor';
require('react-reflex/styles.css');

const io = require('socket.io-client');  
const socket = io();

class Editor extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const panes = [
            {menuItem: 'Tab 1', render: () => <Tab.Pane style={{padding: 0}} key={1}><CodeMirrorEditor/></Tab.Pane>},
            {menuItem: 'Tab 2', render: () => <Tab.Pane style={{padding: 0}} key={2}><CodeMirrorEditor /></Tab.Pane>},
        ];
        return (
            <SideBar>
                {/* <Grid>
                    <Grid.Column width={3}>adadsad</Grid.Column>
                    <Grid.Column >

                        <CodeMirror
                            autoFocus={true}
                            value={this.state.code}
                            onChange={this.updateCode}
                            options={this.options}/>
                    </Grid.Column>

                </Grid> */}
                <div>adadaoidjaoid</div>
                <Tab menu={{ secondary: true, pointing: true }} panes={panes}/> 
            </SideBar>
        );
    }
}

export default Editor;
                        /* <ReflexContainer orientation="vertical">
                            <ReflexElement className="left-pane" minSize="200">
                                <div className="pane-content">
                                    <h1>Editor!</h1>
                                </div>
                            </ReflexElement>

                            <ReflexSplitter
                                propagate={true}
                                style={{
                                height: '100vh'
                            }}/>

                            <ReflexElement className="right-pane">
                                <div className="pane-content" minSize="1000">
                                    <CodeMirror
                                        autoFocus={true}
                                        value={this.state.code}
                                        onChange={this.updateCode}
                                        options={this.options}/>
                                </div>
                            </ReflexElement>
                        </ReflexContainer> */