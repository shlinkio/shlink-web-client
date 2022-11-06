import { FC, useEffect, useMemo } from 'react';
import { Button, Card } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ExternalLink } from 'react-external-link';
import { useLocation, useParams } from 'react-router-dom';
import { SelectedServer } from '../servers/data';
import { Settings } from '../settings/reducers/settings';
import { OptionalString } from '../utils/utils';
import { parseQuery } from '../utils/helpers/query';
import { Message } from '../utils/Message';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { useGoBack, useToggle } from '../utils/helpers/hooks';
import { ShortUrlFormProps } from './ShortUrlForm';
import { ShortUrlDetail } from './reducers/shortUrlDetail';
import { EditShortUrl as EditShortUrlInfo, ShortUrlEdition } from './reducers/shortUrlEdition';
import { shortUrlDataFromShortUrl, urlDecodeShortCode } from './helpers';

interface EditShortUrlConnectProps {
  settings: Settings;
  selectedServer: SelectedServer;
  shortUrlDetail: ShortUrlDetail;
  shortUrlEdition: ShortUrlEdition;
  getShortUrlDetail: (shortCode: string, domain: OptionalString) => void;
  editShortUrl: (editShortUrl: EditShortUrlInfo) => Promise<void>;
}

export const EditShortUrl = (ShortUrlForm: FC<ShortUrlFormProps>) => ({
  settings: { shortUrlCreation: shortUrlCreationSettings },
  selectedServer,
  shortUrlDetail,
  getShortUrlDetail,
  shortUrlEdition,
  editShortUrl,
}: EditShortUrlConnectProps) => {
  const { search } = useLocation();
  const params = useParams<{ shortCode: string }>();
  const goBack = useGoBack();
  const { loading, error, errorData, shortUrl } = shortUrlDetail;
  const { saving, error: savingError, errorData: savingErrorData } = shortUrlEdition;
  const { domain } = parseQuery<{ domain?: string }>(search);
  const initialState = useMemo(
    () => shortUrlDataFromShortUrl(shortUrl, shortUrlCreationSettings),
    [shortUrl, shortUrlCreationSettings],
  );
  const [savingSucceeded,, isSuccessful, isNotSuccessful] = useToggle();

  useEffect(() => {
    params.shortCode && getShortUrlDetail(urlDecodeShortCode(params.shortCode), domain);
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
            <Button color="link" size="lg" className="p-0 me-3" onClick={goBack}>
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
          editShortUrl({ ...shortUrl, data: shortUrlData })
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
