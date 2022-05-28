import { FC } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet';
import { prop } from 'ramda';
import { CityStats } from '../types';
import './MapModal.scss';

interface MapModalProps {
  toggle: () => void;
  isOpen: boolean;
  title: string;
  locations?: CityStats[];
}

const OpenStreetMapTile: FC = () => (
  <TileLayer
    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
);

const calculateMapProps = (locations: CityStats[]): MapContainerProps => {
  if (locations.length === 0) {
    return {};
  }

  if (locations.length > 1) {
    return { bounds: locations.map(prop('latLong')) };
  }

  // When there's only one location, an error is thrown if trying to calculate the bounds.
  // When that happens, we use "zoom" and "center" as a workaround
  const [{ latLong: center }] = locations;

  return { zoom: 10, center };
};

export const MapModal = ({ toggle, isOpen, title, locations = [] }: MapModalProps) => (
  <Modal toggle={toggle} isOpen={isOpen} className="map-modal__modal" contentClassName="map-modal__modal-content">
    <ModalBody className="map-modal__modal-body">
      <h3 className="map-modal__modal-title">
        {title}
        <button type="button" className="btn-close float-end" onClick={toggle} />
      </h3>
      <MapContainer {...calculateMapProps(locations)}>
        <OpenStreetMapTile />
        {locations.map(({ cityName, latLong, count }, index) => (
          <Marker key={index} position={latLong}>
            <Popup><b>{count}</b> visit{count > 1 ? 's' : ''} from <b>{cityName}</b></Popup>
          </Marker>
        ))}
      </MapContainer>
    </ModalBody>
  </Modal>
);
