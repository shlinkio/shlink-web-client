import type { TagColorsStorage as BaseTagColorsStorage } from '@shlinkio/shlink-web-component';
import type { LocalStorage } from './LocalStorage';

export class TagColorsStorage implements BaseTagColorsStorage {
  constructor(private readonly storage: LocalStorage) {}

  getTagColors(): Record<string, string> {
    return this.storage.get<Record<string, string>>('colors') ?? {};
  }

  storeTagColors(colors: Record<string, string>): void {
    this.storage.set('colors', colors);
  }
}
