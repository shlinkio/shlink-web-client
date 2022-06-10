import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { VisitsHeader } from '../../src/visits/VisitsHeader';
import { Visit } from '../../src/visits/types';

describe('<VisitsHeader />', () => {
  const visits = [Mock.all<Visit>(), Mock.all<Visit>(), Mock.all<Visit>()];
  const title = 'My header title';
  const goBack = jest.fn();
  const setUp = () => render(<VisitsHeader visits={visits} goBack={goBack} title={title} />);

  it('shows the amount of visits', () => {
    const { container } = setUp();
    expect(container.querySelector('.badge')).toHaveTextContent(`Visits: ${visits.length}`);
  });

  it('shows the title in two places', () => {
    setUp();
    expect(screen.getAllByText(title)).toHaveLength(2);
  });
});
