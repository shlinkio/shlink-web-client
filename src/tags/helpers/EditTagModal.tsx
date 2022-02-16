import { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Popover } from 'reactstrap';
import { HexColorPicker } from 'react-colorful';
import { faPalette as colorIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '../../utils/helpers/hooks';
import { handleEventPreventingDefault } from '../../utils/utils';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { TagModalProps } from '../data';
import { TagEdition } from '../reducers/tagEdit';
import { Result } from '../../utils/Result';
import { ShlinkApiError } from '../../api/ShlinkApiError';
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
  const [ showColorPicker, toggleColorPicker, , hideColorPicker ] = useToggle();
  const { editing, error, errorData } = tagEdit;
  const saveTag = handleEventPreventingDefault(
    async () => editTag(tag, newTagName, color)
      .then(() => tagEdited(tag, newTagName, color))
      .then(toggle)
      .catch(() => {}),
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered onClosed={hideColorPicker}>
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
            <Popover
              isOpen={showColorPicker}
              toggle={toggleColorPicker}
              target="colorPickerBtn"
              placement="right"
              hideArrow
              popperClassName="edit-tag-modal__popover"
            >
              <HexColorPicker color={color} onChange={setColor} />
            </Popover>
            <Input
              value={newTagName}
              placeholder="Tag"
              required
              onChange={({ target }) => setNewTagName(target.value)}
            />
          </div>

          {error && (
            <Result type="error" small className="mt-2">
              <ShlinkApiError errorData={errorData} fallbackMessage="Something went wrong while editing the tag :(" />
            </Result>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="link" onClick={toggle}>Cancel</Button>
          <Button color="primary" disabled={editing}>{editing ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default EditTagModal;
