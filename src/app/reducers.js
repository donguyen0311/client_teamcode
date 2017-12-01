import { combineReducers } from 'redux';
import { authReducer } from '../auth/authReducer';
import { sidebarReducer } from '../sidebar/SidebarReducer';
import { userReducer } from '../user/userReducer';
import { socketReducer } from '../app/socket';
import { estimateReducer } from '../estimate/estimateReducer';

export default combineReducers({
    authReducer,
    userReducer,
    sidebarReducer,
    socketReducer,
    estimateReducer
});