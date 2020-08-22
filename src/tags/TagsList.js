import React, { useEffect, useState } from 'react';
import { splitEvery } from 'ramda';
import PropTypes from 'prop-types';
import Message from '../utils/Message';
import SearchField from '../utils/SearchField';
import { serverType } from '../servers/prop-types';
import { MercureInfoType } from '../mercure/reducers/mercureInfo';
import { useMercureTopicBinding } from '../mercure/helpers';
import { TagsListType } from './reducers/tagsList';

const { ceil } = Math;
const TAGS_GROUPS_AMOUNT = 4;

const propTypes = {
  filterTags: PropTypes.func,
  forceListTags: PropTypes.func,
  tagsList: TagsListType,
  selectedServer: serverType,
  createNewVisit: PropTypes.func,
  loadMercureInfo: PropTypes.func,
  mercureInfo: MercureInfoType,
};

const TagsList = (TagCard) => {
  const TagListComp = (
    { filterTags, forceListTags, tagsList, selectedServer, createNewVisit, loadMercureInfo, mercureInfo },
  ) => {
    const [ displayedTag, setDisplayedTag ] = useState();

    useEffect(() => {
      forceListTags();
    }, []);
    useMercureTopicBinding(mercureInfo, 'https://shlink.io/new-visit', createNewVisit, loadMercureInfo);

    const renderContent = () => {
      if (tagsList.loading) {
        return <Message noMargin loading />;
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
        return <Message>No tags found</Message>;
      }

      const tagsGroups = splitEvery(ceil(tagsCount / TAGS_GROUPS_AMOUNT), tagsList.filteredTags);

      return (
        <React.Fragment>
          {tagsGroups.map((group, index) => (
            <div key={index} className="col-md-6 col-xl-3">
              {group.map((tag) => (
                <TagCard
                  key={tag}
                  tag={tag}
                  tagStats={tagsList.stats[tag]}
                  selectedServer={selectedServer}
                  displayed={displayedTag === tag}
                  toggle={() => setDisplayedTag(displayedTag !== tag ? tag : undefined)}
                />
              ))}
            </div>
          ))}
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        {!tagsList.loading && <SearchField className="mb-3" placeholder="Search tags..." onChange={filterTags} />}
        <div className="row">
          {renderContent()}
        </div>
      </React.Fragment>
    );
  };

  TagListComp.propTypes = propTypes;

  return TagListComp;
};

export default TagsList;
