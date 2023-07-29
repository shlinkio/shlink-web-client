import { render, screen } from '@testing-library/react';
import { ExportBtn } from '../../shlink-web-component/utils/components/ExportBtn';

describe('<ExportBtn />', () => {
  const setUp = (amount?: number, loading = false) => render(<ExportBtn amount={amount} loading={loading} />);

  it.each([
    [true, 'Exporting...'],
    [false, 'Export (0)'],
  ])('renders loading state when expected', async (loading, text) => {
    setUp(undefined, loading);
    const btn = await screen.findByRole('button');

    expect(btn).toHaveTextContent(text);
    if (loading) {
      expect(btn).toHaveAttribute('disabled');
    } else {
      expect(btn).not.toHaveAttribute('disabled');
    }
  });

  it.each([
    [undefined, '0'],
    [10, '10'],
    [10_000, '10,000'],
    [10_000_000, '10,000,000'],
  ])('renders expected amount', async (amount, expectedRenderedAmount) => {
    setUp(amount);
    expect(await screen.findByRole('button')).toHaveTextContent(`Export (${expectedRenderedAmount})`);
  });

  it('renders expected icon', () => {
    setUp();
    expect(screen.getByRole('img', { hidden: true })).toMatchSnapshot();
  });
});
