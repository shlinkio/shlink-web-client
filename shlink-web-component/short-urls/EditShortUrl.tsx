import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { ExternalLink } from 'react-external-link';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Card } from 'reactstrap';
import { Message } from '../../src/utils/Message';
import { Result } from '../../src/utils/Result';
import { ShlinkApiError } from '../common/ShlinkApiError';
import { useGoBack } from '../utils/helpers/hooks';
import { parseQuery } from '../utils/helpers/query';
import { useSetting } from '../utils/settings';
import type { ShortUrlIdentifier } from './data';
import { shortUrlDataFromShortUrl, urlDecodeShortCode } from './helpers';
import type { ShortUrlDetail } from './reducers/shortUrlDetail';
import type { EditShortUrl as EditShortUrlInfo, ShortUrlEdition } from './reducers/shortUrlEdition';
import type { ShortUrlFormProps } from './ShortUrlForm';

interface EditShortUrlConnectProps {
  shortUrlDetail: ShortUrlDetail;
  shortUrlEdition: ShortUrlEdition;
  getShortUrlDetail: (shortUrl: ShortUrlIdentifier) => void;
  editShortUrl: (editShortUrl: EditShortUrlInfo) => void;
}

export const EditShortUrl = (ShortUrlForm: FC<ShortUrlFormProps>) => ({
  shortUrlDetail,
  getShortUrlDetail,
  shortUrlEdition,
  editShortUrl,
}: EditShortUrlConnectProps) => {
  const { search } = useLocation();
  const params = useParams<{ shortCode: string }>();
  const goBack = useGoBack();
  const { loading, error, errorData, shortUrl } = shortUrlDetail;
  const { saving, saved, error: savingError, errorData: savingErrorData } = shortUrlEdition;
  const { domain } = parseQuery<{ domain?: string }>(search);
  const shortUrlCreationSettings = useSetting('shortUrlCreation');
  const initialState = useMemo(
    () => shortUrlDataFromShortUrl(shortUrl, shortUrlCreationSettings),
    [shortUrl, shortUrlCreationSettings],
  );

  useEffect(() => {
    params.shortCode && getShortUrlDetail({ shortCode: urlDecodeShortCode(params.shortCode), domain });
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
        mode="edit"
        onSave={async (shortUrlData) => {
          if (!shortUrl) {
            return;
          }

          editShortUrl({ ...shortUrl, data: shortUrlData });
        }}
      />
      {saved && savingError && (
        <Result type="error" className="mt-3">
          <ShlinkApiError errorData={savingErrorData} fallbackMessage="An error occurred while updating short URL :(" />
        </Result>
      )}
      {saved && !savingError && <Result type="success" className="mt-3">Short URL properly edited.</Result>}
    </>
  );
};
