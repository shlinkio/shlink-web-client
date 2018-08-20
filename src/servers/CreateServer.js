import { assoc, pick } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { createServer } from './reducers/server';
import { resetSelectedServer } from './reducers/selectedServer';
import { v4 as uuid } from 'uuid';
import { UncontrolledTooltip } from 'reactstrap';
import './CreateServer.scss';

export class CreateServer extends React.Component {
  state = {
    name: '',
    url: '',
    apiKey: '',
  };

  submit = e => {
    e.preventDefault();

    const { createServer, history: { push } } = this.props;
    const server = assoc('id', uuid(), this.state);

    createServer(server);
    push(`/server/${server.id}/list-short-urls/1`)
  };

  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }

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
            <button
              type="button"
              className="btn btn-outline-secondary mr-2"
              onClick={() => this.fileRef.current.click()}
              id="importBtn"
            >
              Import from file
            </button>
            <UncontrolledTooltip placement="top" target="importBtn">
              You can create servers by importing a CSV file with columns "name", "apiKey" and "url"
            </UncontrolledTooltip>
            <input
              type="file"
              onChange={file => console.log(file)}
              accept="text/csv"
              className="create-server__csv-select"
              ref={this.fileRef}
            />
            <button className="btn btn-outline-primary">Create server</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(pick(['selectedServer']), {createServer, resetSelectedServer })(CreateServer);
