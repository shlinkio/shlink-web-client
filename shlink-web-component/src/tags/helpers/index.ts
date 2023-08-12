const ONE_OR_MORE_SPACES_REGEX = /\s+/g;

export const normalizeTag = (tag: string) => tag.trim().toLowerCase().replace(ONE_OR_MORE_SPACES_REGEX, '-');
