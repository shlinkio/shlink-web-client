import React from 'react';
import { connect } from 'react-redux';
import { pick, splitEvery } from 'ramda';
import { listTags } from './reducers/tagsList';
import MuttedMessage from '../utils/MuttedMessage';
import TagCard from './TagCard';

const { round } = Math;

export class TagsList extends React.Component {
  state = { isDeleteModalOpen: false };

  componentDidMount() {
    const { listTags } = this.props;
    listTags();
  }

  renderContent() {
    const { tagsList, match } = this.props;
    if (tagsList.loading) {
      return <MuttedMessage marginSize={0}>Loading...</MuttedMessage>
    }

    if (tagsList.error) {
      return (
        <div className="col-12">
          <div className="bg-danger p-2 text-white text-center">Error loading tags :(</div>
        </div>
      );
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
              <TagCard
                key={tag}
                tag={tag}
                currentServerId={match.params.serverId}
              />
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

export default connect(pick(['tagsList']), { listTags })(TagsList);
