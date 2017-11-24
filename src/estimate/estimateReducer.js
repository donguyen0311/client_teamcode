import {
	CHANGE_EAF,
	CHANGE_SCALE_FACTORS,
	CHANGE_FUNCTION_POINT,
	CHANGE_KLOC
} from './estimateConstants'

const initialState = {
	KLOC: 3,
	EAF: {

	},
	SCALE_FACTORS:{

	},
	FUNCTION_POINT:{

	}
};

export function estimateReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_EAF:
            return {
                ...state,
                EAF: action.newState
            };
        case CHANGE_SCALE_FACTORS:
            return {
                ...state,
                SCALE_FACTORS: action.newState
            };
        case CHANGE_FUNCTION_POINT:
            return {
                ...state,
                FUNCTION_POINT: action.newState
            };
        case CHANGE_KLOC:
            return {
                ...state,
                KLOC: action.newState
            };
        default:
            return state;
    }
}

