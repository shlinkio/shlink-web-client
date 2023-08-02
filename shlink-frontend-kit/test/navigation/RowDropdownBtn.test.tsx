import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { DropdownBtnMenuProps } from '../../src';
import { RowDropdownBtn } from '../../src';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<RowDropdownBtn />', () => {
  const setUp = (props: Partial<DropdownBtnMenuProps> = {}) => renderWithEvents(
    <RowDropdownBtn {...fromPartial<DropdownBtnMenuProps>({ ...props })}>
      the children
    </RowDropdownBtn>,
  );

  it('renders expected components', () => {
    setUp();
    const toggle = screen.getByRole('button');

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveClass('btn-sm');
    expect(toggle).toHaveClass('dropdown-btn__toggle');
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('renders expected children', () => {
    setUp();
    expect(screen.getByText('the children')).toBeInTheDocument();
  });
});
