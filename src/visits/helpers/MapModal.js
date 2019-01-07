import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import * as PropTypes from 'prop-types';
import './MapModal.scss';

const propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
};

const madridLat = 40.416775;
const madridLong = -3.703790;
const latLong = [ madridLat, madridLong ];

const MapModal = ({ toggle, isOpen, title }) => (
  <Modal toggle={toggle} isOpen={isOpen} centered size="lg" className="map-modal__modal">
    <ModalHeader toggle={toggle}>{title}</ModalHeader>
    <ModalBody>
      <Map center={latLong} zoom="13">
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={latLong}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    </ModalBody>
  </Modal>
);

MapModal.propTypes = propTypes;

export default MapModal;
