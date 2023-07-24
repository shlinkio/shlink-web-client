import { faMapMarkedAlt as mapIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, UncontrolledTooltip } from 'reactstrap';
import { useDomId, useToggle } from '../../../src/utils/helpers/hooks';
import type { CityStats } from '../types';
import { MapModal } from './MapModal';
import './OpenMapModalBtn.scss';

interface OpenMapModalBtnProps {
  modalTitle: string;
  activeCities?: string[];
  locations?: CityStats[];
}

export const OpenMapModalBtn = ({ modalTitle, activeCities, locations = [] }: OpenMapModalBtnProps) => {
  const [mapIsOpened, , openMap, closeMap] = useToggle();
  const [dropdownIsOpened, toggleDropdown, openDropdown] = useToggle();
  const [locationsToShow, setLocationsToShow] = useState<CityStats[]>([]);
  const id = useDomId();

  const filterLocations = (cities: CityStats[]) => (
    !activeCities ? cities : cities.filter(({ cityName }) => activeCities?.includes(cityName))
  );
  const onClick = () => {
    if (!activeCities) {
      setLocationsToShow(locations);
      openMap();

      return;
    }

    openDropdown();
  };
  const openMapWithLocations = (filtered: boolean) => () => {
    setLocationsToShow(filtered ? filterLocations(locations) : locations);
    openMap();
  };

  return (
    <>
      <Button color="link" className="open-map-modal-btn__btn" id={id} onClick={onClick}>
        <FontAwesomeIcon icon={mapIcon} />
      </Button>
      <UncontrolledTooltip placement="left" target={id}>Show in map</UncontrolledTooltip>
      <Dropdown isOpen={dropdownIsOpened} toggle={toggleDropdown} inNavbar>
        <DropdownMenu end>
          <DropdownItem onClick={openMapWithLocations(false)}>Show all locations</DropdownItem>
          <DropdownItem onClick={openMapWithLocations(true)}>Show locations in current page</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <MapModal toggle={closeMap} isOpen={mapIsOpened} title={modalTitle} locations={locationsToShow} />
    </>
  );
};
