import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';


class Login extends Component {
    state = {
        username: '',
        password: ''
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })
    render() {
        const { username, password } = this.state;
        if (this.props.isAuthenticated) {
            return <Redirect to='/' />;
        }
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                className="form-control"
                                type="text" 
                                name="username"
                                onChange={this.onChange}
                                value={username}>
                            </input>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                className="form-control"
                                type="password" 
                                name="password"
                                onChange={this.onChange}
                                value={password}>
                            </input>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <p>
                            Don't have an account? <Link to='/register'>Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);