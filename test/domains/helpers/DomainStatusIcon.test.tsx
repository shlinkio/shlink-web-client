import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { DomainStatus } from '../../../src/domains/data';
import { DomainStatusIcon } from '../../../src/domains/helpers/DomainStatusIcon';
import { renderWithEvents } from '../../__mocks__/setUpTest';

describe('<DomainStatusIcon />', () => {
  const matchMedia = jest.fn().mockReturnValue(Mock.of<MediaQueryList>({ matches: false }));
  const setUp = (status: DomainStatus) => renderWithEvents(
    <DomainStatusIcon status={status} matchMedia={matchMedia} />,
  );

  beforeEach(jest.clearAllMocks);

  it.each([
    ['validating' as DomainStatus],
    ['invalid' as DomainStatus],
    ['valid' as DomainStatus],
  ])('renders expected icon and tooltip when status is not validating', (status) => {
    const { container } = setUp(status);
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each([
    ['invalid' as DomainStatus],
    ['valid' as DomainStatus],
  ])('renders proper tooltip based on state', async (status) => {
    const { container, user } = setUp(status);

    container.firstElementChild && await user.hover(container.firstElementChild);
    expect(await screen.findByRole('tooltip')).toMatchSnapshot();
  });
});
