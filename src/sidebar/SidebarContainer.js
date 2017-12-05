import React from 'react';
import { Route } from 'react-router-dom';
import { Sidebar, Dimmer } from 'semantic-ui-react';
import Dashboard from '../dashboard/Dashboard';
import Project from '../project/Project';
import NavBar from '../app/Header';
import Estimate from '../estimate/Estimate';
import Profile from '../user/UserProfile';
import user from '../utils/user';
import SideBar from './Sidebar';
import BlockPage from './BlockPage';

class SideBarContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Sidebar.Pushable>
                <SideBar {...this.props} />
                <Sidebar.Pusher>
                    <NavBar {...this.props} />
                    <div>
                        <BlockPage />
                        <Route path={`${this.props.match.url}/dashboard`} component={Dashboard} />
                        <Route path={`${this.props.match.url}/project/:project`} component={Project} />
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

export default SideBarContainer;