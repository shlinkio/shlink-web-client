import { Card, CardHeader, CardBody, Button, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash as deleteIcon, faPencilAlt as editIcon, faLink, faEye } from '@fortawesome/free-solid-svg-icons';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { prettify } from '../utils/helpers/numbers';
import { useToggle } from '../utils/helpers/hooks';
import { Versions } from '../utils/helpers/version';
import ColorGenerator from '../utils/services/ColorGenerator';
import { isServerWithId, SelectedServer } from '../servers/data';
import TagBullet from './helpers/TagBullet';
import { TagModalProps, TagStats } from './data';
import './TagCard.scss';

export interface TagCardProps {
  tag: string;
  tagStats?: TagStats;
  selectedServer: SelectedServer;
  displayed: boolean;
  toggle: () => void;
}

const TagCard = (
  DeleteTagConfirmModal: FC<TagModalProps>,
  EditTagModal: FC<TagModalProps>,
  ForServerVersion: FC<Versions>,
  colorGenerator: ColorGenerator,
) => ({ tag, tagStats, selectedServer, displayed, toggle }: TagCardProps) => {
  const [ isDeleteModalOpen, toggleDelete ] = useToggle();
  const [ isEditModalOpen, toggleEdit ] = useToggle();

  const serverId = isServerWithId(selectedServer) ? selectedServer.id : '';
  const shortUrlsLink = `/server/${serverId}/list-short-urls/1?tag=${tag}`;

  return (
    <Card className="tag-card">
      <CardHeader className="tag-card__header">
        <Button color="light" size="sm" className="tag-card__btn tag-card__btn--last" onClick={toggleDelete}>
          <FontAwesomeIcon icon={deleteIcon} />
        </Button>
        <Button color="light" size="sm" className="tag-card__btn" onClick={toggleEdit}>
          <FontAwesomeIcon icon={editIcon} />
        </Button>
        <h5 className="tag-card__tag-title text-ellipsis">
          <TagBullet tag={tag} colorGenerator={colorGenerator} />
          <ForServerVersion minVersion="2.2.0">
            <span className="tag-card__tag-name" onClick={toggle}>{tag}</span>
          </ForServerVersion>
          <ForServerVersion maxVersion="2.1.*">
            <Link to={shortUrlsLink}>{tag}</Link>
          </ForServerVersion>
        </h5>
      </CardHeader>

      {tagStats && (
        <Collapse isOpen={displayed}>
          <CardBody className="tag-card__body">
            <Link
              to={shortUrlsLink}
              className="btn btn-light btn-block d-flex justify-content-between align-items-center mb-1"
            >
              <span className="text-ellipsis"><FontAwesomeIcon icon={faLink} className="mr-2" />Short URLs</span>
              <b>{prettify(tagStats.shortUrlsCount)}</b>
            </Link>
            <Link
              to={`/server/${serverId}/tag/${tag}/visits`}
              className="btn btn-light btn-block d-flex justify-content-between align-items-center"
            >
              <span className="text-ellipsis"><FontAwesomeIcon icon={faEye} className="mr-2" />Visits</span>
              <b>{prettify(tagStats.visitsCount)}</b>
            </Link>
          </CardBody>
        </Collapse>
      )}

      <DeleteTagConfirmModal tag={tag} toggle={toggleDelete} isOpen={isDeleteModalOpen} />
      <EditTagModal tag={tag} toggle={toggleEdit} isOpen={isEditModalOpen} />
    </Card>
  );
};

export default TagCard;
