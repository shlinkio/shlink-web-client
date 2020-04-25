import SettingsService from '../../../src/settings/services/SettingsService';

describe('SettingsService', () => {
  const settings = { foo: 'bar' };
  const createService = (withSettings = true) => {
    const storageMock = {
      set: jest.fn(),
      get: jest.fn(() => withSettings ? settings : undefined),
    };
    const service = new SettingsService(storageMock);

    return [ service, storageMock ];
  };

  afterEach(jest.resetAllMocks);

  describe('loadSettings', () => {
    it.each([
      [ false, {}],
      [ true, settings ],
    ])('returns result if found in storage', (withSettings, expectedResult) => {
      const [ service, storageMock ] = createService(withSettings);

      const result = service.loadSettings();

      expect(result).toEqual(expectedResult);
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });
  });

  describe('updateSettings', () => {
    it.each([
      [ false, { hi: 'goodbye' }, { hi: 'goodbye' }],
      [ true, { hi: 'goodbye' }, { foo: 'bar', hi: 'goodbye' }],
      [ true, { foo: 'goodbye' }, { foo: 'goodbye' }],
    ])('appends provided data to existing settings', (withSettings, settingsToUpdate, expectedResult) => {
      const [ service, storageMock ] = createService(withSettings);

      service.updateSettings(settingsToUpdate);

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledWith(expect.anything(), expectedResult);
    });
  });
});
