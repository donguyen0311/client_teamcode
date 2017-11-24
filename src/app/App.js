import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {composeWithDevTools} from 'redux-devtools-extension';
import axios from 'axios';

// import auth from '../utils/auth';

import Home from './Home';
import SideBar from './Sidebar';

import Dashboard from '../dashboard/Dashboard';
import Project from '../project/Project';
import Editor from '../editor/Editor';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Estimate from '../estimate/Estimate';
import CostDriver from '../estimate/CostDriver';
import ScaleFactor from '../estimate/ScaleFactor';
import FunctionPoint from '../estimate/FunctionPoint';

import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

const Projects = (props) => {
    return (
        <Project {...props} />
    )
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        let {loggedIn} = store.getState().authReducer;
        let {location, history} = props;
        console.log(props);
        axios
            .get(`/api/checkCompany/${props.match.params.company}`)
            .then(response => {
                if(!response.data.success) {
                    history.push('/');
                }
            }).catch(error => {
                console.log(error);
            });
        return (
            loggedIn ? (
                <div>
                    <Component {...props}/>
                    <Route path={`${props.match.url}/dashboard`} component={Dashboard} />
                    <Route path={`${props.match.url}/project/:project`} component={Projects} />
                </div>
            ) : (
                <Route component={Login} />
            )
        )}
    }/>
  )

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Provider store={store}>
                    <div>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/signup" component={Register}/>
                            {/* <Route component={CheckAuth}/> */}
                            <PrivateRoute path="/:company" component={SideBar} />
                            <Route path="/estimate" component={Estimate}/>
                            <Route path="/costdriver" component={CostDriver}/>
                            <Route path="/scalefactor" component={ScaleFactor}/>
                            <Route path="/fp" component={FunctionPoint}/>
                        </Switch>
                    </div>
                </Provider>
            </BrowserRouter>
        );
    }
}

