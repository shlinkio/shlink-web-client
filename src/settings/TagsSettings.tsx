import { FC } from 'react';
import { SimpleCard } from '../utils/SimpleCard';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { TAGS_ORDERABLE_FIELDS } from '../tags/data/TagsListChildrenProps';
import { LabeledFormGroup } from '../utils/forms/LabeledFormGroup';
import { Settings, TagsSettings as TagsSettingsOptions } from './reducers/settings';

interface TagsProps {
  settings: Settings;
  setTagsSettings: (settings: TagsSettingsOptions) => void;
}

export const TagsSettings: FC<TagsProps> = ({ settings: { tags }, setTagsSettings }) => (
  <SimpleCard title="Tags" className="h-100">
    <LabeledFormGroup noMargin label="Default ordering for tags list:">
      <OrderingDropdown
        items={TAGS_ORDERABLE_FIELDS}
        order={tags?.defaultOrdering ?? {}}
        onChange={(field, dir) => setTagsSettings({ ...tags, defaultOrdering: { field, dir } })}
      />
    </LabeledFormGroup>
  </SimpleCard>
);
