import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import type { MessageProps } from '../../src';
import { Message } from '../../src';

describe('<Message />', () => {
  const setUp = (props: PropsWithChildren<MessageProps> = {}) => render(<Message {...props} />);

  it.each([
    [true, 'col-md-12'],
    [false, 'col-md-10 offset-md-1'],
    [undefined, 'col-md-10 offset-md-1'],
  ])('renders expected classes based on width', (fullWidth, expectedClass) => {
    const { container } = setUp({ fullWidth });
    expect(container.firstChild?.firstChild).toHaveClass(expectedClass);
  });

  it.each([
    [true, 'These are the children contents'],
    [false, 'These are the children contents'],
    [true, undefined],
    [false, undefined],
  ])('renders expected content', (loading, children) => {
    setUp({ loading, children });

    expect(screen.queryAllByRole('img', { hidden: true })).toHaveLength(loading ? 1 : 0);

    if (loading) {
      expect(screen.getByText(children || 'Loading...')).toHaveClass('ms-2');
    } else {
      expect(screen.getByRole('heading')).toHaveTextContent(children || '');
    }
  });

  it.each([
    ['error', 'border-danger', 'text-danger'],
    ['default', '', 'text-muted'],
    [undefined, '', 'text-muted'],
  ])('renders proper classes based on message type', (type, expectedCardClass, expectedH3Class) => {
    const { container } = setUp({ type: type as 'default' | 'error' | undefined });

    expect(container.querySelector('.card-body')).toHaveAttribute('class', expect.stringContaining(expectedCardClass));
    expect(screen.getByRole('heading')).toHaveClass(`text-center mb-0 ${expectedH3Class}`);
  });

  it.each([{ className: 'foo' }, { className: 'bar' }, {}])('renders provided classes', ({ className }) => {
    const { container } = setUp({ className });
    expect(container.firstChild).toHaveClass(`g-0${className ? ` ${className}` : ''}`);
  });
});
