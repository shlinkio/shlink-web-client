import { FC, useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import Message from '../utils/Message';
import SearchField from '../utils/SearchField';
import { SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { Topics } from '../mercure/helpers/Topics';
import { Settings, TagsMode } from '../settings/reducers/settings';
import { TagsList as TagsListState } from './reducers/tagsList';
import { TagsListChildrenProps } from './data/TagsListChildrenProps';
import { TagsModeDropdown } from './TagsModeDropdown';

export interface TagsListProps {
  filterTags: (searchTerm: string) => void;
  forceListTags: Function;
  tagsList: TagsListState;
  selectedServer: SelectedServer;
  settings: Settings;
}

const TagsList = (TagsCards: FC<TagsListChildrenProps>, TagsTable: FC<TagsListChildrenProps>) => boundToMercureHub((
  { filterTags, forceListTags, tagsList, selectedServer, settings }: TagsListProps,
) => {
  const [ mode, setMode ] = useState<TagsMode>(settings.ui?.tagsMode ?? 'cards');

  useEffect(() => {
    forceListTags();
  }, []);

  if (tagsList.loading) {
    return <Message loading />;
  }

  const renderContent = () => {
    if (tagsList.error) {
      return (
        <Result type="error">
          <ShlinkApiError errorData={tagsList.errorData} fallbackMessage="Error loading tags :(" />
        </Result>
      );
    }

    if (tagsList.filteredTags.length < 1) {
      return <Message>No tags found</Message>;
    }

    return mode === 'cards'
      ? <TagsCards tagsList={tagsList} selectedServer={selectedServer} />
      : <TagsTable tagsList={tagsList} selectedServer={selectedServer} />;
  };

  return (
    <>
      <SearchField className="mb-3" onChange={filterTags} />
      <Row className="mb-3">
        <div className="col-lg-6 offset-lg-6">
          <TagsModeDropdown mode={mode} onChange={setMode} />
        </div>
      </Row>
      {renderContent()}
    </>
  );
}, () => [ Topics.visits ]);

export default TagsList;
