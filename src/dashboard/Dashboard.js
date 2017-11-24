import React from 'react';
import SideBar from '../app/Sidebar';
import { Grid, Container } from 'semantic-ui-react';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    } 

    componentWillMount() {
        
    }  

    render() {
        return (
            <SideBar {...this.props}>
                {/* <Project /> */}
            </SideBar>        
        );
    }
}