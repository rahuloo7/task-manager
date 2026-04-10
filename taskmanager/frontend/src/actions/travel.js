import axios from "axios";
import {
    GET_CHALLENGES, ADD_CHALLENGE, DELETE_CHALLENGE, COMPLETE_CHALLENGE,
    GET_INVITE_FEED, SEND_INVITE, RESPOND_INVITE, GET_ERRORS
} from "./types";
import { tokenConfig } from "./auth";

// GET user's own challenges
export const getChallenges = () => (dispatch, getState) => {
    axios.get('/api/travel/challenges/', tokenConfig(getState))
        .then(res => {
            dispatch({ type: GET_CHALLENGES, payload: res.data });
        })
        .catch(err => console.log(err));
};

// CREATE a new challenge
export const addChallenge = (data) => (dispatch, getState) => {
    return axios.post('/api/travel/challenges/', data, tokenConfig(getState))
        .then(res => {
            dispatch({ type: ADD_CHALLENGE, payload: res.data });
            return { success: true };
        })
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: { msg: err.response.data, status: err.response.status } });
            return { success: false };
        });
};

// DELETE a challenge
export const deleteChallenge = (id) => (dispatch, getState) => {
    axios.delete(`/api/travel/challenges/${id}/`, tokenConfig(getState))
        .then(() => {
            dispatch({ type: DELETE_CHALLENGE, payload: id });
        })
        .catch(err => console.log(err));
};

// COMPLETE a challenge with photo proof
export const completeChallenge = (id, formData) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    // Let browser set multipart boundary automatically
    delete config.headers['Content-Type'];

    return axios.patch(`/api/travel/challenges/${id}/complete/`, formData, config)
        .then(res => {
            dispatch({ type: COMPLETE_CHALLENGE, payload: res.data });
            return { success: true };
        })
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: { msg: err.response.data, status: err.response.status } });
            return { success: false };
        });
};

// GET invite feed (sent + received)
export const getInviteFeed = () => (dispatch, getState) => {
    axios.get('/api/travel/invites/feed/', tokenConfig(getState))
        .then(res => {
            dispatch({ type: GET_INVITE_FEED, payload: res.data });
        })
        .catch(err => console.log(err));
};

// SEND an invite to a friend
export const sendInvite = (challengeId, inviteeUsername) => (dispatch, getState) => {
    const body = { challenge_id: challengeId, invitee_username: inviteeUsername };
    return axios.post('/api/travel/invites/', body, tokenConfig(getState))
        .then(res => {
            dispatch({ type: SEND_INVITE, payload: res.data });
            return { success: true };
        })
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: { msg: err.response.data, status: err.response.status } });
            return { success: false };
        });
};

// RESPOND to an invite (accept / decline / complete with photo)
export const respondToInvite = (id, status, formData) => (dispatch, getState) => {
    let data, config;

    if (formData) {
        config = tokenConfig(getState);
        delete config.headers['Content-Type'];
        data = formData;
    } else {
        config = tokenConfig(getState);
        data = { status };
    }

    return axios.patch(`/api/travel/invites/${id}/respond/`, data, config)
        .then(res => {
            dispatch({ type: RESPOND_INVITE, payload: res.data });
            return { success: true };
        })
        .catch(err => {
            dispatch({ type: GET_ERRORS, payload: { msg: err.response.data, status: err.response.status } });
            return { success: false };
        });
};
