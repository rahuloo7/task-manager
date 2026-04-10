import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SentChallenges extends Component {
    static propTypes = {
        feed: PropTypes.array.isRequired,
        currentUser: PropTypes.object,
    };

    statusBadge(status) {
        const map = {
            pending: "warning",
            accepted: "info",
            completed: "success",
            declined: "danger",
        };
        return map[status] || "secondary";
    }

    render() {
        const { feed, currentUser } = this.props;
        if (!currentUser) return null;

        const sent = feed.filter((inv) => inv.inviter.id === currentUser.id);
        if (sent.length === 0) return null;

        return (
            <div className="mb-4">
                <h5 className="mb-3">Challenges You Sent</h5>
                {sent.map((inv) => (
                    <div key={inv.id} className="card mb-2 shadow-sm">
                        <div className="card-body py-2 px-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <span className="font-weight-bold">{inv.challenge.title}</span>
                                    <span className="text-muted small"> — challenged </span>
                                    <span className="font-weight-bold">{inv.invitee.username}</span>
                                    <p className="text-muted small mb-0">{inv.challenge.location_description}</p>
                                </div>
                                <div>
                                    <span className={`badge badge-${this.statusBadge(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                    {inv.status === "completed" && inv.proof_photo && (
                                        <div className="mt-1">
                                            <img
                                                src={inv.proof_photo}
                                                alt="Proof"
                                                className="img-thumbnail"
                                                style={{ maxHeight: "80px" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feed: state.travel.feed,
    currentUser: state.auth.user,
});

export default connect(mapStateToProps)(SentChallenges);
