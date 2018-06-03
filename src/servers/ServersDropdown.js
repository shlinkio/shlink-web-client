import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export default class ServersDropdown extends React.Component {
  render() {
    return (
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          Servers
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem>
            Server 1 foo
          </DropdownItem>
          <DropdownItem>
            Server 2 foo
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}
