import React from 'react';
import { connect } from 'react-redux';
import { createServer } from './reducers/server';

import './CreateServer.scss';

export class CreateServer extends React.Component {
  state = {
    name: '',
    url: '',
    apiKey: '',
  };

  render() {
    const submit = e => {
      e.preventDefault();
      this.props.createServer(this.state);
    };
    const renderInput = (id, placeholder, type = 'text') =>
      <input
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={this.state[id]}
        onChange={e => this.setState({ [id]: e.target.value })}
      />;

    return (
      <div className="create-server">
        <form onSubmit={submit}>
          <div className="form-group row">
            <label htmlFor="name" className="col-lg-1 col-md-2 col-form-label create-server__label">Name:</label>
            <div className="col-lg-11 col-md-10">
              {renderInput('name', 'Name')}
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="url" className="col-lg-1 col-md-2 col-form-label create-server__label">URL:</label>
            <div className="col-lg-11 col-md-10">
              {renderInput('url', 'URL', 'url')}
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="apiKey" className="col-lg-1 col-md-2 col-form-label create-server__label">API key:</label>
            <div className="col-lg-11 col-md-10">
              {renderInput('apiKey', 'API key')}
            </div>
          </div>

          <div className="text-right">
            <button className="btn btn-primary btn-outline-primary">Create server</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { createServer })(CreateServer);
