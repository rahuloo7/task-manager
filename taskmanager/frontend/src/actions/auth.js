import axios from "axios";
import { compose } from "redux";
import { LOGIN_SUCCESS, USER_LOADED, USER_LOADING, LOGIN_FAILED, LOGOUT_SUCCESS, REGISTER_SUCCESS } from "./types";


export const loadUser = () =>  (dispatch, getState) => {
    dispatch({ type: USER_LOADING});

    axios.get('/api/auth/user', tokenConfig(getState))
    .then( res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch( err => console.log('err'));
} 


export const login = (username, password) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ username, password });

  axios
    .post('/api/auth/login', body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const register = ({username, email, password}) => (dispatch) => {
    // Headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // Request Body
    const body = JSON.stringify({ username, email, password });
  
    axios
      .post('/api/auth/register', body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };

  
export const logout = () =>  (dispatch, getState) => {


    axios.post('/api/auth/logout/', null, tokenConfig(getState))
    .then( res => {
        dispatch({
            type: LOGOUT_SUCCESS
        });
    }).catch( err => console.log('err'));
} 


export const tokenConfig = getState => {
    const token = getState().auth.token;
    console.log(token)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    
    return config;
}