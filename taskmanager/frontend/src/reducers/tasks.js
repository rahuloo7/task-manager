import {
    DELETE_TASK, GET_TASKS, ADD_TASK,
    GEMMA_SUGGEST_REQUEST, GEMMA_SUGGEST_SUCCESS, GEMMA_SUGGEST_FAILURE
} from '../actions/types';

const initialState = {
    tasks: [],
    gemmaSuggestions: [],
    gemmaLoading: false,
    gemmaError: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_TASKS:
            return { ...state, tasks: action.payload };
        case DELETE_TASK:
            return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
        case ADD_TASK:
            return { ...state, tasks: [...state.tasks, action.payload] };
        case GEMMA_SUGGEST_REQUEST:
            return { ...state, gemmaLoading: true, gemmaError: null, gemmaSuggestions: [] };
        case GEMMA_SUGGEST_SUCCESS:
            return { ...state, gemmaLoading: false, gemmaSuggestions: action.payload };
        case GEMMA_SUGGEST_FAILURE:
            return { ...state, gemmaLoading: false, gemmaError: action.payload };
        default:
            return state;
    }
}
