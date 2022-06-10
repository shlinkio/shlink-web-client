import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyToClipboardIcon } from '../../src/utils/CopyToClipboardIcon';

describe('<CopyToClipboardIcon />', () => {
  const onCopy = jest.fn();
  const setUp = (text = 'foo') => ({
    user: userEvent.setup(),
    ...render(<CopyToClipboardIcon text={text} onCopy={onCopy} />),
  });

  afterEach(jest.clearAllMocks);

  it('wraps expected components', () => {
    const { container } = setUp();
    expect(container).toMatchSnapshot();
  });

  it.each([
    ['text'],
    ['bar'],
    ['baz'],
  ])('copies content to clipboard when clicked', async (text) => {
    const { user, container } = setUp(text);

    expect(onCopy).not.toHaveBeenCalled();
    container.firstElementChild && await user.click(container.firstElementChild);
    expect(onCopy).toHaveBeenCalledWith(text, false);
  });
});
