import { fromPartial } from '@total-typescript/shoehorn';
import { ContainerProvider, useDependencies } from '../../src/container/context';
import { render } from '../__helpers__/setUpTest.tsx';

describe('context', () => {
  describe('useDependencies', () => {
    let lastDependencies: unknown[];

    function TestComponent({ name }: { name: string }) {
      // oxlint-disable-next-line react/globals
      lastDependencies = useDependencies(name);
      return null;
    }

    it('throws when used outside of ContainerProvider', async () => {
      await expect(() => render(<TestComponent name="foo" />)).rejects.toThrow(
        'You cannot use "useDependencies" outside of a ContainerProvider',
      );
    });

    it('throws when requested dependency is not found in container', async () => {
      await expect(() =>
        render(
          <ContainerProvider value={fromPartial({})}>
            <TestComponent name="foo" />
          </ContainerProvider>,
        ),
      ).rejects.toThrow('Dependency with name "foo" not found in container');
    });

    it('gets dependency from container', async () => {
      await render(
        <ContainerProvider value={fromPartial({ foo: 'the dependency' })}>
          <TestComponent name="foo" />
        </ContainerProvider>,
      );

      expect(lastDependencies).toEqual(['the dependency']);
    });
  });
});
