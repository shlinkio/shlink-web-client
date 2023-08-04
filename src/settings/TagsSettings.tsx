import type { FC } from 'react';
import { LabeledFormGroup, OrderingDropdown, SimpleCard } from '../../shlink-frontend-kit/src';
import type { Settings, TagsSettings as TagsSettingsOptions } from '../../shlink-web-component/src';
import { TAGS_ORDERABLE_FIELDS } from '../../shlink-web-component/src/tags/data/TagsListChildrenProps';

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
