import redis from 'redis';
import request from 'request';
import Queue from './queue.js';

/**
 * runWorker looks at the queue and process item in a FIFO fashion
 * it fetches html from source, and replace value with the html that it got back
 * if fetch fail, a <p> tag is generated to let user know.
 */
export const runWorker = () => {
  const redisClient = redis.createClient();
  const jobQueue = new Queue('jobs', redisClient);

  jobQueue.pop(async (err, job) => {
    if (err) throw new Error(err);
    const jobId = await job[1];
    
    redisClient.get(`jobId-${jobId}`, (err, url) => {
      const options = {
        url: url,
        timeout: 3000,
      };

      request.get(options, (error, response, data) => {
        let content;
        if (!error && response.statusCode == 200) {
          console.log(`html request for ${url} successful`);
          content = data;
        } else {
          content = '<p>Failed to retrieve HTML for the requested site. Please go back and check the URL<p>';
        }

        redisClient.set(url, content);
      });
    });
  });
};

/**
 * clear out existing interval and set a new one for worker
 */
export const setWorkerFrequency = (freq) => {
  console.log(`Setting worker frequency to ${freq} ms`);

  if (workerInterval) clearInterval(workerInterval);
  const workerInterval = setInterval(runWorker, freq);
}