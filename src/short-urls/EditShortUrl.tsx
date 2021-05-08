import { FC, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Card } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ExternalLink } from 'react-external-link';
import { SelectedServer } from '../servers/data';
import { Settings, ShortUrlCreationSettings } from '../settings/reducers/settings';
import { OptionalString } from '../utils/utils';
import { parseQuery } from '../utils/helpers/query';
import Message from '../utils/Message';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { useToggle } from '../utils/helpers/hooks';
import { ShortUrlFormProps } from './ShortUrlForm';
import { ShortUrlDetail } from './reducers/shortUrlDetail';
import { EditShortUrlData, ShortUrl, ShortUrlData } from './data';
import { ShortUrlEdition } from './reducers/shortUrlEdition';

interface EditShortUrlConnectProps extends RouteComponentProps<{ shortCode: string }> {
  settings: Settings;
  selectedServer: SelectedServer;
  shortUrlDetail: ShortUrlDetail;
  shortUrlEdition: ShortUrlEdition;
  getShortUrlDetail: (shortCode: string, domain: OptionalString) => void;
  editShortUrl: (shortUrl: string, domain: OptionalString, data: EditShortUrlData) => Promise<void>;
}

const getInitialState = (shortUrl?: ShortUrl, settings?: ShortUrlCreationSettings): ShortUrlData => {
  const validateUrl = settings?.validateUrls ?? false;

  if (!shortUrl) {
    return { longUrl: '', validateUrl };
  }

  return {
    longUrl: shortUrl.longUrl,
    tags: shortUrl.tags,
    title: shortUrl.title ?? undefined,
    domain: shortUrl.domain ?? undefined,
    validSince: shortUrl.meta.validSince ?? undefined,
    validUntil: shortUrl.meta.validUntil ?? undefined,
    maxVisits: shortUrl.meta.maxVisits ?? undefined,
    validateUrl,
  };
};

export const EditShortUrl = (ShortUrlForm: FC<ShortUrlFormProps>) => ({
  history: { goBack },
  match: { params },
  location: { search },
  settings: { shortUrlCreation: shortUrlCreationSettings },
  selectedServer,
  shortUrlDetail,
  getShortUrlDetail,
  shortUrlEdition,
  editShortUrl,
}: EditShortUrlConnectProps) => {
  const { loading, error, errorData, shortUrl } = shortUrlDetail;
  const { saving, error: savingError, errorData: savingErrorData } = shortUrlEdition;
  const { domain } = parseQuery<{ domain?: string }>(search);
  const initialState = useMemo(
    () => getInitialState(shortUrl, shortUrlCreationSettings),
    [ shortUrl, shortUrlCreationSettings ],
  );
  const [ savingSucceeded,, isSuccessful, isNotSuccessful ] = useToggle();

  useEffect(() => {
    getShortUrlDetail(params.shortCode, domain);
  }, []);

  if (loading) {
    return <Message loading />;
  }

  if (error) {
    return (
      <Result type="error">
        <ShlinkApiError errorData={errorData} fallbackMessage="An error occurred while loading short URL detail :(" />
      </Result>
    );
  }

  return (
    <>
      <header className="mb-3">
        <Card body>
          <h2 className="d-sm-flex justify-content-between align-items-center mb-0">
            <Button color="link" size="lg" className="p-0 mr-3" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <span className="text-center">
              <small>Edit <ExternalLink href={shortUrl?.shortUrl ?? ''} /></small>
            </span>
            <span />
          </h2>
        </Card>
      </header>
      <ShortUrlForm
        initialState={initialState}
        saving={saving}
        selectedServer={selectedServer}
        mode="edit"
        onSave={async (shortUrlData) => {
          if (!shortUrl) {
            return;
          }

          isNotSuccessful();
          editShortUrl(shortUrl.shortCode, shortUrl.domain, shortUrlData)
            .then(isSuccessful)
            .catch(isNotSuccessful);
        }}
      />
      {savingError && (
        <Result type="error" className="mt-3">
          <ShlinkApiError errorData={savingErrorData} fallbackMessage="An error occurred while updating short URL :(" />
        </Result>
      )}
      {savingSucceeded && <Result type="success" className="mt-3">Short URL properly edited.</Result>}
    </>
  );
};
