import React from 'react';
import { connect } from 'react-redux';
import { pick, splitEvery } from 'ramda';
import { listTags } from './reducers/tagsList';
import { Card, CardBody } from 'reactstrap';
import ColorGenerator from '../utils/ColorGenerator';
import MuttedMessage from '../utils/MuttedMessage';
import editIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import deleteIcon from '@fortawesome/fontawesome-free-solid/faTrash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './TagsList.scss';

const { round } = Math;

export class TagsList extends React.Component {
  componentDidMount() {
    const { listTags } = this.props;
    listTags();
  }

  renderContent() {
    const { tagsList, colorGenerator } = this.props;
    if (tagsList.loading) {
      return <MuttedMessage marginSize={0}>Loading...</MuttedMessage>
    }

    if (tagsList.error) {
      return <div className="bg-danger p-2 text-white text-center">Error loading tags :(</div>;
    }

    const tagsCount = tagsList.tags.length;
    if (tagsCount < 1) {
      return <MuttedMessage>No tags found</MuttedMessage>;
    }

    const tagsGroups = splitEvery(round(tagsCount / 4), tagsList.tags);
    return (
      <React.Fragment>
        {tagsGroups.map((group, index) => (
          <div key={index} className="col-md-6 col-xl-3">
            {group.map(tag => (
              <Card className="tags-list__tag-card" key={tag}>
                <CardBody className="tags-list__tag-card-body">
                  <button className="btn btn-light btn-sm tags-list__btn">
                    <FontAwesomeIcon icon={deleteIcon} />
                  </button>
                  <button className="btn btn-light btn-sm tags-list__btn">
                    <FontAwesomeIcon icon={editIcon} />
                  </button>
                  <h5 className="tags-list__tag-title">
                    <div
                      style={{ backgroundColor: colorGenerator.getColorForKey(tag) }}
                      className="tags-list__tag-bullet"
                    />
                    {tag}
                  </h5>
                </CardBody>
              </Card>
            ))}
          </div>
        ))}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="shlink-container">
        <div className="row">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

TagsList.defaultProps = {
  colorGenerator: ColorGenerator
};

export default connect(pick(['tagsList']), { listTags })(TagsList);
