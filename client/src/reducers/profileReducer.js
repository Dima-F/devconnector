import { GET_PROFILE, GET_PROFILES, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';
// import isEmpty from '../validation/is-empty';

const initialState = {
    profile: null,
    profiles: null,
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type){
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null
            };
        case GET_PROFILE:
            return {
                ...state,
                loading: false,
                profile: action.payload
            };
        case GET_PROFILES:
            return {
                ...state,
                loading: false,
                profiles: action.payload
            };
        default:
            return state;
    }
}
