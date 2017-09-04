import redis from 'redis';
import request from 'request';
import Queue from './queue.js';

export const runWorker = () => {
  const client = redis.createClient();
  const jobQueue = new Queue('jobs', client);

  jobQueue.pop(async (err, job) => {
    if (err) throw new Error(err);

    const jobId = await job[1];

    client.get(`jobId-${jobId}`, (err, url) => {
      const options = {
        url: url,
        timeout: 3000,
      };

      request.get(options, (error, response, data) => {
        let html;
        if (!error && response.statusCode == 200) {
          console.log(`html request for ${url} successful`);
          html = data;
        } else {
          html = '<p>Failed to retrieve HTML for the requested site. Please go back and check the URL<p>';
        }

        client.set(url, html);
      });
    });
  });
};

export const setWorkerFrequency = (freq) => {
  console.log(`Setting worker frequency to ${freq} ms`);

  if (workerInterval) clearInterval(workerInterval);
  const workerInterval = setInterval(runWorker, freq);
}