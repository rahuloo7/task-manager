import axios from "axios";
import { GET_TASKS, DELETE_TASK, ADD_TASK, GET_ERRORS } from "./types";
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