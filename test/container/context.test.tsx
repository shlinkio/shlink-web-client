import { render } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { ContainerProvider, useDependencies } from '../../src/container/context';

describe('context', () => {
  describe('useDependencies', () => {
    let lastDependencies: unknown[];

    function TestComponent({ name }: { name: string }) {
      // eslint-disable-next-line react-compiler/react-compiler
      lastDependencies = useDependencies(name);
      return null;
    }

    it('throws when used outside of ContainerProvider', () => {
      expect(() => render(<TestComponent name="foo" />)).toThrowError(
        'You cannot use "useDependencies" outside of a ContainerProvider',
      );
    });

    it('throws when requested dependency is not found in container', () => {
      expect(() =>
        render(
          <ContainerProvider value={fromPartial({})}>
            <TestComponent name="foo" />
          </ContainerProvider>,
        ),
      ).toThrowError('Dependency with name "foo" not found in container');
    });

    it('gets dependency from container', () => {
      render(
        <ContainerProvider value={fromPartial({ foo: 'the dependency' })}>
          <TestComponent name="foo" />
        </ContainerProvider>,
      );

      expect(lastDependencies).toEqual(['the dependency']);
    });
  });
});
