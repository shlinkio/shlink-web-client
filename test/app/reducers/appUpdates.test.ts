import { appUpdateAvailable, appUpdatesReducer, resetAppUpdate } from '../../../src/app/reducers/appUpdates';

describe('appUpdatesReducer', () => {
  describe('reducer', () => {
    it('returns true on APP_UPDATE_AVAILABLE', () => {
      expect(appUpdatesReducer(undefined, { type: appUpdateAvailable.toString() })).toEqual(true);
    });

    it('returns false on RESET_APP_UPDATE', () => {
      expect(appUpdatesReducer(undefined, { type: resetAppUpdate.toString() })).toEqual(false);
    });
  });

  describe('appUpdateAvailable', () => {
    it('creates expected action', () => {
      expect(appUpdateAvailable()).toEqual({ type: appUpdateAvailable.toString() });
    });
  });

  describe('resetAppUpdate', () => {
    it('creates expected action', () => {
      expect(resetAppUpdate()).toEqual({ type: resetAppUpdate.toString() });
    });
  });
});
