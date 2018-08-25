import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { pick } from 'ramda';
import { deleteTag, tagDeleted, tagDeleteType } from '../reducers/tagDelete';

const propTypes = {
  tag: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  deleteTag: PropTypes.func,
  tagDelete: tagDeleteType,
  tagDeleted: PropTypes.func,
};

export class DeleteTagConfirmModalComponent extends React.Component {
  doDelete = () => {
    const { tag, toggle, deleteTag } = this.props;

    deleteTag(tag).then(() => {
      this.tagWasDeleted = true;
      toggle();
    });
  };
  handleOnClosed = () => {
    if (!this.tagWasDeleted) {
      return;
    }

    const { tagDeleted, tag } = this.props;

    tagDeleted(tag);
  };

  componentDidMount() {
    this.tagWasDeleted = false;
  }

  render() {
    const { tag, toggle, isOpen, tagDelete } = this.props;

    return (
      <Modal toggle={toggle} isOpen={isOpen} centered onClosed={this.handleOnClosed}>
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
            disabled={tagDelete.deleting}
            onClick={() => this.doDelete()}
          >
            {tagDelete.deleting ? 'Deleting tag...' : 'Delete tag'}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteTagConfirmModalComponent.propTypes = propTypes;

const DeleteTagConfirmModal = connect(
  pick([ 'tagDelete' ]),
  { deleteTag, tagDeleted }
)(DeleteTagConfirmModalComponent);

export default DeleteTagConfirmModal;
