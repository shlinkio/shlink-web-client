import React, { useRef } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  onImport: PropTypes.func,
  createServers: PropTypes.func,
  fileRef: PropTypes.oneOfType([ PropTypes.object, PropTypes.node ]),
};

// FIXME Replace with typescript: (ServersImporter)
const ImportServersBtn = ({ importServersFromFile }) => {
  const ImportServersBtnComp = ({ createServers, fileRef, onImport = () => {} }) => {
    const ref = fileRef || useRef();
    const onChange = ({ target }) =>
      importServersFromFile(target.files[0])
        .then(createServers)
        .then(onImport)
        .then(() => {
          // Reset input after processing file
          target.value = null;
        });

    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-outline-secondary mr-2"
          id="importBtn"
          onClick={() => ref.current.click()}
        >
          Import from file
        </button>
        <UncontrolledTooltip placement="top" target="importBtn">
          You can create servers by importing a CSV file with columns <b>name</b>, <b>apiKey</b> and <b>url</b>.
        </UncontrolledTooltip>

        <input type="file" accept="text/csv" className="create-server__csv-select" ref={ref} onChange={onChange} />
      </React.Fragment>
    );
  };

  ImportServersBtnComp.propTypes = propTypes;

  return ImportServersBtnComp;
};

export default ImportServersBtn;
