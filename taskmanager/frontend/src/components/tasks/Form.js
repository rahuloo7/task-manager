import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';  

import { addTask } from '../../actions/tasks';

export class Form extends Component {
    state = {
        name: ''
    }
    static propTypes = {
        addTask: PropTypes.func.isRequired
    }
    onChange = e => this.setState({ [e.target.name]: e.target.value });
    onSubmit = e => {
        e.preventDefault();
        const {name} = this.state;
        const task = { name };
        this.props.addTask(task);
        console.log(this.state)
        this.setState({ name: '' });
    }

    render() {
        const { name } = this.state;
        return (
            <div className="card card-body mt-4 mb-4 col-md-6 col-xs-12">
                <h2> Add Task</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            id="taskName"
                            className="form-control"
                            type="text" 
                            name="name"
                            onChange={this.onChange}
                            value={name}>
                        </input>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                        Submit
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(null, {addTask})(Form);
