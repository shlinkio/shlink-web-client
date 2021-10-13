import { FC, useMemo } from 'react';
import { SelectedServer } from '../servers/data';
import { Settings, ShortUrlCreationSettings } from '../settings/reducers/settings';
import { ShortUrlData } from './data';
import { ShortUrlCreation } from './reducers/shortUrlCreation';
import { CreateShortUrlResultProps } from './helpers/CreateShortUrlResult';
import { ShortUrlFormProps } from './ShortUrlForm';

export interface CreateShortUrlProps {
  basicMode?: boolean;
}

interface CreateShortUrlConnectProps extends CreateShortUrlProps {
  settings: Settings;
  shortUrlCreationResult: ShortUrlCreation;
  selectedServer: SelectedServer;
  createShortUrl: (data: ShortUrlData) => Promise<void>;
  resetCreateShortUrl: () => void;
}

const getInitialState = (settings?: ShortUrlCreationSettings): ShortUrlData => ({
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

const CreateShortUrl = (ShortUrlForm: FC<ShortUrlFormProps>, CreateShortUrlResult: FC<CreateShortUrlResultProps>) => ({
  createShortUrl,
  shortUrlCreationResult,
  resetCreateShortUrl,
  selectedServer,
  basicMode = false,
  settings: { shortUrlCreation: shortUrlCreationSettings },
}: CreateShortUrlConnectProps) => {
  const initialState = useMemo(() => getInitialState(shortUrlCreationSettings), [ shortUrlCreationSettings ]);

  return (
    <>
      <ShortUrlForm
        initialState={initialState}
        saving={shortUrlCreationResult.saving}
        selectedServer={selectedServer}
        mode={basicMode ? 'create-basic' : 'create'}
        onSave={async (data: ShortUrlData) => {
          resetCreateShortUrl();

          return createShortUrl(data);
        }}
      />
      <CreateShortUrlResult
        {...shortUrlCreationResult}
        resetCreateShortUrl={resetCreateShortUrl}
        canBeClosed={basicMode}
      />
    </>
  );
};

export default CreateShortUrl;
