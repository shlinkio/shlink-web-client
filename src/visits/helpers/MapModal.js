import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { prop } from 'ramda';
import * as PropTypes from 'prop-types';
import './MapModal.scss';

const propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.shape({
    cityName: PropTypes.string.isRequired,
    latLong: PropTypes.arrayOf(PropTypes.number).isRequired,
    count: PropTypes.number.isRequired,
  })),
};
const defaultProps = {
  locations: [],
};

const OpenStreetMapTile = () => (
  <TileLayer
    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
);

const calculateMapProps = (locations) => {
  if (locations.length > 1) {
    return { bounds: locations.map(prop('latLong')) };
  }

  // When there's only one location, an error is thrown if trying to calculate the bounds.
  // When that happens, we use zoom and center as a workaround
  const [{ latLong: center }] = locations;

  return { zoom: '10', center };
};

const MapModal = ({ toggle, isOpen, title, locations }) => (
  <Modal toggle={toggle} isOpen={isOpen} className="map-modal__modal" contentClassName="map-modal__modal-content">
    <ModalBody className="map-modal__modal-body">
      <h3 className="map-modal__modal-title">
        {title}
        <button type="button" className="close" onClick={toggle}>&times;</button>
      </h3>
      <Map {...calculateMapProps(locations)}>
        <OpenStreetMapTile />
        {locations.map(({ cityName, latLong, count }, index) => (
          <Marker key={index} position={latLong}>
            <Popup><b>{count}</b> visit{count > 1 ? 's' : ''} from <b>{cityName}</b></Popup>
          </Marker>
        ))}
      </Map>
    </ModalBody>
  </Modal>
);

MapModal.propTypes = propTypes;
MapModal.defaultProps = defaultProps;

export default MapModal;
