import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Button } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { shortUrlType } from '../reducers/shortUrlsList';
import { ShortUrlEditionType } from '../reducers/shortUrlEdition';
import { hasValue } from '../../utils/utils';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  shortUrl: shortUrlType.isRequired,
  shortUrlEdition: ShortUrlEditionType,
  editShortUrl: PropTypes.func,
};

const EditShortUrlModal = ({ isOpen, toggle, shortUrl, shortUrlEdition, editShortUrl }) => {
  const { saving, error } = shortUrlEdition;
  const url = shortUrl && (shortUrl.shortUrl || '');
  const [ longUrl, setLongUrl ] = useState(shortUrl.longUrl);

  const doEdit = () => editShortUrl(shortUrl.shortCode, shortUrl.domain, longUrl).then(toggle);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Edit long URL for <ExternalLink href={url} />
      </ModalHeader>
      <form onSubmit={(e) => e.preventDefault() || doEdit()}>
        <ModalBody>
          <FormGroup className="mb-0">
            <Input
              type="url"
              required
              placeholder="Long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </FormGroup>
          {error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the long URL :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={toggle}>Cancel</Button>
          <Button color="primary" disabled={saving || !hasValue(longUrl)}>{saving ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

EditShortUrlModal.propTypes = propTypes;

export default EditShortUrlModal;
