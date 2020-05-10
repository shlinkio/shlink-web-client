import { Card, CardHeader, CardBody, Button, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash as deleteIcon, faPencilAlt as editIcon, faLink, faEye } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { serverType } from '../servers/prop-types';
import { prettify } from '../utils/helpers/numbers';
import TagBullet from './helpers/TagBullet';
import './TagCard.scss';

const TagCard = (
  DeleteTagConfirmModal,
  EditTagModal,
  ForServerVersion,
  colorGenerator
) => class TagCard extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    tagStats: PropTypes.shape({
      shortUrlsCount: PropTypes.number,
      visitsCount: PropTypes.number,
    }),
    selectedServer: serverType,
    displayed: PropTypes.bool,
    toggle: PropTypes.func,
  };

  state = { isDeleteModalOpen: false, isEditModalOpen: false };

  render() {
    const { tag, tagStats, selectedServer, displayed, toggle } = this.props;
    const { id } = selectedServer;
    const shortUrlsLink = `/server/${id}/list-short-urls/1?tag=${tag}`;

    const toggleDelete = () =>
      this.setState(({ isDeleteModalOpen }) => ({ isDeleteModalOpen: !isDeleteModalOpen }));
    const toggleEdit = () =>
      this.setState(({ isEditModalOpen }) => ({ isEditModalOpen: !isEditModalOpen }));

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
                to={`/server/${id}/tags/${tag}/visits`}
                className="btn btn-light btn-block d-flex justify-content-between align-items-center"
              >
                <span className="text-ellipsis"><FontAwesomeIcon icon={faEye} className="mr-2" />Visits</span>
                <b>{prettify(tagStats.visitsCount)}</b>
              </Link>
            </CardBody>
          </Collapse>
        )}

        <DeleteTagConfirmModal tag={tag} toggle={toggleDelete} isOpen={this.state.isDeleteModalOpen} />
        <EditTagModal tag={tag} toggle={toggleEdit} isOpen={this.state.isEditModalOpen} />
      </Card>
    );
  }
};

export default TagCard;
