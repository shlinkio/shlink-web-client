import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { DomainSelector } from '../../src/domains/DomainSelector';
import { DomainsList } from '../../src/domains/reducers/domainsList';
import { ShlinkDomain } from '../../src/api/types';

describe('<DomainSelector />', () => {
  const domainsList = Mock.of<DomainsList>({
    domains: [
      Mock.of<ShlinkDomain>({ domain: 'default.com', isDefault: true }),
      Mock.of<ShlinkDomain>({ domain: 'foo.com' }),
      Mock.of<ShlinkDomain>({ domain: 'bar.com' }),
    ],
  });
  const setUp = (value = '') => render(
    <DomainSelector value={value} domainsList={domainsList} listDomains={jest.fn()} onChange={jest.fn()} />,
  );

  afterEach(jest.clearAllMocks);

  it.each([
    ['', 'Domain', 'domains-dropdown__toggle-btn'],
    ['my-domain.com', 'Domain: my-domain.com', 'domains-dropdown__toggle-btn--active'],
  ])('shows dropdown by default', async (value, expectedText, expectedClassName) => {
    setUp(value);

    const btn = screen.getByRole('button', { name: expectedText });

    expect(screen.queryByPlaceholderText('Domain')).not.toBeInTheDocument();
    expect(btn).toHaveAttribute(
      'class',
      `dropdown-btn__toggle btn-block ${expectedClassName} dropdown-toggle btn btn-primary`,
    );
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });

  it('allows toggling between dropdown and input', async () => {
    setUp();

    expect(screen.queryByPlaceholderText('Domain')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Domain' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Domain' }));
    fireEvent.click(await screen.findByText('New domain'));

    expect(screen.getByPlaceholderText('Domain')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Domain' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back to domains list' }));

    expect(screen.queryByPlaceholderText('Domain')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Domain' })).toBeInTheDocument();
  });

  it.each([
    [0, 'default.comdefault'],
    [1, 'foo.com'],
    [2, 'bar.com'],
  ])('shows expected content on every item', async (index, expectedContent) => {
    setUp();

    fireEvent.click(screen.getByRole('button', { name: 'Domain' }));
    const items = await screen.findAllByRole('menuitem');

    expect(items[index]).toHaveTextContent(expectedContent);
  });
});
