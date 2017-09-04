import redis from 'redis';
import url from 'url';
import Queue from './queue.js';
import { setWorkerFrequency } from './job-runner.js'
import crypto from 'crypto';

/**
 * jobId is generated based on the current epoch time and a random number for extra uniqueness
 */
const getJobId = () => {
  let current_date = (new Date()).valueOf().toString();
  let random = Math.random().toString();
  let jobId = crypto.createHash('sha256').update(current_date + random).digest('hex');
  return jobId;
}

const redisClient = redis.createClient();
const jobQueue = new Queue('jobs', redisClient);

/**
 * createJob calls getJobId.
 * After jobId is generated, it's enqueued and is added to Redis instance with 
 * key is the id and value is the url.
 * The response object is sent back to user along with status update
 */
export const createJob = (req, res) => {  
  const jobId = getJobId();
  const formattedUrl = url.parse(req.body.url).protocol ? reqUrl : `http://${req.body.url}`

  jobQueue.push(jobId);
  redisClient.set(`jobId-${jobId}`, formattedUrl);

  res.send(JSON.stringify({
    jobId: jobId,
    url: formattedUrl,
    html: '',
    completed: false
  }));
}

/**
 * Collect id from user as an argument, and perform check against the DB
 * Response is a boolean indicating whether the job exists
 */
export const getJobStatus = (req, res) => {
  const id = req.params.id;
  redisClient.get(`jobId-${id}`, (err, reqUrl) => {
    if (err) {
      res.status(400);
    } else {
      redisClient.exists(reqUrl, (error, result) => {
        res.send(!!result);
      });
    };
  })
}

/**
 * Collect id from user as an argument, and perform check against the DB
 * Response is the collected html if worker ran
 */
export const goToSite = (req, res) => {
  const id = req.params.id;
  redisClient.get(`jobId-${id}`, (err, reqUrl) => {
    if (err) {
      res.status(400);
    } else {
      redisClient.get(reqUrl, (error, html) => {
        if (error) {
          res.status(400);
        } else {
          res.send(html);
        }
      })
    };
  })
}

/**
 * handle requests to change frequency of worker in miliseconds
 */
export const changeWorkerFrequency = (req, res) => {
  if (req.body.freq) {
    setWorkerFrequency(req.body.freq);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
}