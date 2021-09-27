import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTasks, deleteTask } from '../../actions/tasks';
import tasks from '../../reducers/tasks';

export class Tasks extends Component {
    static propTypes = {
        tasks: PropTypes.array.isRequired,
        getTasks: PropTypes.func.isRequired,
        deleteTask: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getTasks();
    }

    render() {
        return (
            <Fragment>
                <h2>Tasks</h2>
                <table className="table table-striped col-md-6 col-xs-12">
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.tasks.map( task => (
                            <tr key={task.id}>
                                <td>{task.name} <button onClick={this.props.deleteTask.bind(this, task.id) } className="btn btn-danger btn-sm float-right"> Delete </button></td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    tasks: state.tasks.tasks
});

export default connect(mapStateToProps, { getTasks, deleteTask })(Tasks);
