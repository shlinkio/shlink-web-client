import { FC, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { ShlinkDomain, ShlinkDomainRedirects } from '../../api/types';
import { FormGroupContainer } from '../../utils/FormGroupContainer';
import { handleEventPreventingDefault, nonEmptyValueOrNull } from '../../utils/utils';

interface EditDomainRedirectsModalProps {
  domain: ShlinkDomain;
  isOpen: boolean;
  toggle: () => void;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
}

const InfoTooltip: FC<{ id: string }> = ({ id, children }) => (
  <>
    <FontAwesomeIcon icon={infoIcon} className="mr-2" id={id} />
    <UncontrolledTooltip target={id} placement="bottom">{children}</UncontrolledTooltip>
  </>
);

const FormGroup: FC<{ value: string; onChange: (newValue: string) => void; isLast?: boolean }> = (
  { value, onChange, isLast, children },
) => (
  <FormGroupContainer
    value={value}
    required={false}
    type="url"
    placeholder="No redirect"
    className={isLast ? 'mb-0' : ''}
    onChange={onChange}
  >
    {children}
  </FormGroupContainer>
);

export const EditDomainRedirectsModal: FC<EditDomainRedirectsModalProps> = (
  { isOpen, toggle, domain, editDomainRedirects },
) => {
  const [ baseUrlRedirect, setBaseUrlRedirect ] = useState('');
  const [ regular404Redirect, setRegular404Redirect ] = useState('');
  const [ invalidShortUrlRedirect, setInvalidShortUrlRedirect ] = useState('');
  const handleSubmit = handleEventPreventingDefault(async () => editDomainRedirects(domain.domain, {
    baseUrlRedirect: nonEmptyValueOrNull(baseUrlRedirect),
    regular404Redirect: nonEmptyValueOrNull(regular404Redirect),
    invalidShortUrlRedirect: nonEmptyValueOrNull(invalidShortUrlRedirect),
  }).then(toggle));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          Edit redirects for <b>{domain.domain}</b>
        </ModalHeader>
        <ModalBody>
          <FormGroup value={baseUrlRedirect} onChange={setBaseUrlRedirect}>
            <InfoTooltip id="baseUrlInfo">
              Visitors accessing the base url, as in <b>https://{domain.domain}/</b>, will be redirected to this URL.
            </InfoTooltip>
            Base URL
          </FormGroup>
          <FormGroup value={regular404Redirect} onChange={setRegular404Redirect}>
            <InfoTooltip id="regularNotFoundInfo">
              Visitors accessing a url not matching a short URL pattern, as in <b>https://{domain.domain}/???/[...]</b>,
              will be redirected to this URL.
            </InfoTooltip>
            Regular 404
          </FormGroup>
          <FormGroup value={invalidShortUrlRedirect} isLast onChange={setInvalidShortUrlRedirect}>
            <InfoTooltip id="invalidShortUrlInfo">
              Visitors accessing a url matching a short URL pattern, but not matching an existing short code, will be
              redirected to this URL.
            </InfoTooltip>
            Invalid short URL
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="link" type="button" onClick={toggle}>Cancel</Button>
          <Button color="primary">Save</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
