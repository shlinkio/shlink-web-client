import { faPencilAlt as editIcon, faTrash as deleteIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem } from 'reactstrap';
import { RowDropdownBtn, useToggle } from '../../shlink-frontend-kit/src';
import { prettify } from '../utils/helpers/numbers';
import { useRoutesPrefix } from '../utils/routesPrefix';
import type { ColorGenerator } from '../utils/services/ColorGenerator';
import type { SimplifiedTag, TagModalProps } from './data';
import { TagBullet } from './helpers/TagBullet';

export interface TagsTableRowProps {
  tag: SimplifiedTag;
}

export const TagsTableRow = (
  DeleteTagConfirmModal: FC<TagModalProps>,
  EditTagModal: FC<TagModalProps>,
  colorGenerator: ColorGenerator,
) => ({ tag }: TagsTableRowProps) => {
  const [isDeleteModalOpen, toggleDelete] = useToggle();
  const [isEditModalOpen, toggleEdit] = useToggle();
  const routesPrefix = useRoutesPrefix();

  return (
    <tr className="responsive-table__row">
      <th className="responsive-table__cell" data-th="Tag">
        <TagBullet tag={tag.tag} colorGenerator={colorGenerator} /> {tag.tag}
      </th>
      <td className="responsive-table__cell text-lg-end" data-th="Short URLs">
        <Link to={`${routesPrefix}/list-short-urls/1?tags=${encodeURIComponent(tag.tag)}`}>
          {prettify(tag.shortUrls)}
        </Link>
      </td>
      <td className="responsive-table__cell text-lg-end" data-th="Visits">
        <Link to={`${routesPrefix}/tag/${tag.tag}/visits`}>
          {prettify(tag.visits)}
        </Link>
      </td>
      <td className="responsive-table__cell text-lg-end">
        <RowDropdownBtn>
          <DropdownItem onClick={toggleEdit}>
            <FontAwesomeIcon icon={editIcon} fixedWidth className="me-1" /> Edit
          </DropdownItem>
          <DropdownItem onClick={toggleDelete}>
            <FontAwesomeIcon icon={deleteIcon} fixedWidth className="me-1" /> Delete
          </DropdownItem>
        </RowDropdownBtn>
      </td>

      <EditTagModal tag={tag.tag} toggle={toggleEdit} isOpen={isEditModalOpen} />
      <DeleteTagConfirmModal tag={tag.tag} toggle={toggleDelete} isOpen={isDeleteModalOpen} />
    </tr>
  );
};
