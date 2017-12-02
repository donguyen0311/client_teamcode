import {
	CHANGE_USERS_NEW_PROJECT_FORM,
	CHANGE_ID_NEW_PROJECT_FORM,
	CHANGE_PROJECT_SAVED
} from './ProjectConstants'

const initialState = {
	projectSaved:{

	}
	// _id :{
 //    	'project_id': 0,
 //    },
 //    users: {
 //    	'users': []	
 //    }
    // 'budget': 0,
    // 'deadline': new Date(),
    // 'description': '',
    // 'language_programming': [],
    // 'belong_company' : 0,
    // 'created_by' : 0,
    
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_USERS_NEW_PROJECT_FORM:
            return {
                ...state,
                users: action.newState
            };
        case CHANGE_ID_NEW_PROJECT_FORM:
            return {
                ...state,
                _id: action.newState
            };
        case CHANGE_PROJECT_SAVED:
            return {
                ...state,
                projectSaved: action.newState
            };
        default:
            return state;
    }
}

