import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createJob, getJobStatus, goToSite, changeWorkerFrequency} from './utils/api-helpers.js';
import { setWorkerFrequency } from './utils/job-runner.js';

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname + '/../client')));

/**
 * Routes options
 * Root dir is default to index.html
 */
app.get('/', (req, res) => {
  res.render('index.html')
});
app.get('/jobs/:id', getJobStatus);
app.get('/redirect/:id', goToSite);
app.get('/*', (req, res) => {
  res.redirect('/');
})
/**
 * POST request handlers
 * Go to function definition (./utils/api-helpers.js) for usage
 */
app.post('/jobs', createJob);
app.post('/worker', changeWorkerFrequency);
app.listen(8000, () => {
  console.log('listening on port 8000');
});

/**
 * Worker will wake up every 10 seconds by default.
 */
setWorkerFrequency(10000);