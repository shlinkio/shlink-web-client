import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { DomainSelector } from '../../src/shlink-web-component/domains/DomainSelector';
import type { DomainsList } from '../../src/shlink-web-component/domains/reducers/domainsList';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<DomainSelector />', () => {
  const domainsList = fromPartial<DomainsList>({
    domains: [
      fromPartial({ domain: 'default.com', isDefault: true }),
      fromPartial({ domain: 'foo.com' }),
      fromPartial({ domain: 'bar.com' }),
    ],
  });
  const setUp = (value = '') => renderWithEvents(
    <DomainSelector value={value} domainsList={domainsList} listDomains={vi.fn()} onChange={vi.fn()} />,
  );

  it.each([
    ['', 'Domain', 'domains-dropdown__toggle-btn'],
    ['my-domain.com', 'Domain: my-domain.com', 'domains-dropdown__toggle-btn--active'],
  ])('shows dropdown by default', async (value, expectedText, expectedClassName) => {
    const { user } = setUp(value);
    const btn = screen.getByRole('button', { name: expectedText });

    expect(screen.queryByPlaceholderText('Domain')).not.toBeInTheDocument();
    expect(btn).toHaveClass(
      `dropdown-btn__toggle ${expectedClassName} btn-block dropdown-btn__toggle--with-caret dropdown-toggle btn btn-primary`,
    );
    await user.click(btn);

    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });

  it('allows toggling between dropdown and input', async () => {
    const { user } = setUp();

    expect(screen.queryByPlaceholderText('Domain')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Domain' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Domain' }));
    await user.click(await screen.findByText('New domain'));

    expect(screen.getByPlaceholderText('Domain')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Domain' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to domains list' }));

    expect(screen.queryByPlaceholderText('Domain')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Domain' })).toBeInTheDocument();
  });

  it.each([
    [0, 'default.comdefault'],
    [1, 'foo.com'],
    [2, 'bar.com'],
  ])('shows expected content on every item', async (index, expectedContent) => {
    const { user } = setUp();

    await user.click(screen.getByRole('button', { name: 'Domain' }));
    const items = await screen.findAllByRole('menuitem');

    expect(items[index]).toHaveTextContent(expectedContent);
  });
});
