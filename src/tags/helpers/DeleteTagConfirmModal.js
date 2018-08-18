import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { pick } from 'ramda';
import { deleteTag, tagDeleteType } from '../reducers/tagDelete';
import { listTags } from '../reducers/tagsList';

const propTypes = {
  tag: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  deleteTag: PropTypes.func,
  listTags: PropTypes.func,
  tagDelete: tagDeleteType,
};

export class DeleteTagConfirmModal extends Component {
  doDelete = () => {
    const { tag, toggle, deleteTag } = this.props;
    deleteTag(tag).then(() => {
      this.tagDeleted = true;
      toggle();
    }).catch(() => {});
  };
  onClosed = () => {
    if (!this.tagDeleted) {
      return;
    }

    this.props.listTags();
  };

  componentDidMount() {
    this.tagDeleted = false;
  }

  render() {
    const { tag, toggle, isOpen, tagDelete } = this.props;

    return (
      <Modal toggle={toggle} isOpen={isOpen} centered onClosed={this.onClosed}>
        <ModalHeader toggle={toggle}>
          <span className="text-danger">Delete tag</span>
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete tag <b>{tag}</b>?
          {tagDelete.error && (
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while deleting the tag :(
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-link" onClick={toggle}>Cancel</button>
          <button
            className="btn btn-danger"
            onClick={this.doDelete}
            disabled={tagDelete.deleting}
          >
            {tagDelete.deleting ? 'Deleting tag...' : 'Delete tag'}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteTagConfirmModal.propTypes = propTypes;

export default connect(
  pick(['tagDelete']),
  { deleteTag, listTags }
)(DeleteTagConfirmModal);
