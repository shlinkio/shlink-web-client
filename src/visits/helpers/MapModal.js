import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
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

const MapModal = ({ toggle, isOpen, title, locations }) => (
  <Modal toggle={toggle} isOpen={isOpen} className="map-modal__modal" contentClassName="map-modal__modal-content">
    <ModalBody className="map-modal__modal-body">
      <h3 className="map-modal__modal-title">
        {title}
        <button type="button" className="close" onClick={toggle}>&times;</button>
      </h3>
      <Map center={[ 0, 0 ]} zoom="3">
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
