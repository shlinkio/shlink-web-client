import React from 'react';
import { connect } from 'react-redux';

import './CreateServer.scss';

export const CreateServer = () => {
  const submit = e => e.preventDefault();

  return (
    <div className="create-server">
      <form onSubmit={submit}>
        <div className="form-group row">
          <label htmlFor="name" className="col-lg-1 col-md-2 col-form-label create-server__label">Name:</label>
          <div className="col-lg-11 col-md-10">
            <input type="text" className="form-control" id="name" placeholder="Name" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="url" className="col-lg-1 col-md-2 col-form-label create-server__label">URL:</label>
          <div className="col-lg-11 col-md-10">
            <input type="url" className="form-control" id="url" placeholder="URL" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="apiKey" className="col-lg-1 col-md-2 col-form-label create-server__label">API key:</label>
          <div className="col-lg-11 col-md-10">
            <input type="text" className="form-control" id="apiKey" placeholder="API key" />
          </div>
        </div>

        <div className="text-right">
          <button className="btn btn-primary btn-outline-primary">Create</button>
        </div>
      </form>
    </div>
  );
};

export default connect()(CreateServer);
