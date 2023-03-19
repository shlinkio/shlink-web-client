import type { ShlinkVisitsSummary } from '../../api/types';

export interface TagStats {
  shortUrlsCount: number;
  visitsCount: number;
  visitsSummary?: ShlinkVisitsSummary; // Optional only before Shlink 3.5.0
}

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
