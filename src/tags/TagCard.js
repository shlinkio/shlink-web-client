import { Card, CardBody } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import deleteIcon from '@fortawesome/fontawesome-free-solid/faTrash';
import editIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import TagBullet from '../utils/TagBullet';
import './TagCard.scss';
import DeleteTagConfirmModal from './helpers/DeleteTagConfirmModal';
import EditTagModal from './helpers/EditTagModal';

export default class TagCard extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    currentServerId: PropTypes.string,
  };

  state = { isDeleteModalOpen: false, isEditModalOpen: false };

  render() {
    const { tag, currentServerId } = this.props;
    const toggleDelete = () =>
      this.setState(({ isDeleteModalOpen }) => ({ isDeleteModalOpen: !isDeleteModalOpen }));
    const toggleEdit = () =>
      this.setState(({ isEditModalOpen }) => ({ isEditModalOpen: !isEditModalOpen }));

    return (
      <Card className="tag-card">
        <CardBody className="tag-card__body">
          <button
            className="btn btn-light btn-sm tag-card__btn tag-card__btn--last"
            onClick={toggleDelete}
          >
            <FontAwesomeIcon icon={deleteIcon} />
          </button>
          <button
            className="btn btn-light btn-sm tag-card__btn"
            onClick={toggleEdit}
          >
            <FontAwesomeIcon icon={editIcon} />
          </button>
          <h5 className="tag-card__tag-title">
            <TagBullet tag={tag} />
            <Link to={`/server/${currentServerId}/list-short-urls/1?tag=${tag}`}>
              {tag}
            </Link>
          </h5>
        </CardBody>

        <DeleteTagConfirmModal
          tag={tag}
          toggle={toggleDelete}
          isOpen={this.state.isDeleteModalOpen}
        />
        <EditTagModal
          tag={tag}
          toggle={toggleEdit}
          isOpen={this.state.isEditModalOpen}
        />
      </Card>
    );
  }
}
