import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt as mapIcon } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem, DropdownMenu, UncontrolledTooltip } from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useToggle } from '../../utils/helpers/hooks';
import './OpenMapModalBtn.scss';

const propTypes = {
  modalTitle: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  activeCities: PropTypes.arrayOf(PropTypes.string),
};

const OpenMapModalBtn = (MapModal) => {
  const OpenMapModalBtn = ({ modalTitle, locations = [], activeCities }) => {
    const [ mapIsOpened, , openMap, closeMap ] = useToggle();
    const [ dropdownIsOpened, toggleDropdown, openDropdown ] = useToggle();
    const [ locationsToShow, setLocationsToShow ] = useState([]);

    const buttonRef = React.createRef();
    const filterLocations = (locations) => locations.filter(({ cityName }) => activeCities.includes(cityName));
    const onClick = () => {
      if (!activeCities) {
        setLocationsToShow(locations);
        openMap();

        return;
      }

      openDropdown();
    };
    const openMapWithLocations = (filtered) => () => {
      setLocationsToShow(filtered ? filterLocations(locations) : locations);
      openMap();
    };

    return (
      <React.Fragment>
        <button className="btn btn-link open-map-modal-btn__btn" ref={buttonRef} onClick={onClick}>
          <FontAwesomeIcon icon={mapIcon} />
        </button>
        <UncontrolledTooltip placement="left" target={() => buttonRef.current}>Show in map</UncontrolledTooltip>
        <Dropdown isOpen={dropdownIsOpened} toggle={toggleDropdown} inNavbar>
          <DropdownMenu right>
            <DropdownItem onClick={openMapWithLocations(false)}>Show all locations</DropdownItem>
            <DropdownItem onClick={openMapWithLocations(true)}>Show locations in current page</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <MapModal toggle={closeMap} isOpen={mapIsOpened} title={modalTitle} locations={locationsToShow} />
      </React.Fragment>
    );
  };

  OpenMapModalBtn.propTypes = propTypes;

  return OpenMapModalBtn;
};

export default OpenMapModalBtn;
