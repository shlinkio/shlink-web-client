import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { NonOrphanVisitsHeader } from '../../src/visits/NonOrphanVisitsHeader';
import VisitsHeader from '../../src/visits/VisitsHeader';
import { Visit, VisitsInfo } from '../../src/visits/types';

describe('<NonOrphanVisitsHeader />', () => {
  it('wraps a VisitsHeader with provided data', () => {
    const visits: Visit[] = [];
    const orphanVisits = Mock.of<VisitsInfo>({ visits });
    const goBack = jest.fn();

    const wrapper = shallow(<NonOrphanVisitsHeader nonOrphanVisits={orphanVisits} goBack={goBack} />);
    const visitsHeader = wrapper.find(VisitsHeader);

    expect(visitsHeader).toHaveLength(1);
    expect(visitsHeader.prop('visits')).toEqual(visits);
    expect(visitsHeader.prop('goBack')).toEqual(goBack);
    expect(visitsHeader.prop('title')).toEqual('Non-orphan visits');
  });
});
