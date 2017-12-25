import {
	CHANGE_EAF,
	CHANGE_SCALE_FACTORS,
	CHANGE_FUNCTION_POINT,
	CHANGE_KLOC,
    CHANGE_ESTIMATED_RESULT,
    CHANGE_BRUTEFORCE_STAFFS,
    CHANGE_STAFF_REQUIREMENTS,
    RESET_ESTIMATED_RESULT
} from './estimateConstants'

const initialState = {
	KLOC: 0,
	EAF: {

	},
	SCALE_FACTORS:{

	},
	FUNCTION_POINT:{

	},
    staffRequirements:{

    },
    estimatedResult:{
        months: 0,
        cost: 0,
        persons: 0,
        suitableStaffs: [],
        original:{
            PMs: 0,
            TDEV: 0,
            PM: 0,
            effortPM:0
        },
        ceil:{
            PMs: 0,
            TDEV: 0,
            PM: 0,
            effortPM:0
        },
        // projectCostPerMonth: 0,
        totalProjectCost: 0,
        totalTimeTeamAfforable: 0

    },
    bruteforceStaffs:[]
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
        case CHANGE_ESTIMATED_RESULT:
            return {
                ...state,
                estimatedResult: action.newState
            };
        case CHANGE_BRUTEFORCE_STAFFS:
            return {
                ...state,
                bruteforceStaffs: action.newState
            };
        case CHANGE_STAFF_REQUIREMENTS:
            return {
                ...state,
                staffRequirements: action.newState
            };
        case RESET_ESTIMATED_RESULT:
            return {
                ...initialState
            };
        default:
            return state;
    }
}

