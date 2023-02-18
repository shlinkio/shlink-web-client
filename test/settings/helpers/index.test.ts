import { Mock } from 'ts-mockery';
import { migrateDeprecatedSettings } from '../../../src/settings/helpers';
import type { ShlinkState } from '../../../src/container/types';

describe('settings-helpers', () => {
  describe('migrateDeprecatedSettings', () => {
    it('returns object as is if settings are not set', () => {
      expect(migrateDeprecatedSettings({})).toEqual({});
    });

    it('updates settings as expected', () => {
      const state = Mock.of<ShlinkState>({
        settings: {
          visits: {
            defaultInterval: 'last180days' as any,
          },
        },
      });

      expect(migrateDeprecatedSettings(state)).toEqual(expect.objectContaining({
        settings: expect.objectContaining({
          visits: {
            defaultInterval: 'last180Days',
          },
        }),
      }));
    });
  });
});
