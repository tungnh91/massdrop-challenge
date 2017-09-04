import React, { PropTypes } from 'react';
import JobEntry from './JobEntry.jsx';

const JobTable = ({ jobs, updateStatus }) => (
  <table className="table-jobs">
    <thead>
    <tr>
      <th className="row-id">Job Id</th>
      <th className="row-url">Url</th>
      <th className="row-action">Action</th>
    </tr>
    </thead>

    <tbody>
    {
      jobs.map(job => <JobEntry key={job.jobId} job={job} updateStatus={updateStatus} />)
    }
    </tbody>
  </table>
); 

JobTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  updateStatus: PropTypes.func.isRequired
}

export default JobTable;

