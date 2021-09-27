import React, { Component } from "react";
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route {...rest}
        render={ (props) => {
            console.log('props.....');
            if(auth.isLoading) {
                return <h2>Loading...</h2>;
            } else if(!auth.isAuthenticated) {
                return <Redirect to="/login" />;
            } else {
                return <Component {...props} />;
            }
        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);