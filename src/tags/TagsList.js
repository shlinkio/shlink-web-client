import React from 'react';
import { connect } from 'react-redux';
import { pick, splitEvery } from 'ramda';
import PropTypes from 'prop-types';
import MuttedMessage from '../utils/MuttedMessage';
import SearchField from '../utils/SearchField';
import { filterTags, listTags } from './reducers/tagsList';
import TagCard from './TagCard';

const { ceil } = Math;
const TAGS_GROUP_SIZE = 4;

export class TagsListComponent extends React.Component {
  static propTypes = {
    filterTags: PropTypes.func,
    listTags: PropTypes.func,
    tagsList: PropTypes.shape({
      loading: PropTypes.bool,
    }),
    match: PropTypes.object,
  };

  componentDidMount() {
    const { listTags } = this.props;

    listTags();
  }

  renderContent() {
    const { tagsList, match } = this.props;

    if (tagsList.loading) {
      return <MuttedMessage marginSize={0}>Loading...</MuttedMessage>;
    }

    if (tagsList.error) {
      return (
        <div className="col-12">
          <div className="bg-danger p-2 text-white text-center">Error loading tags :(</div>
        </div>
      );
    }

    const tagsCount = tagsList.filteredTags.length;

    if (tagsCount < 1) {
      return <MuttedMessage>No tags found</MuttedMessage>;
    }

    const tagsGroups = splitEvery(ceil(tagsCount / TAGS_GROUP_SIZE), tagsList.filteredTags);

    return (
      <React.Fragment>
        {tagsGroups.map((group, index) => (
          <div key={index} className="col-md-6 col-xl-3">
            {group.map((tag) => (
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
    const { filterTags } = this.props;

    return (
      <div className="shlink-container">
        {!this.props.tagsList.loading && (
          <SearchField
            className="mb-3"
            placeholder="Search tags..."
            onChange={filterTags}
          />
        )}
        <div className="row">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const TagsList = connect(pick([ 'tagsList' ]), { listTags, filterTags })(TagsListComponent);

export default TagsList;
