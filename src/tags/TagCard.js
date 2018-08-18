import { Card, CardBody } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import deleteIcon from '@fortawesome/fontawesome-free-solid/faTrash';
import editIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import DeleteTagConfirmModal from './helpers/DeleteTagConfirmModal';
import PropTypes from 'prop-types';
import React from 'react';
import ColorGenerator, { colorGeneratorType } from '../utils/ColorGenerator';
import './TagCard.scss';

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
    const { tag, colorGenerator } = this.props;
    const toggleDelete = () =>
      this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen });

    return (
      <Card className="tag-card">
        <CardBody className="tag-card__body">
          <button
            className="btn btn-light btn-sm tag-card__btn"
            onClick={toggleDelete}
          >
            <FontAwesomeIcon icon={deleteIcon}/>
          </button>
          <button className="btn btn-light btn-sm tag-card__btn">
            <FontAwesomeIcon icon={editIcon}/>
          </button>
          <h5 className="tag-card__tag-title">
            <div
              style={{backgroundColor: colorGenerator.getColorForKey(tag)}}
              className="tag-card__tag-bullet"
            />
            {tag}
          </h5>
        </CardBody>

        <DeleteTagConfirmModal
          tag={tag}
          toggle={toggleDelete}
          isOpen={this.state.isDeleteModalOpen}
        />
      </Card>
    );
  }
}

TagCard.propTypes = propTypes;
TagCard.defaultProps = defaultProps;
