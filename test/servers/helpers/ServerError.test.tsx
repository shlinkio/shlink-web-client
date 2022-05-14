import { shallow, ShallowWrapper } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { ServerError as createServerError } from '../../../src/servers/helpers/ServerError';
import { NonReachableServer, NotFoundServer } from '../../../src/servers/data';

describe('<ServerError />', () => {
  let wrapper: ShallowWrapper;
  const ServerError = createServerError(() => null);

  afterEach(() => wrapper?.unmount());

  it.each([
    [
      Mock.all<NotFoundServer>(),
      {
        'Could not find this Shlink server.': true,
        'Oops! Could not connect to this Shlink server.': false,
        'Make sure you have internet connection, and the server is properly configured and on-line.': false,
        'Alternatively, if you think you may have miss-configured this server': false,
      },
    ],
    [
      Mock.of<NonReachableServer>({ id: 'abc123' }),
      {
        'Could not find this Shlink server.': false,
        'Oops! Could not connect to this Shlink server.': true,
        'Make sure you have internet connection, and the server is properly configured and on-line.': true,
        'Alternatively, if you think you may have miss-configured this server': true,
      },
    ],
  ])('renders expected information based on provided server type', (selectedServer, textsToFind) => {
    wrapper = shallow(
      <BrowserRouter>
        <ServerError servers={{}} selectedServer={selectedServer} />
      </BrowserRouter>,
    );
    const wrapperText = wrapper.html();
    const textPairs = Object.entries(textsToFind);

    textPairs.forEach(([text, shouldBeFound]) => {
      if (shouldBeFound) {
        expect(wrapperText).toContain(text);
      } else {
        expect(wrapperText).not.toContain(text);
      }
    });
  });
});
