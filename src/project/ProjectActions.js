import { 
CHANGE_USERS_NEW_PROJECT_FORM,
CHANGE_ID_NEW_PROJECT_FORM,
CHANGE_PROJECT_SAVED

} from './ProjectConstants'

export function changeUserNewProjectForm(newState) {
    return {type: CHANGE_USERS_NEW_PROJECT_FORM, newState};
}

export function changeIdNewProjectForm(newState) {
    return {type: CHANGE_ID_NEW_PROJECT_FORM, newState};
}

export function changeProjectSaved(newState) {
    return {type: CHANGE_PROJECT_SAVED, newState};
}