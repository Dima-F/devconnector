import { ADD_POST } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
    posts:[],
    post: {},
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };
        default:
            return state;

    }

}
