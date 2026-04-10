import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { respondToInvite } from "../../actions/travel";

class PendingInvites extends Component {
    static propTypes = {
        feed: PropTypes.array.isRequired,
        currentUser: PropTypes.object,
        respondToInvite: PropTypes.func.isRequired,
    };

    state = {
        completing: null,  // invite id being completed
        photoFile: null,
        submitting: false,
    };

    onRespond = (inviteId, status) => {
        this.props.respondToInvite(inviteId, status);
    };

    onCompleteClick = (inviteId) => {
        this.setState({ completing: inviteId, photoFile: null });
    };

    onFileChange = (e) => {
        this.setState({ photoFile: e.target.files[0] });
    };

    onCompleteSubmit = (e, inviteId) => {
        e.preventDefault();
        const { photoFile } = this.state;
        if (!photoFile) return;

        const formData = new FormData();
        formData.append("proof_photo", photoFile);
        formData.append("status", "completed");

        this.setState({ submitting: true });
        this.props.respondToInvite(inviteId, "completed", formData).then(() => {
            this.setState({ completing: null, photoFile: null, submitting: false });
        });
    };

    render() {
        const { feed, currentUser } = this.props;
        const { completing, submitting } = this.state;

        if (!currentUser) return null;

        const received = feed.filter(
            (inv) => inv.invitee.id === currentUser.id && inv.status === "pending"
        );

        const accepted = feed.filter(
            (inv) => inv.invitee.id === currentUser.id && inv.status === "accepted"
        );

        if (received.length === 0 && accepted.length === 0) return null;

        return (
            <div className="mb-4">
                {received.length > 0 && (
                    <>
                        <h5 className="text-warning mb-3">
                            Pending Invites
                            <span className="badge badge-warning ml-2">{received.length}</span>
                        </h5>
                        {received.map((inv) => (
                            <div key={inv.id} className="card mb-2 border-warning shadow-sm">
                                <div className="card-body py-2 px-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{inv.inviter.username}</strong> challenged you:{" "}
                                            <span className="text-primary">{inv.challenge.title}</span>
                                            <p className="text-muted small mb-0">{inv.challenge.location_description}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-sm btn-success mr-1"
                                                onClick={() => this.onRespond(inv.id, "accepted")}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => this.onRespond(inv.id, "declined")}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {accepted.length > 0 && (
                    <>
                        <h5 className="text-success mb-3 mt-3">
                            Accepted Challenges — Ready to Complete
                        </h5>
                        {accepted.map((inv) => (
                            <div key={inv.id} className="card mb-2 border-success shadow-sm">
                                <div className="card-body py-2 px-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-primary font-weight-bold">{inv.challenge.title}</span>
                                            <p className="text-muted small mb-0">from {inv.inviter.username}</p>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => this.onCompleteClick(inv.id)}
                                        >
                                            {completing === inv.id ? "Cancel" : "Upload Proof"}
                                        </button>
                                    </div>
                                    {completing === inv.id && (
                                        <form
                                            onSubmit={(e) => this.onCompleteSubmit(e, inv.id)}
                                            className="mt-2"
                                        >
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
                                                {submitting ? "Uploading..." : "Complete Challenge"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feed: state.travel.feed,
    currentUser: state.auth.user,
});

export default connect(mapStateToProps, { respondToInvite })(PendingInvites);
