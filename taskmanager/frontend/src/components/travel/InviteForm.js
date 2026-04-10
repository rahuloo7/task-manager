import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { sendInvite } from "../../actions/travel";

class InviteForm extends Component {
    static propTypes = {
        challengeId: PropTypes.number.isRequired,
        sendInvite: PropTypes.func.isRequired,
        onClose: PropTypes.func,
    };

    state = {
        inviteeUsername: "",
        message: "",
        submitting: false,
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { inviteeUsername } = this.state;
        if (!inviteeUsername.trim()) return;

        this.setState({ submitting: true, message: "" });
        this.props.sendInvite(this.props.challengeId, inviteeUsername).then((res) => {
            if (res.success) {
                this.setState({ inviteeUsername: "", message: "Challenge sent!", submitting: false });
                if (this.props.onClose) setTimeout(this.props.onClose, 1500);
            } else {
                this.setState({ message: "Failed to send. Check the username.", submitting: false });
            }
        });
    };

    render() {
        const { inviteeUsername, message, submitting } = this.state;
        return (
            <form onSubmit={this.onSubmit} className="p-3 bg-light rounded">
                <p className="mb-2 font-weight-bold">Challenge a friend:</p>
                <div className="input-group input-group-sm mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter friend's username"
                        value={inviteeUsername}
                        onChange={(e) => this.setState({ inviteeUsername: e.target.value })}
                        required
                    />
                    <div className="input-group-append">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Sending..." : "Send Challenge"}
                        </button>
                    </div>
                </div>
                {message && (
                    <small className={message.includes("sent") ? "text-success" : "text-danger"}>
                        {message}
                    </small>
                )}
            </form>
        );
    }
}

export default connect(null, { sendInvite })(InviteForm);
