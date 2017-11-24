import { combineReducers } from 'redux';
import { authReducer } from '../auth/authReducer';
import { userReducer } from '../user/userReducer';
import { estimateReducer } from '../estimate/estimateReducer';

export default combineReducers({
    authReducer,
    userReducer,
    estimateReducer
});