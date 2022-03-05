import { FC } from 'react';
import { SimpleCard } from '../utils/SimpleCard';
import { TagsModeDropdown } from '../tags/TagsModeDropdown';
import { capitalize } from '../utils/utils';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { TAGS_ORDERABLE_FIELDS } from '../tags/data/TagsListChildrenProps';
import { FormText } from '../utils/forms/FormText';
import { LabeledFormGroup } from '../utils/forms/LabeledFormGroup';
import { Settings, TagsSettings as TagsSettingsOptions } from './reducers/settings';

interface TagsProps {
  settings: Settings;
  setTagsSettings: (settings: TagsSettingsOptions) => void;
}

export const TagsSettings: FC<TagsProps> = ({ settings: { tags }, setTagsSettings }) => (
  <SimpleCard title="Tags" className="h-100">
    <LabeledFormGroup label="Default display mode when managing tags:">
      <TagsModeDropdown
        mode={tags?.defaultMode ?? 'cards'}
        renderTitle={(tagsMode) => capitalize(tagsMode)}
        onChange={(defaultMode) => setTagsSettings({ ...tags, defaultMode })}
      />
      <FormText>Tags will be displayed as <b>{tags?.defaultMode ?? 'cards'}</b>.</FormText>
    </LabeledFormGroup>
    <LabeledFormGroup noMargin label="Default ordering for tags list:">
      <OrderingDropdown
        items={TAGS_ORDERABLE_FIELDS}
        order={tags?.defaultOrdering ?? {}}
        onChange={(field, dir) => setTagsSettings({ ...tags, defaultOrdering: { field, dir } })}
      />
    </LabeledFormGroup>
  </SimpleCard>
);
