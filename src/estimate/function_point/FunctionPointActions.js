import { 
	CHANGE_VISIBLE_STATE,
	CHANGE_VALUE_STATE,
	CHANGE_FP_TABLE_ARRAY
} from './FunctionPointConstants'

export function changeVisibleState(newState) {
    return {type: CHANGE_VISIBLE_STATE, newState};
}

export function changeValueState(newState) {
    return {type: CHANGE_VALUE_STATE, newState};
}

export function changeFPTableArray(newState){
	return {type: CHANGE_FP_TABLE_ARRAY, newState};	
}