import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader, Popover } from 'reactstrap';
import { pick } from 'ramda';
import { editTag, tagEdited } from '../reducers/tagEdit';
import { ChromePicker } from 'react-color';
import ColorGenerator from '../../utils/ColorGenerator';
import colorIcon from '@fortawesome/fontawesome-free-solid/faPalette'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import './EditTagModal.scss';

const defaultProps = {
  colorGenerator: ColorGenerator,
};


export class EditTagModal extends React.Component {
  saveTag = e => {
    e.preventDefault();
    const { tag: oldName, editTag, toggle } = this.props;
    const { tag: newName, color } = this.state;

    editTag(oldName, newName, color)
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
    const { tag: newName, color } = this.state;
    tagEdited(oldName, newName, color);
  };

  constructor(props) {
    super(props);

    const { colorGenerator, tag } = props;
    this.state = {
      showColorPicker: false,
      tag,
      color: colorGenerator.getColorForKey(tag)
    }
  }

  componentDidMount() {
    this.tagWasEdited = false;
  }

  render() {
    const { isOpen, toggle, tagEdit } = this.props;
    const { tag, color } = this.state;
    const toggleColorPicker = () =>
      this.setState({ showColorPicker: !this.state.showColorPicker });

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered onClosed={this.onClosed}>
        <form onSubmit={this.saveTag}>
          <ModalHeader toggle={toggle}>Edit tag</ModalHeader>
          <ModalBody>
            <div className="input-group">
              <div
                className="input-group-prepend"
                id="colorPickerBtn"
                onClick={toggleColorPicker}
              >
                <div
                  className="input-group-text edit-tag-modal__color-picker-toggle"
                  style={{
                    backgroundColor: color,
                    borderColor: color,
                  }}
                >
                  <FontAwesomeIcon icon={colorIcon} className="edit-tag-modal__color-icon" />
                </div>
              </div>
              <Popover
                isOpen={this.state.showColorPicker}
                toggle={toggleColorPicker}
                target="colorPickerBtn"
                placement="right"
              >
                <ChromePicker
                  color={color}
                  onChange={color => this.setState({ color: color.hex })}
                  disableAlpha
                />
              </Popover>
              <input
                type="text"
                value={tag}
                onChange={e => this.setState({ tag: e.target.value })}
                placeholder="Tag"
                required
                className="form-control"
              />
            </div>

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

EditTagModal.defaultProps = defaultProps;

export default connect(pick(['tagEdit']), { editTag, tagEdited })(EditTagModal);
