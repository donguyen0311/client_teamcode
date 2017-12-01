import { UPDATE_PROFILE, UPDATE_LOADING } from './UserConstants';
import user from '../utils/user';
import auth from '../utils/auth';

export function getUserInfo() {
    return (dispatch) => {
        dispatch(setLoading(true));
        user.getUserInfo().then(response => {
            dispatch(setLoading(false));
            if(response.success) {
                dispatch(updateUserInfo(response.user));
                return response;
            }
            else {
                auth.logout();
            }
        });
    }
}

export function setLoading(loading) {
    return {type: UPDATE_LOADING, loading};
}

export function updateUserInfo(newState) {
    return {type: UPDATE_PROFILE, newState};
}