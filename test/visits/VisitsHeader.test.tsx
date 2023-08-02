import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { Visit } from '../../shlink-web-component/src/visits/types';
import { VisitsHeader } from '../../shlink-web-component/src/visits/VisitsHeader';

describe('<VisitsHeader />', () => {
  const visits: Visit[] = [fromPartial({}), fromPartial({}), fromPartial({})];
  const title = 'My header title';
  const goBack = vi.fn();
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
