import { isEmpty, pick, values } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { selectServer } from '../servers/reducers/selectedServer';
import serversExporter from '../servers/services/ServersExporter';
import { listServers } from './reducers/server';
import { serverType } from './prop-types';

export class ServersDropdownComponent extends React.Component {
  static defaultProps = {
    serversExporter,
  };
  static propTypes = {
    servers: PropTypes.object,
    serversExporter: PropTypes.shape({
      exportServers: PropTypes.func,
    }),
    selectedServer: serverType,
    selectServer: PropTypes.func,
    listServers: PropTypes.func,
  };

  renderServers = () => {
    const { servers, selectedServer, selectServer, serversExporter } = this.props;

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>;
    }

    return (
      <React.Fragment>
        {values(servers).map(({ name, id }) => (
          <DropdownItem
            key={id}
            tag={Link}
            to={`/server/${id}/list-short-urls/1`}
            active={selectedServer && selectedServer.id === id}

            // FIXME This should be implicit
            onClick={() => selectServer(id)}
          >
            {name}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem
          className="servers-dropdown__export-item"
          onClick={() => serversExporter.exportServers()}
        >
          Export servers
        </DropdownItem>
      </React.Fragment>
    );
  };

  componentDidMount() {
    this.props.listServers();
  }

  render() {
    return (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Servers</DropdownToggle>
        <DropdownMenu right>{this.renderServers()}</DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

const ServersDropdown = connect(
  pick([ 'servers', 'selectedServer' ]),
  { listServers, selectServer }
)(ServersDropdownComponent);

export default ServersDropdown;
