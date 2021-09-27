import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";

class Header extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <span className="navbar-text mr-3">
                    <strong>
                        { user ? `Welcome ${user.username}`: '' }
                    </strong>
                </span>
                <li className="nav-item">
                    <button onClick={this.props.logout} className="nav-link btn btn-danger btn-sm text-light">Logout</button>
                </li>
            </ul>
        );

        const guestLinks= (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
            </ul>
        );
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Task Manager</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    </div>
                    { isAuthenticated ? authLinks: guestLinks }
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, {logout})(Header);