import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {composeWithDevTools} from 'redux-devtools-extension';
import axios from 'axios';

// import auth from '../utils/auth';

import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import Project from '../project/Project';
import Editor from '../editor/Editor';
import Login from '../auth/Login';
import Register from '../auth/Register';

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

// class CheckAuth extends React.Component {
//     Authenication() {
//         let {loggedIn} = store.getState().authReducer;
//         let {location, history} = this.props;
//         console.log(location, history)
//         if (location.pathname === '/signup') {
//             if (loggedIn) {
//                 history.push('/');
//             }
//         } else {
//             // If the user is already logged in, forward them to the homepage
//             if (!loggedIn) {
//                 history.push('/');
//             }
//         }
//     }
//     render() {
//         this.Authenication();
//         return (
//             <div>   
//                 <Route path="/:company" component={Dashboard} />
//                 <Route path="/:company/dashboard" component={Dashboard}/>
//                 <Route path="/:company/editor" component={Editor}/>        
//             </div>
//         )
//     }
// }

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
                    <Route path={`${props.match.url}/:project`} component={Projects} />
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
                        <Route component={Header}/>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/signup" component={Register}/>
                            {/* <Route component={CheckAuth}/> */}
                            <PrivateRoute path="/:company" component={Dashboard} />
                        </Switch>
                    </div>
                </Provider>
            </BrowserRouter>
        );
    }
}
