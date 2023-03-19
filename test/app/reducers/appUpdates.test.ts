import { appUpdateAvailable, appUpdatesReducer, resetAppUpdate } from '../../../src/app/reducers/appUpdates';

describe('appUpdatesReducer', () => {
  describe('reducer', () => {
    it('returns true on APP_UPDATE_AVAILABLE', () => {
      expect(appUpdatesReducer(undefined, appUpdateAvailable())).toEqual(true);
    });

    it('returns false on RESET_APP_UPDATE', () => {
      expect(appUpdatesReducer(undefined, resetAppUpdate())).toEqual(false);
    });
  });
});
