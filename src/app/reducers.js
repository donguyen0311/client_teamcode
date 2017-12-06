import { combineReducers } from 'redux';
import { authReducer } from '../auth/authReducer';
import { sidebarReducer } from '../sidebar/SidebarReducer';
import { userReducer } from '../user/userReducer';
import { socketReducer } from '../app/socket';
import { estimateReducer } from '../estimate/estimateReducer';
import { projectReducer } from '../project/projectReducer';

export default combineReducers({
    authReducer,
    userReducer,
    estimateReducer,
    projectReducer,
    sidebarReducer,
    socketReducer
});