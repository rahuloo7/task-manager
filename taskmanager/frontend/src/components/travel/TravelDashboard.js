import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getChallenges, getInviteFeed } from "../../actions/travel";
import ChallengeForm from "./ChallengeForm";
import ChallengeCard from "./ChallengeCard";
import PendingInvites from "./PendingInvites";
import SentChallenges from "./SentChallenges";

class TravelDashboard extends Component {
    static propTypes = {
        challenges: PropTypes.array.isRequired,
        getChallenges: PropTypes.func.isRequired,
        getInviteFeed: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getChallenges();
        this.props.getInviteFeed();
    }

    render() {
        const { challenges } = this.props;
        const active = challenges.filter((c) => c.status === "active");
        const completed = challenges.filter((c) => c.status === "completed");

        return (
            <div className="mt-4">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="display-4">Travel Challenges</h1>
                    <p className="lead text-muted">
                        Set a destination, reach it, snap a photo, and dare your friends to do the same.
                    </p>
                </div>

                <div className="row">
                    {/* LEFT: Create + Active + Completed */}
                    <div className="col-md-7">
                        <ChallengeForm />

                        {active.length > 0 && (
                            <>
                                <h5 className="mb-3">
                                    Your Active Challenges
                                    <span className="badge badge-primary ml-2">{active.length}</span>
                                </h5>
                                {active.map((c) => (
                                    <ChallengeCard key={c.id} challenge={c} />
                                ))}
                            </>
                        )}

                        {completed.length > 0 && (
                            <>
                                <h5 className="mb-3 mt-4">
                                    Completed
                                    <span className="badge badge-success ml-2">{completed.length}</span>
                                </h5>
                                {completed.map((c) => (
                                    <ChallengeCard key={c.id} challenge={c} />
                                ))}
                            </>
                        )}

                        {challenges.length === 0 && (
                            <div className="text-center py-5 text-muted">
                                <h4>No challenges yet!</h4>
                                <p>Create one above and start your travel journey.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Incoming invites + Sent challenges */}
                    <div className="col-md-5">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-warning text-dark">
                                <h5 className="mb-0">Friend Activity</h5>
                            </div>
                            <div className="card-body">
                                <PendingInvites />
                                <SentChallenges />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    challenges: state.travel.challenges,
});

export default connect(mapStateToProps, { getChallenges, getInviteFeed })(TravelDashboard);
