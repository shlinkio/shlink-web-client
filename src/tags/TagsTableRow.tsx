import { faPencilAlt as editIcon, faTrash as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem } from 'reactstrap';
import type { SelectedServer } from '../servers/data';
import { getServerId } from '../servers/data';
import { DropdownBtnMenu } from '../utils/DropdownBtnMenu';
import { useToggle } from '../utils/helpers/hooks';
import { prettify } from '../utils/helpers/numbers';
import type { ColorGenerator } from '../utils/services/ColorGenerator';
import type { SimplifiedTag, TagModalProps } from './data';
import { TagBullet } from './helpers/TagBullet';

export interface TagsTableRowProps {
  tag: SimplifiedTag;
  selectedServer: SelectedServer;
}

export const TagsTableRow = (
  DeleteTagConfirmModal: FC<TagModalProps>,
  EditTagModal: FC<TagModalProps>,
  colorGenerator: ColorGenerator,
) => ({ tag, selectedServer }: TagsTableRowProps) => {
  const [isDeleteModalOpen, toggleDelete] = useToggle();
  const [isEditModalOpen, toggleEdit] = useToggle();
  const [isDropdownOpen, toggleDropdown] = useToggle();
  const serverId = getServerId(selectedServer);

  return (
    <tr className="responsive-table__row">
      <th className="responsive-table__cell" data-th="Tag">
        <TagBullet tag={tag.tag} colorGenerator={colorGenerator} /> {tag.tag}
      </th>
      <td className="responsive-table__cell text-lg-end" data-th="Short URLs">
        <Link to={`/server/${serverId}/list-short-urls/1?tags=${encodeURIComponent(tag.tag)}`}>
          {prettify(tag.shortUrls)}
        </Link>
      </td>
      <td className="responsive-table__cell text-lg-end" data-th="Visits">
        <Link to={`/server/${serverId}/tag/${tag.tag}/visits`}>
          {prettify(tag.visits)}
        </Link>
      </td>
      <td className="responsive-table__cell text-lg-end">
        <DropdownBtnMenu toggle={toggleDropdown} isOpen={isDropdownOpen}>
          <DropdownItem onClick={toggleEdit}>
            <FontAwesomeIcon icon={editIcon} fixedWidth className="me-1" /> Edit
          </DropdownItem>
          <DropdownItem onClick={toggleDelete}>
            <FontAwesomeIcon icon={deleteIcon} fixedWidth className="me-1" /> Delete
          </DropdownItem>
        </DropdownBtnMenu>
      </td>

      <EditTagModal tag={tag.tag} toggle={toggleEdit} isOpen={isEditModalOpen} />
      <DeleteTagConfirmModal tag={tag.tag} toggle={toggleDelete} isOpen={isDeleteModalOpen} />
    </tr>
  );
};
