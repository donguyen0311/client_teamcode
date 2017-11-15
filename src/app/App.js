import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {composeWithDevTools} from 'redux-devtools-extension';
// import axios from 'axios';

// import auth from '../utils/auth';

import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import Editor from '../editor/Editor';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Estimate from '../auth/Estimate';
import CostDriver from '../auth/CostDriver';
import ScaleFactor from '../auth/ScaleFactor';
import FunctionPoint from '../auth/FunctionPoint';

import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

// function checkAuth(nextState, replaceState) {     // let {loggedIn} =
// store.getState();     console.log(nextState, replaceState);     let loggedIn
// = auth.loggedIn();     axios         .get('/api/authenticate', { headers: {
//           'x-access-token': localStorage.token         }     })
// .then(response => {             if (response.data.success) {       if
// (nextState.location.pathname === '/signin' || nextState.location.pathname ===
// '/signup') {                     if (!loggedIn) {                         if
// (nextState.location.state && nextState.location.pathname) {
//           replaceState(null, nextState.location.pathname);
//      } else {              replaceState(null, '/');                         }
//       }                 } else {                     // If the user is
// already logged in, forward them to the homepage                     if
// (loggedIn) {                         if (nextState.location.state &&
// nextState.location.pathname) {                             replaceState(null,
// nextState.location.pathname);                         } else {
// replaceState(null, '/');                         }       }                 }
//            } else { replaceState(null, '/');             }         })
// .catch(error => {           console.log(error);         }); }

// const PrivateRoute = ({
//     component: Component,
//     ...rest
// }) => (
//     <Route
//         {...rest}
//         render={(props) => (auth.loggedIn()
//         ? (<Component {...props}/>)
//         : (<Redirect
//             to={{
//             pathname: '/signin',
//             state: {
//                 from: props.location
//             }
//         }}/>))}/>
// );

const Home = ({match}) => match && <h1>Home Page</h1>

class CheckAuth extends React.Component {
    Authenication() {
        let {loggedIn} = store.getState().authReducer;
        let {location, history} = this.props;
        console.log(location, history)
        if (location.pathname === '/signin' || location.pathname === '/signup') {
            if (loggedIn) {
                history.push('/');
            }
        } else {
            // If the user is already logged in, forward them to the homepage
            if (!loggedIn) {
                history.push('/');
            }
        }
    }
    render() {
        this.Authenication();
        return (
            <div>
                <Route path="/signin" component={Login}/>
                <Route path="/signup" component={Register}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/editor" component={Editor}/>
            </div>
        )
    }
}

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Provider store={store}>
                    <div>
                        <Route component={Header}/>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/estimate" component={Estimate}/>
                            <Route exact path="/costdriver" component={CostDriver}/>
                            <Route exact path="/scalefactor" component={ScaleFactor}/>
                            <Route exact path="/fp" component={FunctionPoint}/>
                            <Route component={CheckAuth}/>
                        </Switch>
                    </div>
                </Provider>
            </BrowserRouter>
        );
    }
}

