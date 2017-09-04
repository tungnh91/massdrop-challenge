import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createJob, getJobStatus, goToSite, changeWorkerFrequency} from './utils/api-helpers.js';

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.render('index.html')
});

app.get('/jobs/:id', getJobStatus);
app.get('/redirect/:id', goToSite);
app.get('/*', (req, res) => {
  res.redirect('/');
})

app.post('/jobs', createJob);
app.post('/worker', changeWorkerFrequency);
app.listen(3000, () => {
  console.log('listening on port 3000');
});
