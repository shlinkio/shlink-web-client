import { assoc, dissoc, pick, pipe } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { stateFlagTimeout } from '../utils/utils';
import { resetSelectedServer } from './reducers/selectedServer';
import { createServer } from './reducers/server';
import './CreateServer.scss';
import ImportServersBtn from './helpers/ImportServersBtn';

const SHOW_IMPORT_MSG_TIME = 4000;

export class CreateServerComponent extends React.Component {
  static propTypes = {
    createServer: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    resetSelectedServer: PropTypes.func,
  };

  state = {
    name: '',
    url: '',
    apiKey: '',
    serversImported: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { createServer, history: { push } } = this.props;
    const server = pipe(
      assoc('id', uuid()),
      dissoc('serversImported')
    )(this.state);

    createServer(server);
    push(`/server/${server.id}/list-short-urls/1`);
  };

  componentDidMount() {
    this.props.resetSelectedServer();
  }

  render() {
    const renderInputGroup = (id, placeholder, type = 'text') => (
      <div className="form-group row">
        <label htmlFor={id} className="col-lg-1 col-md-2 col-form-label create-server__label">
          {placeholder}:
        </label>
        <div className="col-lg-11 col-md-10">
          <input
            type={type}
            className="form-control"
            id={id}
            placeholder={placeholder}
            value={this.state[id]}
            required
            onChange={(e) => this.setState({ [id]: e.target.value })}
          />
        </div>
      </div>
    );

    return (
      <div className="create-server">
        <form onSubmit={this.handleSubmit}>
          {renderInputGroup('name', 'Name')}
          {renderInputGroup('url', 'URL', 'url')}
          {renderInputGroup('apiKey', 'API key')}

          <div className="text-right">
            <ImportServersBtn
              onImport={() => stateFlagTimeout(this.setState.bind(this), 'serversImported', true, SHOW_IMPORT_MSG_TIME)}
            />
            <button className="btn btn-outline-primary">Create server</button>
          </div>

          {this.state.serversImported && (
            <div className="row create-server__import-success-msg">
              <div className="col-md-10 offset-md-1">
                <div className="p-2 mt-3 bg-main text-white text-center">
                  Servers properly imported. You can now select one from the list :)
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const CreateServer = connect(
  pick([ 'selectedServer' ]),
  { createServer, resetSelectedServer }
)(CreateServerComponent);

export default CreateServer;
