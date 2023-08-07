import { render, screen } from '@testing-library/react';
import { Tags } from '../../../src/short-urls/helpers/Tags';
import { colorGeneratorMock } from '../../utils/services/__mocks__/ColorGenerator.mock';

describe('<Tags />', () => {
  const setUp = (tags: string[]) => render(<Tags tags={tags} colorGenerator={colorGeneratorMock} />);

  it('returns no tags when the list is empty', () => {
    setUp([]);
    expect(screen.getByText('No tags')).toBeInTheDocument();
  });

  it.each([
    [['foo', 'bar', 'baz']],
    [['one', 'two', 'three', 'four', 'five']],
  ])('returns expected tags based on provided list', (tags) => {
    setUp(tags);

    expect(screen.queryByText('No tags')).not.toBeInTheDocument();
    tags.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument());
  });
});
