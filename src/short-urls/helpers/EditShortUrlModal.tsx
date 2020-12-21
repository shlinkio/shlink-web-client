import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Button } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { ShortUrlEdition } from '../reducers/shortUrlEdition';
import { handleEventPreventingDefault, hasValue, OptionalString } from '../../utils/utils';
import { ShortUrlModalProps } from '../data';
import { Result } from '../../utils/Result';
import { ShlinkApiError } from '../../api/ShlinkApiError';

interface EditShortUrlModalProps extends ShortUrlModalProps {
  shortUrlEdition: ShortUrlEdition;
  editShortUrl: (shortUrl: string, domain: OptionalString, longUrl: string) => Promise<void>;
}

const EditShortUrlModal = ({ isOpen, toggle, shortUrl, shortUrlEdition, editShortUrl }: EditShortUrlModalProps) => {
  const { saving, error, errorData } = shortUrlEdition;
  const url = shortUrl?.shortUrl ?? '';
  const [ longUrl, setLongUrl ] = useState(shortUrl.longUrl);

  const doEdit = async () => editShortUrl(shortUrl.shortCode, shortUrl.domain, longUrl).then(toggle);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        Edit long URL for <ExternalLink href={url} />
      </ModalHeader>
      <form onSubmit={handleEventPreventingDefault(doEdit)}>
        <ModalBody>
          <FormGroup className="mb-0">
            <Input
              type="url"
              required
              placeholder="Long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </FormGroup>
          {error && (
            <Result type="error" small className="mt-2">
              <ShlinkApiError
                errorData={errorData}
                fallbackMessage="Something went wrong while saving the long URL :("
              />
            </Result>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={toggle}>Cancel</Button>
          <Button color="primary" disabled={saving || !hasValue(longUrl)}>{saving ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default EditShortUrlModal;
