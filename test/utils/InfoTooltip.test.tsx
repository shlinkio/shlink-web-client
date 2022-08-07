import { screen, waitFor } from '@testing-library/react';
import { Placement } from '@popperjs/core';
import { InfoTooltip, InfoTooltipProps } from '../../src/utils/InfoTooltip';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<InfoTooltip />', () => {
  const setUp = (props: Partial<InfoTooltipProps> = {}) => renderWithEvents(
    <InfoTooltip placement="right" {...props} />,
  );

  it.each([
    [undefined],
    ['foo'],
    ['bar'],
  ])('renders expected className on span', (className) => {
    const { container } = setUp({ className });

    if (className) {
      expect(container.firstChild).toHaveClass(className);
    } else {
      expect(container.firstChild).toHaveAttribute('class', '');
    }
  });

  it.each([
    [<span key={1}>foo</span>, 'foo'],
    ['Foo', 'Foo'],
    ['Hello', 'Hello'],
    [['One', 'Two', <span key={3} />], 'OneTwo'],
  ])('passes children down to the nested tooltip component', async (children, expectedContent) => {
    const { container, user } = setUp({ children });

    container.firstElementChild && await user.hover(container.firstElementChild);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    expect(screen.getByRole('tooltip')).toHaveTextContent(expectedContent);
  });

  it.each([
    ['right' as Placement],
    ['left' as Placement],
    ['top' as Placement],
    ['bottom' as Placement],
  ])('places tooltip where requested', async (placement) => {
    const { container, user } = setUp({ placement });

    container.firstElementChild && await user.hover(container.firstElementChild);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    expect(screen.getByRole('tooltip').parentNode).toHaveAttribute('data-popper-placement', placement);
  });
});
