import { render, screen } from '@testing-library/react';
import { Checkbox } from '../../src';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<Checkbox />', () => {
  it.each([['foo'], ['bar'], ['baz']])('includes extra class names when provided', (className) => {
    const { container } = render(<Checkbox className={className} />);
    expect(container.firstChild).toHaveAttribute('class', `form-check form-checkbox ${className}`);
  });

  it.each([[true], [false]])('marks input as checked if defined', (checked) => {
    render(<Checkbox checked={checked}>Foo</Checkbox>);

    if (checked) {
      expect(screen.getByLabelText('Foo')).toBeChecked();
    } else {
      expect(screen.getByLabelText('Foo')).not.toBeChecked();
    }
  });

  it.each([['foo'], ['bar'], ['baz']])('renders provided children inside the label', (children) => {
    render(<Checkbox>{children}</Checkbox>);
    expect(screen.getByText(children)).toHaveAttribute('class', 'form-check-label');
  });

  it.each([[true], [false]])('changes checked status on input change', async (checked) => {
    const onChange = vi.fn();
    const { user } = renderWithEvents(<Checkbox onChange={onChange} checked={checked}>Foo</Checkbox>);

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Foo'));
    expect(onChange).toHaveBeenCalledWith(!checked, expect.anything());
  });

  it.each([[true], [false]])('allows setting inline rendering', (inline) => {
    const { container } = render(<Checkbox inline={inline} />);

    if (inline) {
      expect(container.firstChild).toHaveAttribute('style', 'display: inline-block;');
    } else {
      expect(container.firstChild).not.toHaveAttribute('style');
    }
  });
});
