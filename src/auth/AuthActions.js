import {
    FIELD_MISSING,
    WRONG_EMAIL_OR_PASSWORD,
    EMAIL_TAKEN,
    GENERAL_ERROR,
    CHANGE_LOGIN_FORM,
    CHANGE_REGISTER_FORM,
    SET_AUTH,
    SENDING_REQUEST,
    SET_ERROR_MESSAGE
} from './AuthConstants';
import auth from '../utils/auth';

export function login(email, password) {
    return (dispatch) => {
        dispatch(setErrorMessage(''));
        dispatch(sendingRequest(true));
        if (anyElementsEmpty(email, password)) {
            dispatch(sendingRequest(false));
            return;
        }
        return auth.login(email, password).then(response => {
            dispatch(sendingRequest(false));
            if (response.success) {
                dispatch(setAuthState(true));
                dispatch(changeLoginForm({
                    email: "",
                    password: ""
                }));
            }
            else {
                dispatch(setErrorMessage(response.message));
            }
            return response;
        });     
    }
}

export function register(email, username, password, confirm_password) {
    return (dispatch) => {
        dispatch(setErrorMessage(''));
        dispatch(sendingRequest(true));
        if (anyElementsEmpty(email, username, password, confirm_password)) {
            dispatch(sendingRequest(false));
            return;
        }
        return auth.register(email, username, password, confirm_password).then(response => {
            dispatch(sendingRequest(false));
            if(response.success) {
                dispatch(setAuthState(true));
                dispatch(changeRegisterForm({
                    email: "",
                    username: "",
                    password: "",
                    confirm_password: ""
                }));
            }
            else {
                dispatch(setErrorMessage(response.message));
            }
            return response;
        });
    }
}

export function logout() {
    return (dispatch) => {
        auth.logout();
        dispatch(setAuthState(false));
    }
}

export function changeLoginForm(newState) {
    return {type: CHANGE_LOGIN_FORM, newState};
}

export function changeRegisterForm(newState) {
    return {type: CHANGE_REGISTER_FORM, newState};
}

export function sendingRequest(sending) {
    return {type: SENDING_REQUEST, sending};
}

export function setAuthState(newState) {
    return {type: SET_AUTH, newState};
}

export function setErrorMessage(message) {
    return {type: SET_ERROR_MESSAGE, message};
}

function anyElementsEmpty(elements) {
    for (let element in elements) {
        if (!elements[element]) {
            return true;
        }
    }
    return false;
}