import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { TagVisitsHeader } from '../../src/visits/TagVisitsHeader';
import { TagVisits } from '../../src/visits/reducers/tagVisits';
import { ColorGenerator } from '../../src/utils/services/ColorGenerator';

describe('<TagVisitsHeader />', () => {
  const tagVisits = Mock.of<TagVisits>({
    tag: 'foo',
    visits: [{}, {}, {}, {}],
  });
  const goBack = vi.fn();
  const colorGenerator = Mock.of<ColorGenerator>({ isColorLightForKey: () => false, getColorForKey: () => 'red' });
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
