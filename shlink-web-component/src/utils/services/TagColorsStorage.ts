export type TagColorsStorage = {
  getTagColors(): Record<string, string>;

  storeTagColors(colors: Record<string, string>): void;
};
