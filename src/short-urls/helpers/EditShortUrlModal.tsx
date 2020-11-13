import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Button } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { ShortUrlEdition } from '../reducers/shortUrlEdition';
import { handleEventPreventingDefault, hasValue, OptionalString } from '../../utils/utils';
import { ShortUrlModalProps } from '../data';

interface EditShortUrlModalProps extends ShortUrlModalProps {
  shortUrlEdition: ShortUrlEdition;
  editShortUrl: (shortUrl: string, domain: OptionalString, longUrl: string) => Promise<void>;
}

const EditShortUrlModal = ({ isOpen, toggle, shortUrl, shortUrlEdition, editShortUrl }: EditShortUrlModalProps) => {
  const { saving, error } = shortUrlEdition;
  const url = shortUrl?.shortUrl ?? '';
  const [ longUrl, setLongUrl ] = useState(shortUrl.longUrl);

  const doEdit = async () => editShortUrl(shortUrl.shortCode, shortUrl.domain, longUrl).then(toggle);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
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
            <div className="p-2 mt-2 bg-danger text-white text-center">
              Something went wrong while saving the long URL :(
            </div>
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
