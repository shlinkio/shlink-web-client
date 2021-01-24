import { shallow, ShallowWrapper } from 'enzyme';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboardIcon } from '../../src/utils/CopyToClipboardIcon';

describe('<CopyToClipboardIcon />', () => {
  let wrapper: ShallowWrapper;
  const onCopy = () => {};

  beforeEach(() => {
    wrapper = shallow(<CopyToClipboardIcon text="foo" onCopy={onCopy} />);
  });
  afterEach(() => wrapper?.unmount());

  test('expected components are wrapped', () => {
    const copyToClipboard = wrapper.find(CopyToClipboard);
    const icon = wrapper.find(FontAwesomeIcon);

    expect(copyToClipboard).toHaveLength(1);
    expect(copyToClipboard.prop('text')).toEqual('foo');
    expect(copyToClipboard.prop('onCopy')).toEqual(onCopy);
    expect(icon).toHaveLength(1);
    expect(icon.prop('icon')).toEqual(copyIcon);
    expect(icon.prop('className')).toEqual('ml-2 copy-to-clipboard-icon');
  });
});
