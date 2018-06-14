import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { connect } from 'react-redux';

export class ServersDropdown extends React.Component {
  renderServers = () => {
    return this.props.servers.map(server => (
      <DropdownItem key={server.name} onClick={() => this.selectServer(server)}>
        {server.name}
      </DropdownItem>
    ));
  };

  selectServer = server => {
    // TODO
  };

  render() {
    return (
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          Servers
        </DropdownToggle>

        <DropdownMenu>
          {this.renderServers()}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

const mapStateToProps = state => ({
  servers: state.servers
});

export default connect(mapStateToProps)(ServersDropdown);
