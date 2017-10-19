import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Router, Route} from 'react-router-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'react-redux';

import Header from './Header';

const history = createBrowserHistory();
// const store = createStore();

function checkAuth(nextState, replaceState) {
    let {loggedIn} = store.getState();

    if (nextState.location.pathname === '/signin' || nextState.location.pathname === '/signup') {
        if (!loggedIn) {
            if (nextState.location.state && nextState.location.pathname) {
                replaceState(null, nextState.location.pathname);
            } else {
                replaceState(null, '/');
            }
        }
    } else {
        // If the user is already logged in, forward them to the homepage
        if (loggedIn) {
            if (nextState.location.state && nextState.location.pathname) {
                replaceState(null, nextState.location.pathname);
            } else {
                replaceState(null, '/');
            }
        }
    }
}

export default class App extends React.Component {
    render() {
        return (
            <Provider >
                <Router history={history}>
                    <Route component={Header}>
                        <Route path="/" component={HomePage}/>
                        <Route onEnter={checkAuth}>
                            <Route path="/login" component={LoginPage}/>
                            <Route path="/register" component={RegisterPage}/>
                            <Route path="/dashboard" component={Dashboard}/>
                        </Route>
                        <Route path="*" component={NotFound}/>
                    </Route>
                </Router>
            </Provider>
        );
    }
}
