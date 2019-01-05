import { faPlus as plusIcon, faChevronDown as arrowIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import shlinkLogo from './shlink-logo-white.png';
import './MainHeader.scss';

const MainHeader = (ServersDropdown) => class MainHeader extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  };

  state = { isOpen: false };
  handleToggle = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { location } = this.props;
    const createServerPath = '/server/create';
    const toggleClass = classnames('main-header__toggle-icon', {
      'main-header__toggle-icon--opened': this.state.isOpen,
    });

    return (
      <Navbar color="primary" dark fixed="top" className="main-header" expand="md">
        <NavbarBrand tag={Link} to="/">
          <img src={shlinkLogo} alt="Shlink" className="main-header__brand-logo" /> Shlink
        </NavbarBrand>

        <NavbarToggler onClick={this.handleToggle}>
          <FontAwesomeIcon icon={arrowIcon} className={toggleClass} />
        </NavbarToggler>

        <Collapse navbar isOpen={this.state.isOpen}>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink
                tag={Link}
                to={createServerPath}
                active={location.pathname === createServerPath}
              >
                <FontAwesomeIcon icon={plusIcon} />&nbsp; Add server
              </NavLink>
            </NavItem>
            <ServersDropdown />
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
};

export default MainHeader;
