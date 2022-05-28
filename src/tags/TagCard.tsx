import { Card, CardHeader, CardBody, Button, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash as deleteIcon, faPencilAlt as editIcon, faLink, faEye } from '@fortawesome/free-solid-svg-icons';
import { FC, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { prettify } from '../utils/helpers/numbers';
import { useToggle } from '../utils/helpers/hooks';
import { ColorGenerator } from '../utils/services/ColorGenerator';
import { getServerId, SelectedServer } from '../servers/data';
import { TagBullet } from './helpers/TagBullet';
import { NormalizedTag, TagModalProps } from './data';
import './TagCard.scss';

export interface TagCardProps {
  tag: NormalizedTag;
  selectedServer: SelectedServer;
  displayed: boolean;
  toggle: () => void;
}

const isTruncated = (el: HTMLElement | undefined): boolean => !!el && el.scrollWidth > el.clientWidth;

export const TagCard = (
  DeleteTagConfirmModal: FC<TagModalProps>,
  EditTagModal: FC<TagModalProps>,
  colorGenerator: ColorGenerator,
) => ({ tag, selectedServer, displayed, toggle }: TagCardProps) => {
  const [isDeleteModalOpen, toggleDelete] = useToggle();
  const [isEditModalOpen, toggleEdit] = useToggle();
  const [hasTitle,, displayTitle] = useToggle();
  const titleRef = useRef<HTMLElement>();
  const serverId = getServerId(selectedServer);

  useEffect(() => {
    if (isTruncated(titleRef.current)) {
      displayTitle();
    }
  }, [titleRef.current]);

  return (
    <Card className="tag-card">
      <CardHeader className="tag-card__header">
        <Button
          aria-label="Delete tag"
          color="link"
          size="sm"
          className="tag-card__btn tag-card__btn--last"
          onClick={toggleDelete}
        >
          <FontAwesomeIcon icon={deleteIcon} />
        </Button>
        <Button aria-label="Edit tag" color="link" size="sm" className="tag-card__btn" onClick={toggleEdit}>
          <FontAwesomeIcon icon={editIcon} />
        </Button>
        <h5
          className="tag-card__tag-title text-ellipsis"
          title={hasTitle ? tag.tag : undefined}
          ref={(el) => {
            titleRef.current = el ?? undefined;
          }}
        >
          <TagBullet tag={tag.tag} colorGenerator={colorGenerator} />
          <span className="tag-card__tag-name" onClick={toggle}>{tag.tag}</span>
        </h5>
      </CardHeader>

      <Collapse isOpen={displayed}>
        <CardBody className="tag-card__body">
          <Link
            to={`/server/${serverId}/list-short-urls/1?tags=${encodeURIComponent(tag.tag)}`}
            className="btn btn-outline-secondary btn-block d-flex justify-content-between align-items-center mb-1"
          >
            <span className="text-ellipsis"><FontAwesomeIcon icon={faLink} className="me-2" />Short URLs</span>
            <b>{prettify(tag.shortUrls)}</b>
          </Link>
          <Link
            to={`/server/${serverId}/tag/${tag.tag}/visits`}
            className="btn btn-outline-secondary btn-block d-flex justify-content-between align-items-center"
          >
            <span className="text-ellipsis"><FontAwesomeIcon icon={faEye} className="me-2" />Visits</span>
            <b>{prettify(tag.visits)}</b>
          </Link>
        </CardBody>
      </Collapse>

      <DeleteTagConfirmModal tag={tag.tag} toggle={toggleDelete} isOpen={isDeleteModalOpen} />
      <EditTagModal tag={tag.tag} toggle={toggleEdit} isOpen={isEditModalOpen} />
    </Card>
  );
};
