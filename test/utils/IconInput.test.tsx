import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAppleAlt, faCalendar, faTable } from '@fortawesome/free-solid-svg-icons';
import { screen } from '@testing-library/react';
import { IconInput } from '../../src/utils/IconInput';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<IconInput />', () => {
  const setUp = (icon: IconProp, placeholder?: string) => renderWithEvents(
    <IconInput icon={icon} placeholder={placeholder} />,
  );

  it.each([faCalendar, faAppleAlt, faTable])('displays provided icon', (icon) => {
    const { container } = setUp(icon);
    expect(container).toMatchSnapshot();
  });

  it('focuses input on icon click', async () => {
    const { user } = setUp(faCalendar, 'foo');

    expect(screen.getByPlaceholderText('foo')).not.toHaveFocus();
    await user.click(screen.getByRole('img', { hidden: true }));
    expect(screen.getByPlaceholderText('foo')).toHaveFocus();
  });
});
