import React from 'react';
import {render} from 'react-dom';
import { getJobStatus, addJobToQueue } from './api/helpers.js';
import JobTable from './components/JobTable.jsx';
import { Form, FormControl, Button, Tooltip, Thumbnail, Label, Panel, Popover} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      message: '',
      jobs: []
    };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

 /**
 * handdleUrlChange() captures url input from user and let user know if the url isn't valid
 * if URL is valid, state is set
 */
  handleUrlChange(e) {
    let message;
    if (!this.isValidUrl(e.target.value)) {
      message = 'Please enter a valid URL';
    } else {
      message = '';
    }
    this.setState({ 
      url: e.target.value,
      message: message 
    });

  }

 /**
 * handleSubmit() enqueues the input URL after user clicks on Submit
 * It also performed a final validity check on the URL before enqueueing it.
 */
  handleSubmit(e) {
    e.preventDefault();
    if (this.isValidUrl(this.state.url)) {
      addJobToQueue({ url: this.state.url }, job => { this.setState({ 
          jobs: this.state.jobs.concat([job]),
          message: `Your Job ID is ${job.jobId}, save it to check on the status`
        })
      })
    } else {
      this.setState({ message: 'Invalid URL - cannot add to queue' });
    }
  }

 /**
 * updateStatus() is passed down via JobTable down to JobEntry to collect user's interaction, 
 * It will call getJobStatus, which checks the DB, return with the newest information about the job
 * It will then update the state and inform user.
 */
  updateStatus(job) {
    getJobStatus(job.jobId, status => {
      let newState = this.state.jobs;
      let newMessage;

      if (status) {
        for (var i in newState) {
          if (newState[i].jobId == job.jobId) {
            newState[i].html = job.html;
            newState[i].completed = true;
            break;
          }
        }
        newMessage = `Job ID ${job.jobId} has been processed.` + ` Click to go to site`;
      } else {
        newMessage = `Job ID ${job.jobId} has not yet been processed.
         Come back in a little while to get a fresh copy.
         Or try "curl localhost:8000/jobs/${job.jobId}" to check on its status!`
      }
      this.setState({ 
        jobs: newState,
        message: newMessage
      });
    });
  }

 /**
 * regex function to check the validity of an input url 
 * source: https://gist.github.com/imme-emosol/731338/810d83626a6d79f40a251f250ed4625cac0e731f
 */
  isValidUrl(url) {    
    const rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

    return url.match(rValidUrl);
  }

  render() {
    return (
      <section className="container">
        <Thumbnail responsive rounded alt="171x180" src="/assets/thumbnail.png" /> 
        <div id="content">
          <Form horizontal inline id="user-form">
            <Popover id="popover-basic"
              placement="right"
              positionLeft={300}
              positionTop={50}
              title="Enter an URL here" >
              Or try <strong> curl localhost:8000/jobs/jobID</strong> to check on its status!
          </Popover>
            <Form className="url-entry-form" onSubmit={this.handleSubmit} >
              <FormControl
                type="text"
                name="url"
                onChange={this.handleUrlChange}
                placeholder="www.google.com"></FormControl>
              <Button type="submit" value="Submit" bsStyle="primary"> Submit </Button>
            </Form>
            <Panel header='Status Update' bsStyle="info"> {this.state.message} </Panel>
          </Form>
          <JobTable jobs={this.state.jobs} updateStatus={this.updateStatus} />
        </div>
      </section>
    )
  }
}

render(<App/>, document.getElementById('app'));

