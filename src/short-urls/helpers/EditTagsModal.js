import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import TagsSelector from '../../utils/TagsSelector';
import PropTypes from 'prop-types';
import { editShortUrlTags, resetShortUrlsTags, shortUrlTagsType } from '../reducers/shortUrlTags';
import { pick } from 'ramda';
import { refreshShortUrls } from '../reducers/shortUrlsList';

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
    editShortUrlTags(shortUrl.shortCode, this.state.tags)
      .then(() => {
        this.tagsSaved = true;
        toggle();
      })
      .catch(() => {});
  };
  refreshShortUrls = () => {
    if (!this.tagsSaved) {
      return;
    }

    this.props.refreshShortUrls();
  };

  componentDidMount() {
    const { resetShortUrlsTags } = this.props;
    resetShortUrlsTags();
    this.tagsSaved = false;
  }

  constructor(props) {
    super(props);
    this.state = { tags: props.shortUrl.tags };
  }

  render() {
    const { isOpen, toggle, url, shortUrlTags } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered onClosed={this.refreshShortUrls}>
        <ModalHeader toggle={toggle}>Edit tags for <a target="_blank" href={url}>{url}</a></ModalHeader>
        <ModalBody>
          <TagsSelector tags={this.state.tags} onChange={tags => this.setState({ tags })} />
          {shortUrlTags.error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the tags :(
            </div>
          )}
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

export default connect(
  pick(['shortUrlTags']),
  { editShortUrlTags, resetShortUrlsTags, refreshShortUrls }
)(EditTagsModal);
