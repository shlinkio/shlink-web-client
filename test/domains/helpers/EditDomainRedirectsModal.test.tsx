import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { ShlinkDomain } from '../../../src/api/types';
import { EditDomainRedirectsModal } from '../../../src/domains/helpers/EditDomainRedirectsModal';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<EditDomainRedirectsModal />', () => {
  const editDomainRedirects = jest.fn().mockResolvedValue(undefined);
  const toggle = jest.fn();
  const domain = Mock.of<ShlinkDomain>({
    domain: 'foo.com',
    redirects: {
      baseUrlRedirect: 'baz',
    },
  });
  const setUp = () => renderWithEvents(
    <EditDomainRedirectsModal domain={domain} isOpen toggle={toggle} editDomainRedirects={editDomainRedirects} />,
  );

  afterEach(jest.clearAllMocks);

  it('renders domain in header', () => {
    setUp();
    expect(screen.getByRole('heading')).toHaveTextContent('Edit redirects for foo.com');
  });

  it('has different handlers to toggle the modal', async () => {
    const { user } = setUp();

    expect(toggle).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Close'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(toggle).toHaveBeenCalledTimes(2);
  });

  it('saves expected values when form is submitted', async () => {
    const { user } = setUp();
    // TODO Using fire event because userEvent.click on the Submit button does not submit the form
    const submitForm = () => fireEvent.submit(screen.getByRole('form'));

    expect(editDomainRedirects).not.toHaveBeenCalled();
    submitForm();
    await waitFor(() => expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: 'baz',
      regular404Redirect: null,
      invalidShortUrlRedirect: null,
    }));

    await user.clear(screen.getByDisplayValue('baz'));
    await user.type(screen.getAllByPlaceholderText('No redirect')[0], 'new_base_url');
    await user.type(screen.getAllByPlaceholderText('No redirect')[2], 'new_invalid_short_url');
    submitForm();
    await waitFor(() => expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: 'new_base_url',
      regular404Redirect: null,
      invalidShortUrlRedirect: 'new_invalid_short_url',
    }));

    await user.type(screen.getAllByPlaceholderText('No redirect')[1], 'new_regular_404');
    await user.clear(screen.getByDisplayValue('new_invalid_short_url'));
    submitForm();
    await waitFor(() => expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: 'new_base_url',
      regular404Redirect: 'new_regular_404',
      invalidShortUrlRedirect: null,
    }));

    await Promise.all(screen.getAllByPlaceholderText('No redirect').map((element) => user.clear(element)));
    submitForm();
    await waitFor(() => expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: null,
      regular404Redirect: null,
      invalidShortUrlRedirect: null,
    }));
  });
});
