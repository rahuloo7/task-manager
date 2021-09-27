import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";


export class Alerts extends Component {

    static propType = {
        error: PropTypes.object.isRequired
    }
    componentDidUpdate(prevProps) {
        console.log(prevProps);
        const {error, alert} = this.props;
        ocons
        if (error != prevProps.error) {
            console.log('ia m eroorooinf...');
            if (error.msg.name) alert.error('Name is required!');
        }

    }

    render(){
        return <Fragment />;
    }
}

const mapStateToProps = state => ({
    errors: state.errors
});
export default connect(mapStateToProps)(withAlert(Alerts));