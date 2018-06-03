import plusIcon from '@fortawesome/fontawesome-free-solid/faPlus';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import {
  Collapse, DropdownItem, DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown
} from 'reactstrap';
import './MainHeader.scss';
import shlinkLogo from './shlink-logo-white.png';

export default class MainHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar color="primary" dark fixed="top" className="main-header" expand="md">
        <NavbarBrand href="https://shlink.io" target="_blank">
          <img src={shlinkLogo} alt="Shlink" className="main-header__brand-logo"/> Shlink
        </NavbarBrand>
        <NavbarToggler onClick={() => this.toggle()}/>
        <Collapse navbar isOpen={this.state.isOpen}>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink href="#">
                <FontAwesomeIcon icon={plusIcon}/>&nbsp; Add server
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                Servers
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem>
                  Server 1
                </DropdownItem>
                <DropdownItem>
                  Server 2
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
