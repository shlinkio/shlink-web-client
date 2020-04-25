const SETTINGS_STORAGE_KEY = 'settings';

export default class SettingsService {
  constructor(storage) {
    this.storage = storage;
  }

  loadSettings = () => this.storage.get(SETTINGS_STORAGE_KEY) || {};

  updateSettings = (settingsToUpdate) => this.storage.set(SETTINGS_STORAGE_KEY, {
    ...this.loadSettings(),
    ...settingsToUpdate,
  })
}
