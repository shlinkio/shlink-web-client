export interface TagStats {
  shortUrlsCount: number;
  visitsCount: number;
}

export interface TagModalProps {
  tag: string;
  isOpen: boolean;
  toggle: () => void;
}

export interface NormalizedTag {
  tag: string;
  shortUrls: number;
  visits: number;
}
