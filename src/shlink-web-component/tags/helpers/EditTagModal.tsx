import { faPalette as colorIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pipe } from 'ramda';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Popover } from 'reactstrap';
import { ShlinkApiError } from '../../../api/ShlinkApiError';
import { useToggle } from '../../../utils/helpers/hooks';
import { Result } from '../../../utils/Result';
import type { ColorGenerator } from '../../../utils/services/ColorGenerator';
import { handleEventPreventingDefault } from '../../../utils/utils';
import type { TagModalProps } from '../data';
import type { EditTag, TagEdition } from '../reducers/tagEdit';
import './EditTagModal.scss';

interface EditTagModalProps extends TagModalProps {
  tagEdit: TagEdition;
  editTag: (editTag: EditTag) => Promise<void>;
  tagEdited: (tagEdited: EditTag) => void;
}

export const EditTagModal = ({ getColorForKey }: ColorGenerator) => (
  { tag, editTag, toggle, tagEdited, isOpen, tagEdit }: EditTagModalProps,
) => {
  const [newTagName, setNewTagName] = useState(tag);
  const [color, setColor] = useState(getColorForKey(tag));
  const [showColorPicker, toggleColorPicker, , hideColorPicker] = useToggle();
  const { editing, error, edited, errorData } = tagEdit;
  const saveTag = handleEventPreventingDefault(
    async () => {
      await editTag({ oldName: tag, newName: newTagName, color });
      toggle();
    },
  );
  const onClosed = pipe(hideColorPicker, () => edited && tagEdited({ oldName: tag, newName: newTagName, color }));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered onClosed={onClosed}>
      <form name="editTag" onSubmit={saveTag}>
        <ModalHeader toggle={toggle}>Edit tag</ModalHeader>
        <ModalBody>
          <InputGroup>
            <div
              id="colorPickerBtn"
              className="input-group-text edit-tag-modal__color-picker-toggle"
              style={{ backgroundColor: color, borderColor: color }}
              onClick={toggleColorPicker}
            >
              <FontAwesomeIcon icon={colorIcon} className="edit-tag-modal__color-icon" />
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
          </InputGroup>

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
