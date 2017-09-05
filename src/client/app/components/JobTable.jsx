import React, { PropTypes } from 'react';
import JobEntry from './JobEntry.jsx';
import { Table } from 'react-bootstrap';
/**
 * JobTable Component renders a table that serves as a skeleton for JobEntry
 */
const JobTable = ({ jobs, updateStatus }) => (
  <Table striped bordered condensed hover>
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
  </Table>
); 

JobTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  updateStatus: PropTypes.func.isRequired
}

export default JobTable;

