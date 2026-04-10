import {
    GET_CHALLENGES, ADD_CHALLENGE, DELETE_CHALLENGE, COMPLETE_CHALLENGE,
    GET_INVITE_FEED, SEND_INVITE, RESPOND_INVITE
} from '../actions/types';

const initialState = {
    challenges: [],
    feed: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_CHALLENGES:
            return { ...state, challenges: action.payload };

        case ADD_CHALLENGE:
            return { ...state, challenges: [action.payload, ...state.challenges] };

        case DELETE_CHALLENGE:
            return { ...state, challenges: state.challenges.filter(c => c.id !== action.payload) };

        case COMPLETE_CHALLENGE:
            return {
                ...state,
                challenges: state.challenges.map(c =>
                    c.id === action.payload.id ? action.payload : c
                )
            };

        case GET_INVITE_FEED:
            return { ...state, feed: action.payload };

        case SEND_INVITE:
            return { ...state, feed: [action.payload, ...state.feed] };

        case RESPOND_INVITE:
            return {
                ...state,
                feed: state.feed.map(inv =>
                    inv.id === action.payload.id ? action.payload : inv
                )
            };

        default:
            return state;
    }
}
