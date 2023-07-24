import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ChartCard } from '../../../shlink-web-component/visits/charts/ChartCard';

describe('<ChartCard />', () => {
  const setUp = (title: Function | string = '', footer?: ReactNode) => render(
    <ChartCard title={title} footer={footer} />,
  );

  it.each([
    ['the title', 'the title'],
    [() => 'the title from func', 'the title from func'],
  ])('properly renders title by parsing provided value', (title, expectedTitle) => {
    setUp(title);
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it('renders footer only when provided', () => {
    setUp('', 'the footer');
    expect(screen.getByText('the footer')).toBeInTheDocument();
  });
});
