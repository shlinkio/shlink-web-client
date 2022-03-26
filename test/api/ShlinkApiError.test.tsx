import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { ShlinkApiError, ShlinkApiErrorProps } from '../../src/api/ShlinkApiError';
import { InvalidArgumentError, ProblemDetailsError } from '../../src/api/types';

describe('<ShlinkApiError />', () => {
  let commonWrapper: ShallowWrapper;
  const createWrapper = (props: ShlinkApiErrorProps) => {
    commonWrapper = shallow(<ShlinkApiError {...props} />);

    return commonWrapper;
  };

  afterEach(() => commonWrapper?.unmount());

  it.each([
    [undefined, 'the fallback', 'the fallback'],
    [Mock.all<ProblemDetailsError>(), 'the fallback', 'the fallback'],
    [Mock.of<ProblemDetailsError>({ detail: 'the detail' }), 'the fallback', 'the detail'],
  ])('renders proper message', (errorData, fallbackMessage, expectedMessage) => {
    const wrapper = createWrapper({ errorData, fallbackMessage });

    expect(wrapper.text()).toContain(expectedMessage);
  });

  it.each([
    [undefined, 0],
    [Mock.all<ProblemDetailsError>(), 0],
    [Mock.of<InvalidArgumentError>({ type: 'INVALID_ARGUMENT', invalidElements: [] }), 1],
  ])('renders list of invalid elements when provided error is an InvalidError', (errorData, expectedElementsCount) => {
    const wrapper = createWrapper({ errorData });
    const p = wrapper.find('p');

    expect(p).toHaveLength(expectedElementsCount);
  });
});
