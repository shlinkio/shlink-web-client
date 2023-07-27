import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ColorGenerator } from '../../shlink-web-component/utils/services/ColorGenerator';
import type { TagVisits } from '../../shlink-web-component/visits/reducers/tagVisits';
import { TagVisitsHeader } from '../../shlink-web-component/visits/TagVisitsHeader';

describe('<TagVisitsHeader />', () => {
  const tagVisits = fromPartial<TagVisits>({
    tag: 'foo',
    visits: [{}, {}, {}, {}],
  });
  const goBack = vi.fn();
  const colorGenerator = fromPartial<ColorGenerator>({ isColorLightForKey: () => false, getColorForKey: () => 'red' });
  const setUp = () => render(<TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />);

  it('shows expected visits', () => {
    const { container } = setUp();

    expect(screen.getAllByText('Visits for')).toHaveLength(2);
    expect(container.querySelector('.badge:not(.tag)')).toHaveTextContent(`Visits: ${tagVisits.visits.length}`);
  });

  it('shows title for tag', () => {
    const { container } = setUp();
    expect(container.querySelector('.badge.tag')).toHaveTextContent(tagVisits.tag);
  });
});
