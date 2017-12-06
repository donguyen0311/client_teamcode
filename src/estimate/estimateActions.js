import {
    CHANGE_EAF,
    CHANGE_SCALE_FACTORS,
    CHANGE_FUNCTION_POINT,
    CHANGE_KLOC,
    CHANGE_ESTIMATED_RESULT
} from './estimateConstants'

import estimate from '../utils/estimate'

export function changeEAF(newState) {
    return {type: CHANGE_EAF, newState};
}

export function changeScaleFactors(newState) {
    return {type: CHANGE_SCALE_FACTORS, newState};
}

export function changeFunctionPoint(newState) {
    return {type: CHANGE_FUNCTION_POINT, newState};
}

export function changeKLOC(newState) {
    return {type: CHANGE_KLOC, newState};
}

export function changeEstimatedResult(newState) {
    return {type: CHANGE_ESTIMATED_RESULT, newState};
}

export function changeSuitableStaffs(newState) {
    return {type: CHANGE_ESTIMATED_RESULT, newState};
}

export function getSuitableStaffs(requirement) {
    return (dispatch) => {
    	//co anh huong dispacth gi k ko
        // dispatch(setErrorMessage(''));
        // dispatch(sendingRequest(true));
        return estimate.getSuitableStaff(requirement).then(response => {
        	//nó khong có response luôn chứ ko phải là 
            // dispatch(sendingRequest(false));
            if (response.success) {
                // dispatch(setAuthState(true));
                // dispatch(changeLoginForm({
                //     email: "",
                //     password: ""
                // }));
                return response.suitableStaff
            }
            else {
                // dispatch(setErrorMessage(response.message));
            }
            return response;
        });     
    }
}
// export function caculateEAF(EAF) {
//     return {type: CACULATE_EAF, EAF};
// }