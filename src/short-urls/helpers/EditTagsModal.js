import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { ExternalLink } from 'react-external-link';
import { shortUrlTagsType } from '../reducers/shortUrlTags';
import { shortUrlType } from '../reducers/shortUrlsList';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  shortUrl: shortUrlType.isRequired,
  shortUrlTags: shortUrlTagsType,
  editShortUrlTags: PropTypes.func,
  resetShortUrlsTags: PropTypes.func,
};

const EditTagsModal = (TagsSelector) => {
  const EditTagsModalComp = ({ isOpen, toggle, shortUrl, shortUrlTags, editShortUrlTags, resetShortUrlsTags }) => {
    const [ selectedTags, setSelectedTags ] = useState(shortUrl.tags || []);

    useEffect(() => resetShortUrlsTags, []);

    const url = shortUrl && (shortUrl.shortUrl || '');
    const saveTags = () => editShortUrlTags(shortUrl.shortCode, shortUrl.domain, selectedTags)
      .then(toggle)
      .catch(() => {});

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>
          Edit tags for <ExternalLink href={url} />
        </ModalHeader>
        <ModalBody>
          <TagsSelector tags={selectedTags} onChange={(tags) => setSelectedTags(tags)} />
          {shortUrlTags.error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the tags :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={toggle}>Cancel</button>
          <button className="btn btn-primary" type="button" disabled={shortUrlTags.saving} onClick={saveTags}>
            {shortUrlTags.saving ? 'Saving tags...' : 'Save tags'}
          </button>
        </ModalFooter>
      </Modal>
    );
  };

  EditTagsModalComp.propTypes = propTypes;

  return EditTagsModalComp;
};

export default EditTagsModal;
