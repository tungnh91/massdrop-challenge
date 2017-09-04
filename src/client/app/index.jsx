import React from 'react';
import {render} from 'react-dom';
import { getJobStatus, addJobToQueue } from './api/helpers.js';
import JobTable from './components/JobTable.jsx';

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

  handleSubmit(e) {
    e.preventDefault();
    if (this.isValidUrl(this.state.url)) {
      addJobToQueue({ url: this.state.url }, job => { this.setState({ 
          jobs: this.state.jobs.concat([job]),
          message: `JOB-ID ${job.jobId} was added to queue`
        })
      })
    } else {
      this.setState({ message: 'Invalid URL - cannot add to queue' });
    }
  }

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
        newMessage = `JOB-ID ${job.jobId} has been processed`;
      } else {
        newMessage = `JOB-ID ${job.jobId} has not yet been processed`
      }
      this.setState({ 
        jobs: newState,
        message: newMessage
      });
    });
  }

  isValidUrl(url) {    
    const rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

    return url.match(rValidUrl);
  }

  render() {
    return (
      <section className="container">
        <h1>Coding Challenge: HTML Fetcher</h1>
        <div id="content">
          <div id="user-form">
            <label htmlFor="url">Enter a URL here:</label>
            <form className="url-entry-form" onSubmit={this.handleSubmit} >
              <input
                type="text"
                name="url"
                onChange={this.handleUrlChange}
                placeholder="i.e. www.google.com"></input>
              <input type="submit" value="Submit" />
            </form>
            <h5 id="status-message">{this.state.message}</h5>
          </div>
          <JobTable jobs={this.state.jobs} updateStatus={this.updateStatus} />
        </div>
      </section>
    )
  }
}

render(<App/>, document.getElementById('app'));

