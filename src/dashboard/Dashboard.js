import React from 'react';
import SideBar from '../app/Sidebar';
import Project from '../project/Project';
import { Grid, Container } from 'semantic-ui-react';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    } 

    componentWillMount() {
        
    }  

    render() {
        return (
            <SideBar>
                <Project />
            </SideBar>        
        );
    }
}