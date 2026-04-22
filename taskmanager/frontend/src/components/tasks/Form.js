import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addTask, getGemmaSuggestions } from '../../actions/tasks';

export class Form extends Component {
    state = {
        name: ''
    }

    static propTypes = {
        addTask: PropTypes.func.isRequired,
        getGemmaSuggestions: PropTypes.func.isRequired,
        suggestions: PropTypes.array,
        suggesting: PropTypes.bool,
        suggestError: PropTypes.string
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        const { name } = this.state;
        const task = { name };
        this.props.addTask(task);
        this.setState({ name: '' });
    }

    onSuggest = () => {
        const { name } = this.state;
        this.props.getGemmaSuggestions(name || 'general tasks');
    }

    onPickSuggestion = (suggestion) => {
        this.setState({ name: suggestion });
    }

    render() {
        const { name } = this.state;
        const { suggestions, suggesting, suggestError } = this.props;

        return (
            <div className="card card-body mt-4 mb-4 col-md-6 col-xs-12">
                <h2>Add Task</h2>
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
                    <div className="form-group d-flex" style={{ gap: '8px' }}>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={this.onSuggest}
                            disabled={suggesting}>
                            {suggesting ? 'Thinking…' : '✨ Suggest with Gemma'}
                        </button>
                    </div>
                </form>

                {suggestError && (
                    <div className="alert alert-danger mt-2" role="alert">
                        {suggestError}
                    </div>
                )}

                {suggestions && suggestions.length > 0 && (
                    <div className="mt-2">
                        <p className="mb-1"><strong>Gemma suggestions</strong> — click one to use it:</p>
                        <ul className="list-group">
                            {suggestions.map((s, i) => (
                                <li
                                    key={i}
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => this.onPickSuggestion(s)}>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    suggestions: state.tasks.gemmaSuggestions,
    suggesting: state.tasks.gemmaLoading,
    suggestError: state.tasks.gemmaError
});

export default connect(mapStateToProps, { addTask, getGemmaSuggestions })(Form);
