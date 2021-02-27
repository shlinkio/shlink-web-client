import { FC, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { ShortUrlTags } from '../reducers/shortUrlTags';
import { ShortUrlModalProps } from '../data';
import { OptionalString } from '../../utils/utils';
import { TagsSelectorProps } from '../../tags/helpers/TagsSelector';
import { Result } from '../../utils/Result';
import { ShlinkApiError } from '../../api/ShlinkApiError';

interface EditTagsModalProps extends ShortUrlModalProps {
  shortUrlTags: ShortUrlTags;
  editShortUrlTags: (shortCode: string, domain: OptionalString, tags: string[]) => Promise<void>;
  resetShortUrlsTags: () => void;
}

const EditTagsModal = (TagsSelector: FC<TagsSelectorProps>) => (
  { isOpen, toggle, shortUrl, shortUrlTags, editShortUrlTags, resetShortUrlsTags }: EditTagsModalProps,
) => {
  const [ selectedTags, setSelectedTags ] = useState<string[]>(shortUrl.tags || []);

  useEffect(() => resetShortUrlsTags, []);

  const { saving, error, errorData } = shortUrlTags;
  const url = shortUrl?.shortUrl ?? '';
  const saveTags = async () => editShortUrlTags(shortUrl.shortCode, shortUrl.domain, selectedTags)
    .then(toggle)
    .catch(() => {});

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Edit tags for <ExternalLink href={url} />
      </ModalHeader>
      <ModalBody>
        <TagsSelector tags={selectedTags} onChange={setSelectedTags} />
        {error && (
          <Result type="error" small className="mt-2">
            <ShlinkApiError errorData={errorData} fallbackMessage="Something went wrong while saving the tags :(" />
          </Result>
        )}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-link" onClick={toggle}>Cancel</button>
        <button className="btn btn-primary" type="button" disabled={saving} onClick={saveTags}>
          {saving ? 'Saving tags...' : 'Save tags'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTagsModal;
