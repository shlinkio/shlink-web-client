import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader, Popover } from 'reactstrap';
import { pick } from 'ramda';
import { ChromePicker } from 'react-color';
import colorIcon from '@fortawesome/fontawesome-free-solid/faPalette';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import colorGenerator, { colorGeneratorType } from '../../utils/ColorGenerator';
import { editTag, tagEdited } from '../reducers/tagEdit';
import './EditTagModal.scss';

const propTypes = {
  tag: PropTypes.string,
  editTag: PropTypes.func,
  toggle: PropTypes.func,
  tagEdited: PropTypes.func,
  colorGenerator: colorGeneratorType,
  isOpen: PropTypes.bool,
  tagEdit: PropTypes.shape({
    error: PropTypes.bool,
    editing: PropTypes.bool,
  }),
};
const defaultProps = {
  colorGenerator,
};

export class EditTagModalComponent extends React.Component {
  saveTag = (e) => {
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
  handleOnClosed = () => {
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
      color: colorGenerator.getColorForKey(tag),
    };
  }

  componentDidMount() {
    this.tagWasEdited = false;
  }

  render() {
    const { isOpen, toggle, tagEdit } = this.props;
    const { tag, color } = this.state;
    const toggleColorPicker = () =>
      this.setState(({ showColorPicker }) => ({ showColorPicker: !showColorPicker }));

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered onClosed={this.handleOnClosed}>
        <form onSubmit={(e) => this.saveTag(e)}>
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
                  disableAlpha
                  onChange={(color) => this.setState({ color: color.hex })}
                />
              </Popover>
              <input
                type="text"
                value={tag}
                placeholder="Tag"
                required
                className="form-control"
                onChange={(e) => this.setState({ tag: e.target.value })}
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

EditTagModalComponent.propTypes = propTypes;
EditTagModalComponent.defaultProps = defaultProps;

const EditTagModal = connect(pick([ 'tagEdit' ]), { editTag, tagEdited })(EditTagModalComponent);

export default EditTagModal;
