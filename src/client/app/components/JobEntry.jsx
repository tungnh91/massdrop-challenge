import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

/**
 * JobEntry Component render rows of the JobTable
 * Rendering jobID, URL and the actions that are available to user.
 */
class JobEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const job = this.props.job;
    return (
      <tr>
        <td>{job.jobId}</td>
        <td>{job.url}</td>
        <td>
          <Button
            bsStyle= {job.completed ? 'success' : 'info'} bsSize='xsmall'
            onClick={this.props.updateStatus.bind(null, this.props.job)} 
            href={job.completed ? `/redirect/${job.jobId}` : '#'}
          >
            {job.completed ? 'Go To Site' : 'Check Status' }
          </Button>
        </td>
      </tr>
    )
  }
}

JobEntry.propTypes = {
  job: PropTypes.object.isRequired,
  updateStatus: PropTypes.func.isRequired
}

export default JobEntry;