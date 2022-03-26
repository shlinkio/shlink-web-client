import { FC, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ShlinkDomain, ShlinkDomainRedirects } from '../../api/types';
import { InputFormGroup, InputFormGroupProps } from '../../utils/forms/InputFormGroup';
import { handleEventPreventingDefault, nonEmptyValueOrNull } from '../../utils/utils';
import { InfoTooltip } from '../../utils/InfoTooltip';

interface EditDomainRedirectsModalProps {
  domain: ShlinkDomain;
  isOpen: boolean;
  toggle: () => void;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
}

const FormGroup: FC<InputFormGroupProps & { isLast?: boolean }> = ({ isLast, ...rest }) => (
  <InputFormGroup
    {...rest}
    required={false}
    type="url"
    placeholder="No redirect"
    className={isLast ? 'mb-0' : ''}
  />
);

export const EditDomainRedirectsModal: FC<EditDomainRedirectsModalProps> = (
  { isOpen, toggle, domain, editDomainRedirects },
) => {
  const [baseUrlRedirect, setBaseUrlRedirect] = useState(domain.redirects?.baseUrlRedirect ?? '');
  const [regular404Redirect, setRegular404Redirect] = useState(domain.redirects?.regular404Redirect ?? '');
  const [invalidShortUrlRedirect, setInvalidShortUrlRedirect] = useState(
    domain.redirects?.invalidShortUrlRedirect ?? '',
  );
  const handleSubmit = handleEventPreventingDefault(async () => editDomainRedirects(domain.domain, {
    baseUrlRedirect: nonEmptyValueOrNull(baseUrlRedirect),
    regular404Redirect: nonEmptyValueOrNull(regular404Redirect),
    invalidShortUrlRedirect: nonEmptyValueOrNull(invalidShortUrlRedirect),
  }).then(toggle));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Edit redirects for <b>{domain.domain}</b></ModalHeader>
        <ModalBody>
          <FormGroup value={baseUrlRedirect} onChange={setBaseUrlRedirect}>
            <InfoTooltip className="me-2" placement="bottom">
              Visitors accessing the base url, as in <b>https://{domain.domain}/</b>, will be redirected to this URL.
            </InfoTooltip>
            Base URL
          </FormGroup>
          <FormGroup value={regular404Redirect} onChange={setRegular404Redirect}>
            <InfoTooltip className="me-2" placement="bottom">
              Visitors accessing a url not matching a short URL pattern, as in <b>https://{domain.domain}/???/[...]</b>,
              will be redirected to this URL.
            </InfoTooltip>
            Regular 404
          </FormGroup>
          <FormGroup value={invalidShortUrlRedirect} isLast onChange={setInvalidShortUrlRedirect}>
            <InfoTooltip className="me-2" placement="bottom">
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
