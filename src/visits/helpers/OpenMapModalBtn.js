import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt as mapIcon } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem, DropdownMenu, UncontrolledTooltip } from 'reactstrap';
import * as PropTypes from 'prop-types';
import MapModal from './MapModal';
import './OpenMapModalBtn.scss';

const propTypes = {
  modalTitle: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  activeCities: PropTypes.arrayOf(PropTypes.string),
};

const OpenMapModalBtn = ({ modalTitle, locations = [], activeCities }) => {
  const [ mapIsOpened, setMapIsOpened ] = useState(false);
  const [ dropdownIsOpened, setDropdownIsOpened ] = useState(false);
  const [ locationsToShow, setLocationsToShow ] = useState([]);

  const buttonRef = React.createRef();
  const filterLocations = (locations) => locations.filter(({ cityName }) => activeCities.includes(cityName));
  const toggleMap = () => setMapIsOpened(!mapIsOpened);
  const onClick = () => {
    if (mapIsOpened) {
      setMapIsOpened(false);

      return;
    }

    if (!activeCities) {
      setLocationsToShow(locations);
      setMapIsOpened(true);

      return;
    }

    setDropdownIsOpened(true);
  };
  const openMapWithLocations = (filtered) => () => {
    setLocationsToShow(filtered ? filterLocations(locations) : locations);
    setMapIsOpened(true);
  };

  return (
    <React.Fragment>
      <button className="btn btn-link open-map-modal-btn__btn" ref={buttonRef} onClick={onClick}>
        <FontAwesomeIcon icon={mapIcon} />
      </button>
      <UncontrolledTooltip placement="left" target={() => buttonRef.current}>Show in map</UncontrolledTooltip>
      <Dropdown isOpen={dropdownIsOpened} toggle={() => setDropdownIsOpened(!dropdownIsOpened)} inNavbar>
        <DropdownMenu right>
          <DropdownItem onClick={openMapWithLocations(false)}>Show all locations</DropdownItem>
          <DropdownItem onClick={openMapWithLocations(true)}>Show locations in current page</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <MapModal toggle={toggleMap} isOpen={mapIsOpened} title={modalTitle} locations={locationsToShow} />
    </React.Fragment>
  );
};

OpenMapModalBtn.propTypes = propTypes;

export default OpenMapModalBtn;
