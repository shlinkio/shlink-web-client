import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { ExternalLink } from 'react-external-link';
import { pipe } from 'ramda';
import { shortUrlTagsType } from '../reducers/shortUrlTags';
import { shortUrlType } from '../reducers/shortUrlsList';

const EditTagsModal = (TagsSelector) => class EditTagsModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    shortUrl: shortUrlType.isRequired,
    shortUrlTags: shortUrlTagsType,
    editShortUrlTags: PropTypes.func,
    resetShortUrlsTags: PropTypes.func,
  };

  saveTags = () => {
    const { editShortUrlTags, shortUrl, toggle } = this.props;

    editShortUrlTags(shortUrl.shortCode, this.state.tags)
      .then(toggle)
      .catch(() => {});
  };

  componentDidMount() {
    const { resetShortUrlsTags } = this.props;

    resetShortUrlsTags();
  }

  constructor(props) {
    super(props);
    this.state = { tags: props.shortUrl.tags };
  }

  render() {
    const { isOpen, toggle, shortUrl, shortUrlTags, resetShortUrlsTags } = this.props;
    const url = shortUrl && (shortUrl.shortUrl || '');
    const close = pipe(resetShortUrlsTags, toggle);

    return (
      <Modal isOpen={isOpen} toggle={close} centered>
        <ModalHeader toggle={close}>
          Edit tags for <ExternalLink href={url} />
        </ModalHeader>
        <ModalBody>
          <TagsSelector tags={this.state.tags} onChange={(tags) => this.setState({ tags })} />
          {shortUrlTags.error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the tags :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={close}>Cancel</button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={shortUrlTags.saving}
            onClick={() => this.saveTags()}
          >
            {shortUrlTags.saving ? 'Saving tags...' : 'Save tags'}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
};

export default EditTagsModal;
