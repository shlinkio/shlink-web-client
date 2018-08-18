import { Card, CardBody } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import deleteIcon from '@fortawesome/fontawesome-free-solid/faTrash';
import editIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import DeleteTagConfirmModal from './helpers/DeleteTagConfirmModal';
import PropTypes from 'prop-types';
import React from 'react';
import ColorGenerator, { colorGeneratorType } from '../utils/ColorGenerator';
import './TagCard.scss';
import { Link } from 'react-router-dom';
import EditTagModal from './helpers/EditTagModal';

const propTypes = {
  tag: PropTypes.string,
  colorGenerator: colorGeneratorType,
};
const defaultProps = {
  colorGenerator: ColorGenerator,
};

export default class TagCard extends React.Component {
  state = { isDeleteModalOpen: false, isEditModalOpen: false };

  render() {
    const { tag, colorGenerator, currentServerId } = this.props;
    const toggleDelete = () =>
      this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen });
    const toggleEdit = () =>
      this.setState({ isEditModalOpen: !this.state.isEditModalOpen });

    return (
      <Card className="tag-card">
        <CardBody className="tag-card__body">
          <button
            className="btn btn-light btn-sm tag-card__btn tag-card__btn--last"
            onClick={toggleDelete}
          >
            <FontAwesomeIcon icon={deleteIcon}/>
          </button>
          <button
            className="btn btn-light btn-sm tag-card__btn"
            onClick={toggleEdit}
          >
            <FontAwesomeIcon icon={editIcon}/>
          </button>
          <h5 className="tag-card__tag-title">
            <div
              style={{backgroundColor: colorGenerator.getColorForKey(tag)}}
              className="tag-card__tag-bullet"
            />
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

TagCard.propTypes = propTypes;
TagCard.defaultProps = defaultProps;
