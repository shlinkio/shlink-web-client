import type { ShlinkCreateShortUrlData } from '@shlinkio/shlink-web-component/api-contract';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { ShortUrlCreationSettings } from '../utils/settings';
import { useSetting } from '../utils/settings';
import type { CreateShortUrlResultProps } from './helpers/CreateShortUrlResult';
import type { ShortUrlCreation } from './reducers/shortUrlCreation';
import type { ShortUrlFormProps } from './ShortUrlForm';

export interface CreateShortUrlProps {
  basicMode?: boolean;
}

interface CreateShortUrlConnectProps extends CreateShortUrlProps {
  shortUrlCreation: ShortUrlCreation;
  createShortUrl: (data: ShlinkCreateShortUrlData) => Promise<void>;
  resetCreateShortUrl: () => void;
}

const getInitialState = (settings?: ShortUrlCreationSettings): ShlinkCreateShortUrlData => ({
  longUrl: '',
  tags: [],
  customSlug: '',
  title: undefined,
  shortCodeLength: undefined,
  domain: '',
  validSince: undefined,
  validUntil: undefined,
  maxVisits: undefined,
  findIfExists: false,
  validateUrl: settings?.validateUrls ?? false,
  forwardQuery: settings?.forwardQuery ?? true,
});

export const CreateShortUrl = (
  ShortUrlForm: FC<ShortUrlFormProps<ShlinkCreateShortUrlData>>,
  CreateShortUrlResult: FC<CreateShortUrlResultProps>,
) => ({
  createShortUrl,
  shortUrlCreation,
  resetCreateShortUrl,
  basicMode = false,
}: CreateShortUrlConnectProps) => {
  const shortUrlCreationSettings = useSetting('shortUrlCreation');
  const initialState = useMemo(() => getInitialState(shortUrlCreationSettings), [shortUrlCreationSettings]);

  return (
    <>
      <ShortUrlForm
        initialState={initialState}
        saving={shortUrlCreation.saving}
        mode={basicMode ? 'create-basic' : 'create'}
        onSave={async (data) => {
          resetCreateShortUrl();
          return createShortUrl(data);
        }}
      />
      <CreateShortUrlResult
        creation={shortUrlCreation}
        resetCreateShortUrl={resetCreateShortUrl}
        canBeClosed={basicMode}
      />
    </>
  );
};
