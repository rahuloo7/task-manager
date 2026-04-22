import axios from "axios";
import {
    GET_TASKS, DELETE_TASK, ADD_TASK, GET_ERRORS,
    GEMMA_SUGGEST_REQUEST, GEMMA_SUGGEST_SUCCESS, GEMMA_SUGGEST_FAILURE
} from "./types";
import { tokenConfig } from "./auth";

// GET TASKS
export const getTasks = () => (dispatch, getState) => {
    axios.get('/api/tasks', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_TASKS,
            payload: res.data
        });
    })
    .catch(err => console.log(err));
}

export const deleteTask = (id) => (dispatch, getState )=> {
    axios.delete(`/api/tasks/${id}/`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: DELETE_TASK,
            payload: id
        });
    })
    .catch(err => console.log(err));
}

export const getGemmaSuggestions = (context) => (dispatch, getState) => {
    dispatch({ type: GEMMA_SUGGEST_REQUEST });
    axios.post('/api/gemma/suggest/', { context }, tokenConfig(getState))
        .then(res => {
            dispatch({ type: GEMMA_SUGGEST_SUCCESS, payload: res.data.suggestions });
        })
        .catch(err => {
            dispatch({ type: GEMMA_SUGGEST_FAILURE, payload: err.response?.data?.error || 'Failed to get suggestions' });
        });
};

export const addTask = (task) => (dispatch, getState) => {
    axios.post('/api/tasks/', task, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: ADD_TASK,
            payload: res.data
        });
    })
    .catch(err => {
        const errors = {
            msg: err.response.data,
            status: err.response.data
        };
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
    });
}