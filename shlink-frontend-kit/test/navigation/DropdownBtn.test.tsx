import { screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import type { DropdownBtnProps } from '../../src';
import { DropdownBtn } from '../../src';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<DropdownBtn />', () => {
  const setUp = (props: PropsWithChildren<DropdownBtnProps>) => renderWithEvents(
    <DropdownBtn children="foo" {...props} />,
  );

  it.each([['foo'], ['bar'], ['baz']])('displays provided text in button', (text) => {
    setUp({ text });
    expect(screen.getByRole('button')).toHaveTextContent(text);
  });

  it.each([['foo'], ['bar'], ['baz']])('displays provided children in menu', async (children) => {
    const { user } = setUp({ text: '', children });

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toHaveTextContent(children);
  });

  it.each([
    [undefined, 'dropdown-btn__toggle btn-block'],
    ['', 'dropdown-btn__toggle btn-block'],
    ['foo', 'dropdown-btn__toggle btn-block foo'],
    ['bar', 'dropdown-btn__toggle btn-block bar'],
  ])('includes provided classes', (className, expectedClasses) => {
    setUp({ text: '', className });
    expect(screen.getByRole('button')).toHaveClass(expectedClasses);
  });

  it.each([
    [100, 'min-width: 100px; '],
    [250, 'min-width: 250px; '],
    [undefined, ''],
  ])('renders proper styles when minWidth is provided', async (minWidth, expectedStyle) => {
    const { user } = setUp({ text: '', minWidth });

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toHaveAttribute(
      'style',
      `${expectedStyle}position: absolute; left: 0px; top: 0px; transform: translate(0px, 0px);`,
    );
  });
});
