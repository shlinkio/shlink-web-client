import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { pick } from 'ramda';
import { editTag, tagEdited } from '../reducers/tagEdit';

export class EditTagModal extends React.Component {
  saveTag = e => {
    e.preventDefault();
    const { tag: oldName, editTag, toggle } = this.props;
    const { tag: newName } = this.state;

    editTag(oldName, newName)
      .then(() => {
        this.tagWasEdited = true;
        toggle();
      })
      .catch(() => {});
  };
  onClosed = () => {
    if (!this.tagWasEdited) {
      return;
    }

    const { tag: oldName, tagEdited } = this.props;
    const { tag: newName } = this.state;
    tagEdited(oldName, newName);
  };

  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag,
    }
  }

  componentDidMount() {
    this.tagWasEdited = false;
  }

  render() {
    const { isOpen, toggle, tagEdit } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered onClosed={this.onClosed}>
        <form onSubmit={this.saveTag}>
          <ModalHeader toggle={toggle}>Edit tag</ModalHeader>
          <ModalBody>
            <input
              type="text"
              value={this.state.tag}
              onChange={e => this.setState({ tag: e.target.value })}
              placeholder="Tag"
              required
              className="form-control"
            />
            {tagEdit.error && (
              <div className="p-2 mt-2 bg-danger text-white text-center">
                Something went wrong while editing the tag :(
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-link" onClick={toggle}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={tagEdit.editing}>
              {tagEdit.editing ? 'Saving...' : 'Save'}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default connect(pick(['tagEdit']), { editTag, tagEdited })(EditTagModal);
