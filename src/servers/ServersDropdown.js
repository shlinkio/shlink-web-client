import { isEmpty, values } from 'ramda';
import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const ServersDropdown = (serversExporter) => class ServersDropdown extends React.Component {
  static propTypes = {
    servers: PropTypes.object,
    selectedServer: serverType,
    listServers: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  };

  renderServers = () => {
    const { servers: { list, loading }, selectedServer } = this.props;
    const servers = values(list);
    const { push } = this.props.history;
    const loadServer = (id) => push(`/server/${id}/list-short-urls/1`);

    if (loading) {
      return <DropdownItem disabled><i>Trying to load servers...</i></DropdownItem>;
    }

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>;
    }

    return (
      <React.Fragment>
        {servers.map(({ name, id }) => (
          <DropdownItem key={id} active={selectedServer && selectedServer.id === id} onClick={() => loadServer(id)}>
            {name}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem className="servers-dropdown__export-item" onClick={() => serversExporter.exportServers()}>
          Export servers
        </DropdownItem>
      </React.Fragment>
    );
  };

  componentDidMount = this.props.listServers;

  render = () => (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>Servers</DropdownToggle>
      <DropdownMenu right>{this.renderServers()}</DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ServersDropdown;
