import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { DropdownBtnMenu, DropdownBtnMenuProps } from '../../src/utils/DropdownBtnMenu';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<DropdownBtnMenu />', () => {
  const setUp = (props: Partial<DropdownBtnMenuProps> = {}) => renderWithEvents(
    <DropdownBtnMenu {...Mock.of<DropdownBtnMenuProps>({ toggle: vi.fn(), ...props })}>the children</DropdownBtnMenu>,
  );

  it('renders expected components', () => {
    setUp();
    const toggle = screen.getByRole('button');

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveClass('btn-sm');
    expect(toggle).toHaveClass('dropdown-btn-menu__dropdown-toggle');
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('renders expected children', () => {
    setUp();
    expect(screen.getByText('the children')).toBeInTheDocument();
  });

  it.each([
    [undefined, true],
    [true, true],
    [false, false],
  ])('renders menu to the end when expected', (right, expectedEnd) => {
    setUp({ right });

    if (expectedEnd) {
      expect(screen.getByRole('menu', { hidden: true })).toHaveClass('dropdown-menu-end');
    } else {
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('dropdown-menu-end');
    }
  });
});
