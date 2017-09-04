import redis from 'redis';
import url from 'url';
import Queue from './queue.js';
import { setWorkerFrequency } from './job-runner.js'

let jobId = 0;
const client = redis.createClient();
const jobQueue = new Queue('jobs', client);

export const createJob = (req, res) => {  
  const formattedUrl = url.parse(req.body.url).protocol ? reqUrl : `http://${req.body.url}`

  jobQueue.push(jobId);
  client.set(`jobId-${jobId}`, formattedUrl);

  res.send(JSON.stringify({
    jobId: jobId++,
    url: formattedUrl,
    html: '',
    completed: false
  }));
}

export const getJobStatus = (req, res) => {
  const id = req.params.id;

  client.get(`jobId-${id}`, (err, reqUrl) => {
    if (err) {
      res.status(400);
    } else {
      client.exists(reqUrl, (error, reply) => {
        res.send(!!reply);
      });
    };
  })
}

export const goToSite = (req, res) => {
  const id = req.params.id;

  client.get(`jobId-${id}`, (err, reqUrl) => {
    if (err) {
      res.status(400);
    } else {
      client.get(reqUrl, (error, html) => {
        if (error) {
          res.status(400);
        } else {
          res.send(html);
        }
      })
    };
  })
}

export const changeWorkerFrequency = (req, res) => {
  if (req.body.freq) {
    setWorkerFrequency(req.body.freq);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
}