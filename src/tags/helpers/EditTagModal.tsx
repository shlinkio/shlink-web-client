import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Popover } from 'reactstrap';
import { ChromePicker } from 'react-color';
import { faPalette as colorIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '../../utils/helpers/hooks';
import { handleEventPreventingDefault } from '../../utils/utils';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { TagModalProps } from '../data';
import { TagEdition } from '../reducers/tagEdit';
import './EditTagModal.scss';

interface EditTagModalProps extends TagModalProps {
  tagEdit: TagEdition;
  editTag: (oldName: string, newName: string, color: string) => Promise<void>;
  tagEdited: (oldName: string, newName: string, color: string) => void;
}

const EditTagModal = ({ getColorForKey }: ColorGenerator) => (
  { tag, editTag, toggle, tagEdited, isOpen, tagEdit }: EditTagModalProps,
) => {
  const [ newTagName, setNewTagName ] = useState(tag);
  const [ color, setColor ] = useState(getColorForKey(tag));
  const [ showColorPicker, toggleColorPicker ] = useToggle();
  const saveTag = handleEventPreventingDefault(async () => editTag(tag, newTagName, color)
    .then(() => tagEdited(tag, newTagName, color))
    .then(toggle)
    .catch(() => {}));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <form onSubmit={saveTag}>
        <ModalHeader toggle={toggle}>Edit tag</ModalHeader>
        <ModalBody>
          <div className="input-group">
            <div className="input-group-prepend" id="colorPickerBtn" onClick={toggleColorPicker}>
              <div
                className="input-group-text edit-tag-modal__color-picker-toggle"
                style={{ backgroundColor: color, borderColor: color }}
              >
                <FontAwesomeIcon icon={colorIcon} className="edit-tag-modal__color-icon" />
              </div>
            </div>
            <Popover isOpen={showColorPicker} toggle={toggleColorPicker} target="colorPickerBtn" placement="right">
              <ChromePicker color={color} disableAlpha onChange={({ hex }) => setColor(hex)} />
            </Popover>
            <input
              type="text"
              value={newTagName}
              placeholder="Tag"
              required
              className="form-control"
              onChange={(e) => setNewTagName(e.target.value)}
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
};

export default EditTagModal;
