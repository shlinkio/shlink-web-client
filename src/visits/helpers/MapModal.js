import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import * as PropTypes from 'prop-types';
import './MapModal.scss';

const propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.shape({
    city: PropTypes.string.isRequired,
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

const MapModal = ({ toggle, isOpen, title, locations }) => (
  <Modal toggle={toggle} isOpen={isOpen} className="map-modal__modal" contentClassName="map-modal__modal-content">
    <ModalHeader toggle={toggle}>{title}</ModalHeader>
    <ModalBody className="map-modal__modal-body">
      <Map center={[ 0, 0 ]} zoom="3">
        <OpenStreetMapTile />
        {locations.map(({ city, latLong, count }, index) => (
          <Marker key={index} position={latLong}>
            <Popup><b>{count}</b> visit{count > 1 ? 's' : ''} from <b>{city}</b></Popup>
          </Marker>
        ))}
      </Map>
    </ModalBody>
  </Modal>
);

MapModal.propTypes = propTypes;
MapModal.defaultProps = defaultProps;

export default MapModal;
