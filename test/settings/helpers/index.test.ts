import { fromPartial } from '@total-typescript/shoehorn';
import { migrateDeprecatedSettings } from '../../../src/settings/helpers';
import type { RootState } from '../../../src/store';

describe('settings-helpers', () => {
  describe('migrateDeprecatedSettings', () => {
    it('returns object as is if settings are not set', () => {
      expect(migrateDeprecatedSettings({})).toEqual({});
    });

    it('updates settings as expected', () => {
      const state = fromPartial<RootState>({
        settings: {
          visits: {
            defaultInterval: 'last180days' as any,
          },
        },
      });

      expect(migrateDeprecatedSettings(state)).toEqual(
        expect.objectContaining({
          settings: expect.objectContaining({
            visits: {
              defaultInterval: 'last180Days',
            },
          }),
        }),
      );
    });
  });
});
