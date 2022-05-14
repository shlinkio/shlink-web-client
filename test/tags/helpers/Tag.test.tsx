import { Mock } from 'ts-mockery';
import { shallow, ShallowWrapper } from 'enzyme';
import { ReactNode } from 'react';
import ColorGenerator from '../../../src/utils/services/ColorGenerator';
import { MAIN_COLOR } from '../../../src/utils/theme';
import Tag from '../../../src/tags/helpers/Tag';

describe('<Tag />', () => {
  const onClick = jest.fn();
  const onClose = jest.fn();
  const isColorLightForKey = jest.fn(() => false);
  const getColorForKey = jest.fn(() => MAIN_COLOR);
  const colorGenerator = Mock.of<ColorGenerator>({ getColorForKey, isColorLightForKey });
  let wrapper: ShallowWrapper;
  const createWrapper = (text: string, clearable?: boolean, children?: ReactNode) => {
    wrapper = shallow(
      <Tag text={text} clearable={clearable} colorGenerator={colorGenerator} onClick={onClick} onClose={onClose}>
        {children}
      </Tag>,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [true],
    [false],
  ])('includes an extra class when the color is light', (isLight) => {
    isColorLightForKey.mockReturnValue(isLight);

    const wrapper = createWrapper('foo');

    expect((wrapper.prop('className') as string).includes('tag--light-bg')).toEqual(isLight);
  });

  it.each([
    [MAIN_COLOR],
    ['#8A661C'],
    ['#F7BE05'],
    ['#5A02D8'],
    ['#202786'],
  ])('includes generated color as backgroundColor', (generatedColor) => {
    getColorForKey.mockReturnValue(generatedColor);

    const wrapper = createWrapper('foo');

    expect((wrapper.prop('style') as any).backgroundColor).toEqual(generatedColor);
  });

  it('invokes expected callbacks when appropriate events are triggered', () => {
    const wrapper = createWrapper('foo', true);

    expect(onClick).not.toBeCalled();
    expect(onClose).not.toBeCalled();

    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);

    wrapper.find('.tag__close-selected-tag').simulate('click');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    [true, 1, 'auto'],
    [false, 0, 'pointer'],
    [undefined, 0, 'pointer'],
  ])('includes a close component when the tag is clearable', (clearable, expectedCloseBtnAmount, expectedCursor) => {
    const wrapper = createWrapper('foo', clearable);

    expect(wrapper.find('.tag__close-selected-tag')).toHaveLength(expectedCloseBtnAmount);
    expect((wrapper.prop('style') as any).cursor).toEqual(expectedCursor);
  });

  it.each([
    [undefined, 'foo'],
    ['bar', 'bar'],
  ])('falls back to text as children when no children are provided', (children, expectedChildren) => {
    const wrapper = createWrapper('foo', false, children);

    expect(wrapper.html()).toContain(`>${expectedChildren}</span>`);
  });
});
