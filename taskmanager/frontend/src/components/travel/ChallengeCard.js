import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteChallenge, completeChallenge } from "../../actions/travel";
import InviteForm from "./InviteForm";

class ChallengeCard extends Component {
    static propTypes = {
        challenge: PropTypes.object.isRequired,
        deleteChallenge: PropTypes.func.isRequired,
        completeChallenge: PropTypes.func.isRequired,
    };

    state = {
        showCompleteForm: false,
        showInviteForm: false,
        photoFile: null,
        submitting: false,
    };

    onFileChange = (e) => {
        this.setState({ photoFile: e.target.files[0] });
    };

    onCompleteSubmit = (e) => {
        e.preventDefault();
        const { photoFile } = this.state;
        if (!photoFile) return;

        const formData = new FormData();
        formData.append("proof_photo", photoFile);

        this.setState({ submitting: true });
        this.props.completeChallenge(this.props.challenge.id, formData).then((res) => {
            this.setState({ submitting: false, showCompleteForm: false, photoFile: null });
        });
    };

    render() {
        const { challenge } = this.props;
        const { showCompleteForm, showInviteForm, submitting } = this.state;
        const isCompleted = challenge.status === "completed";

        return (
            <div className={`card mb-3 shadow-sm ${isCompleted ? "border-success" : "border-primary"}`}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 className="card-title mb-1">{challenge.title}</h5>
                            <p className="text-muted small mb-1">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {challenge.location_description}
                            </p>
                            <span className={`badge badge-${isCompleted ? "success" : "primary"}`}>
                                {isCompleted ? "Completed" : "Active"}
                            </span>
                            {challenge.invite_count > 0 && (
                                <span className="badge badge-info ml-2">
                                    {challenge.invite_count} friend{challenge.invite_count !== 1 ? "s" : ""} challenged
                                </span>
                            )}
                        </div>
                        <div>
                            {!isCompleted && (
                                <button
                                    className="btn btn-sm btn-outline-success mr-1"
                                    onClick={() => this.setState({ showCompleteForm: !showCompleteForm, showInviteForm: false })}
                                >
                                    {showCompleteForm ? "Cancel" : "Complete"}
                                </button>
                            )}
                            {!isCompleted && (
                                <button
                                    className="btn btn-sm btn-outline-primary mr-1"
                                    onClick={() => this.setState({ showInviteForm: !showInviteForm, showCompleteForm: false })}
                                >
                                    {showInviteForm ? "Cancel" : "Challenge Friend"}
                                </button>
                            )}
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => this.props.deleteChallenge(challenge.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {isCompleted && challenge.proof_photo && (
                        <div className="mt-3">
                            <p className="mb-1 font-weight-bold small">Proof photo:</p>
                            <img
                                src={challenge.proof_photo}
                                alt="Proof"
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                            />
                            <p className="text-muted small mt-1">
                                Completed: {new Date(challenge.completed_at).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {showCompleteForm && (
                        <form onSubmit={this.onCompleteSubmit} className="mt-3 p-3 bg-light rounded">
                            <p className="mb-2 font-weight-bold">Upload proof photo to complete this challenge:</p>
                            <div className="form-group mb-2">
                                <input
                                    type="file"
                                    className="form-control-file"
                                    accept="image/*"
                                    onChange={this.onFileChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-success btn-sm"
                                disabled={submitting || !this.state.photoFile}
                            >
                                {submitting ? "Uploading..." : "Mark as Completed"}
                            </button>
                        </form>
                    )}

                    {showInviteForm && (
                        <div className="mt-3">
                            <InviteForm
                                challengeId={challenge.id}
                                onClose={() => this.setState({ showInviteForm: false })}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(null, { deleteChallenge, completeChallenge })(ChallengeCard);
