import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TagsSelector from '../../utils/TagsSelector';
import PropTypes from 'prop-types';
import { editShortUrlTags, shortUrlTagsType } from '../reducers/shortUrlTags';
import { pick } from 'ramda';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  shortUrl: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  shortUrlTags: shortUrlTagsType,
};

export class EditTagsModal extends React.Component {
  saveTags = () => {
    const { editShortUrlTags, shortUrl, toggle } = this.props;
    editShortUrlTags(shortUrl.shortCode, this.state.tags).then(toggle);
  };

  constructor(props) {
    super(props);
    this.state = { tags: props.shortUrl.tags };
  }

  render() {
    const { isOpen, toggle, url, shortUrlTags } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Edit tags for <a target="_blank" href={url}>{url}</a></ModalHeader>
        <ModalBody>
          <TagsSelector tags={this.state.tags} onChange={tags => this.setState({ tags })} />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={toggle}>Cancel</button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.saveTags}
            disabled={shortUrlTags.saving}
          >
            {shortUrlTags.saving ? 'Saving tags...' : 'Save tags'}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditTagsModal.propTypes = propTypes;

export default connect(pick(['shortUrlTags']), { editShortUrlTags })(EditTagsModal);
