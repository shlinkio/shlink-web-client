import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt as mapIcon } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem, DropdownMenu, UncontrolledTooltip } from 'reactstrap';
import { useToggle } from '../../utils/helpers/hooks';
import { CityStats } from '../types';
import MapModal from './MapModal';
import './OpenMapModalBtn.scss';

interface OpenMapModalBtnProps {
  modalTitle: string;
  activeCities: string[];
  locations?: CityStats[];
}

const OpenMapModalBtn = ({ modalTitle, activeCities, locations = [] }: OpenMapModalBtnProps) => {
  const [ mapIsOpened, , openMap, closeMap ] = useToggle();
  const [ dropdownIsOpened, toggleDropdown, openDropdown ] = useToggle();
  const [ locationsToShow, setLocationsToShow ] = useState<CityStats[]>([]);
  const buttonRef = useRef<HTMLElement>();

  const filterLocations = (cities: CityStats[]) => cities.filter(({ cityName }) => activeCities.includes(cityName));
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
      <button className="btn btn-link open-map-modal-btn__btn" ref={buttonRef as any} onClick={onClick}>
        <FontAwesomeIcon icon={mapIcon} />
      </button>
      <UncontrolledTooltip placement="left" target={(() => buttonRef.current) as any}>Show in map</UncontrolledTooltip>
      <Dropdown isOpen={dropdownIsOpened} toggle={toggleDropdown} inNavbar>
        <DropdownMenu right>
          <DropdownItem onClick={openMapWithLocations(false)}>Show all locations</DropdownItem>
          <DropdownItem onClick={openMapWithLocations(true)}>Show locations in current page</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <MapModal toggle={closeMap} isOpen={mapIsOpened} title={modalTitle} locations={locationsToShow} />
    </>
  );
};

export default OpenMapModalBtn;
