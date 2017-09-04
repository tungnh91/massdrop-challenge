import React, { PropTypes } from 'react';

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
          <a
            onClick={this.props.updateStatus.bind(null, this.props.job)} 
            href={job.completed ? `/redirect/${job.jobId}` : '#'}
          >
            {job.completed ? 'Go To Site' : 'Check Status' }
          </a>
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