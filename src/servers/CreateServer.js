import { assoc, dissoc, pick, pipe } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { createServer } from './reducers/server';
import { resetSelectedServer } from './reducers/selectedServer';
import { v4 as uuid } from 'uuid';
import './CreateServer.scss';
import ImportServersBtn from './helpers/ImportServersBtn';

export class CreateServer extends React.Component {
  state = {
    name: '',
    url: '',
    apiKey: '',
    serversImported: false,
  };

  submit = e => {
    e.preventDefault();

    const { createServer, history: { push } } = this.props;
    const server = pipe(
      assoc('id', uuid()),
      dissoc('serversImported')
    )(this.state);

    createServer(server);
    push(`/server/${server.id}/list-short-urls/1`)
  };

  componentDidMount() {
    this.props.resetSelectedServer();
  }

  render() {
    const renderInputGroup = (id, placeholder, type = 'text') =>
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
            onChange={e => this.setState({ [id]: e.target.value })}
            required
          />
        </div>
      </div>;

    return (
      <div className="create-server">
        <form onSubmit={this.submit}>
          {renderInputGroup('name', 'Name')}
          {renderInputGroup('url', 'URL', 'url')}
          {renderInputGroup('apiKey', 'API key')}

          <div className="text-right">
            <ImportServersBtn onImport={() => {
              this.setState({ serversImported: true });
              setTimeout(() => this.setState({ serversImported: false }), 4000);
            }} />
            <button className="btn btn-outline-primary">Create server</button>
          </div>

          {this.state.serversImported && (
            <div className="row">
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

export default connect(
  pick(['selectedServer']),
  {createServer, resetSelectedServer }
)(CreateServer);
