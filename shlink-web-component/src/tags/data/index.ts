import type { ShlinkTagsStats } from '@shlinkio/shlink-web-component/api-contract';

export type TagStats = Omit<ShlinkTagsStats, 'tag'>;

export interface TagModalProps {
  tag: string;
  isOpen: boolean;
  toggle: () => void;
}

export interface SimplifiedTag {
  tag: string;
  shortUrls: number;
  visits: number;
}
