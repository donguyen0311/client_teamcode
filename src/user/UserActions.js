import { UPDATE_PROFILE, UPDATE_LOADING } from './UserConstants';
import user from '../utils/user';

export function getUserInfo() {
    return (dispatch) => {
        dispatch(setLoading(true));
        user.getUserInfo().then(response => {
            dispatch(setLoading(false));
            if(response.success) {
                dispatch(updateUserInfo(response.user));
            }
            return response;
        });
    }
}

export function setLoading(loading) {
    return {type: UPDATE_LOADING, loading};
}

export function updateUserInfo(newState) {
    return {type: UPDATE_PROFILE, newState};
}