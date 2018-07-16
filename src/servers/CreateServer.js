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
    const renderInputGroup = (id, placeholder, type = 'text') =>
      <div className="form-group row">
        <label htmlFor={id} className="col-lg-1 col-md-2 col-form-label create-server__label">{placeholder}:</label>
        <div className="col-lg-11 col-md-10">
          <input
            type={type}
            className="form-control"
            id={id}
            placeholder={placeholder}
            value={this.state[id]}
            onChange={e => this.setState({ [id]: e.target.value })}
            required
          />
        </div>
      </div>;

    return (
      <div className="create-server">
        <form onSubmit={submit}>
          {renderInputGroup('name', 'Name')}
          {renderInputGroup('url', 'URL', 'url')}
          {renderInputGroup('apiKey', 'API key')}

          <div className="text-right">
            <button className="btn btn-primary btn-outline-primary">Create server</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { createServer })(CreateServer);
