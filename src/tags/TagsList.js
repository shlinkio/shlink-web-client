import React from 'react';
import { connect } from 'react-redux';
import { pick, splitEvery } from 'ramda';
import { listTags } from './reducers/tagsList';
import './TagsList.scss';
import { Card } from 'reactstrap';
import ColorGenerator from '../utils/ColorGenerator';

export class TagsList extends React.Component {
  componentDidMount() {
    const { listTags } = this.props;
    listTags();
  }

  render() {
    const { tagsList, colorGenerator } = this.props;
    const tagsCount = Math.round(tagsList.tags.length);
    if (tagsCount < 1) {
      return <div>No tags</div>;
    }

    const tagsGroups = splitEvery(Math.round(tagsCount / 4), tagsList.tags);

    return (
      <div className="shlink-container">
        <div className="row">
          {tagsGroups.map((group, index) => (
            <div key={index} className="col-md-6 col-xl-3">
              {group.map(tag => (
                <div
                  style={{ backgroundColor: colorGenerator.getColorForKey(tag) }}
                  className="tags-list__tag-container"
                >
                  <Card body className="tags-list__tag-card">
                    <h5 className="tags-list__tag-title">{tag}</h5>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

TagsList.defaultProps = {
  colorGenerator: ColorGenerator
};

export default connect(pick(['tagsList']), { listTags })(TagsList);
