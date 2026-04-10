import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addChallenge } from "../../actions/travel";

class ChallengeForm extends Component {
    static propTypes = {
        addChallenge: PropTypes.func.isRequired,
    };

    state = {
        title: "",
        location_description: "",
        submitting: false,
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { title, location_description } = this.state;
        if (!title.trim() || !location_description.trim()) return;

        this.setState({ submitting: true });
        this.props.addChallenge({ title, location_description }).then((res) => {
            if (res.success) {
                this.setState({ title: "", location_description: "", submitting: false });
            } else {
                this.setState({ submitting: false });
            }
        });
    };

    render() {
        const { title, location_description, submitting } = this.state;
        return (
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Create a New Travel Challenge</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Challenge Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Summit Mt. Fuji at sunrise"
                                value={title}
                                onChange={(e) => this.setState({ title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Location / Description</label>
                            <textarea
                                className="form-control"
                                placeholder="Describe where and what the challenge involves..."
                                rows="3"
                                value={location_description}
                                onChange={(e) => this.setState({ location_description: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Creating..." : "Create Challenge"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { addChallenge })(ChallengeForm);
