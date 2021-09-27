import { AUTH_ERROR, USER_LOADING, USER_LOADED, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGIN_FAILED, REGISTER_FAILED, REGISTER_SUCCESS } from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
};

export default function(state=initialState, action) {
    switch(action.type){
        case USER_LOADED:
           return {
            ...state,
            isAuthenticated: true
           }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,

            }
        case AUTH_ERROR:
        case LOGIN_FAILED:
        case LOGOUT_SUCCESS:
        case REGISTER_FAILED:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        default:
            return state;
    }
}
