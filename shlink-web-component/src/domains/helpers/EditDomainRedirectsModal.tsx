import type { InputFormGroupProps } from '@shlinkio/shlink-frontend-kit';
import { InputFormGroup } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import type { ShlinkDomain } from '../../api-contract';
import { InfoTooltip } from '../../utils/components/InfoTooltip';
import { handleEventPreventingDefault, nonEmptyValueOrNull } from '../../utils/helpers';
import type { EditDomainRedirects } from '../reducers/domainRedirects';

interface EditDomainRedirectsModalProps {
  domain: ShlinkDomain;
  isOpen: boolean;
  toggle: () => void;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
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
  const handleSubmit = handleEventPreventingDefault(async () => editDomainRedirects({
    domain: domain.domain,
    redirects: {
      baseUrlRedirect: nonEmptyValueOrNull(baseUrlRedirect),
      regular404Redirect: nonEmptyValueOrNull(regular404Redirect),
      invalidShortUrlRedirect: nonEmptyValueOrNull(invalidShortUrlRedirect),
    },
  }).then(toggle));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <form name="domainRedirectsModal" onSubmit={handleSubmit}>
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
