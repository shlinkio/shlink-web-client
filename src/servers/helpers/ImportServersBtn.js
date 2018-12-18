import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { assoc } from 'ramda';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';

const ImportServersBtn = (serversImporter) => class ImportServersBtn extends React.Component {
  static defaultProps = {
    onImport: () => ({}),
  };
  static propTypes = {
    onImport: PropTypes.func,
    createServers: PropTypes.func,
    fileRef: PropTypes.oneOfType([ PropTypes.object, PropTypes.node ]),
  };

  constructor(props) {
    super(props);
    this.fileRef = props.fileRef || React.createRef();
  }

  render() {
    const { importServersFromFile } = serversImporter;
    const { onImport, createServers } = this.props;
    const onChange = (e) =>
      importServersFromFile(e.target.files[0])
        .then((servers) => servers.map((server) => assoc('id', uuid(), server)))
        .then(createServers)
        .then(onImport);

    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-outline-secondary mr-2"
          id="importBtn"
          onClick={() => this.fileRef.current.click()}
        >
          Import from file
        </button>
        <UncontrolledTooltip placement="top" target="importBtn">
          You can create servers by importing a CSV file with columns <b>name</b>, <b>apiKey</b> and <b>url</b>
        </UncontrolledTooltip>

        <input
          type="file"
          accept="text/csv"
          className="create-server__csv-select"
          ref={this.fileRef}
          onChange={onChange}
        />
      </React.Fragment>
    );
  }
};

export default ImportServersBtn;
