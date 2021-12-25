import { FC } from 'react';
import { FormGroup } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';
import { TagsModeDropdown } from '../tags/TagsModeDropdown';
import { capitalize } from '../utils/utils';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { TAGS_ORDERABLE_FIELDS } from '../tags/data/TagsListChildrenProps';
import { Settings, TagsSettings } from './reducers/settings';

interface TagsProps {
  settings: Settings;
  setTagsSettings: (settings: TagsSettings) => void;
}

export const Tags: FC<TagsProps> = ({ settings: { tags }, setTagsSettings }) => (
  <SimpleCard title="Tags" className="h-100">
    <FormGroup>
      <label>Default display mode when managing tags:</label>
      <TagsModeDropdown
        mode={tags?.defaultMode ?? 'cards'}
        renderTitle={(tagsMode) => capitalize(tagsMode)}
        onChange={(defaultMode) => setTagsSettings({ ...tags, defaultMode })}
      />
      <small className="form-text text-muted">Tags will be displayed as <b>{tags?.defaultMode ?? 'cards'}</b>.</small>
    </FormGroup>
    <FormGroup className="mb-0">
      <label>Default ordering for tags list:</label>
      <OrderingDropdown
        items={TAGS_ORDERABLE_FIELDS}
        order={tags?.defaultOrdering ?? {}}
        onChange={(field, dir) => setTagsSettings({ ...tags, defaultOrdering: { field, dir } })}
      />
    </FormGroup>
  </SimpleCard>
);
