import { FC } from 'react';
import { SimpleCard } from '../utils/SimpleCard';
import ColorGenerator from '../utils/services/ColorGenerator';
import { TagsListChildrenProps } from './data/TagsListChildrenProps';
import { TagsTableRowProps } from './TagsTableRow';

export const TagsTable = (colorGenerator: ColorGenerator, TagsTableRow: FC<TagsTableRowProps>) => (
  { tagsList, selectedServer }: TagsListChildrenProps,
) => (
  <SimpleCard>
    <table className="table table-hover mb-0">
      <thead className="responsive-table__header">
        <tr>
          <th>Tag</th>
          <th className="text-lg-right">Short URLs</th>
          <th className="text-lg-right">Visits</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {tagsList.filteredTags.length === 0 && <tr><td colSpan={4} className="text-center">No results found</td></tr>}
        {tagsList.filteredTags.map((tag) => (
          <TagsTableRow
            key={tag}
            tag={tag}
            tagStats={tagsList.stats[tag]}
            selectedServer={selectedServer}
            colorGenerator={colorGenerator}
          />
        ))}
      </tbody>
    </table>
  </SimpleCard>
);
