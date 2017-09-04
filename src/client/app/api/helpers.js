/**
 * getJobStatus() make a GET request to end point '/jobs'
 * And call the call back on resolved return promise
 */
export const getJobStatus = (id, cb) => {
  fetch(`/jobs/${id}`, { credentials: 'same-origin' })
  .then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(status => {
    console.log(`JOB_ID-${id} is ${status ? 'ready' : 'not ready'}`);
    if (cb) cb(status)
  })
};

/**
 * addJobToQueue() make a POST request to end point '/jobs'
 * And call the call back on resolved return promise
 */
export const addJobToQueue = (data, cb) => {
  fetch('/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(data => {
    console.log(`URL queued at JOB_ID-${data.jobId}`);
    if (cb) cb(data);
  })
};
