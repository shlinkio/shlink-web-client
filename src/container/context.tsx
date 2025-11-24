import type { IContainer } from 'bottlejs';
import { type ComponentType, createContext, useContext } from 'react';

const ContainerContext = createContext<IContainer | null>(null);

export const ContainerProvider = ContainerContext.Provider;

const useContainer = (wrapperName: string): IContainer => {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error(`You cannot use "${wrapperName}" outside of a ContainerProvider`);
  }

  return container;
};

/**
 * Hook used to extract dependencies from the container in other hooks.
 */
export const useDependencies = <T extends unknown[]>(...names: string[]): T => {
  const container = useContainer('useDependencies');

  return names.map((name) => {
    const dependency = container[name];
    if (!dependency) {
      throw new Error(`Dependency with name "${name}" not found in container`);
    }

    return dependency;
  }) as T;
};

type Optionalize<P, K extends keyof P> = Omit<P, K> & Partial<Pick<P, K>>;

/**
 * Higher Order Component used to inject services into components as props.
 * All dependencies become optional props so that they can still be explicitly set in tests if desired.
 */
export function withDependencies<
  Props extends Record<string, unknown>,
  DependencyName extends string & keyof Props,
>(
  Component: ComponentType<Props>,
  dependencyNames: DependencyName[],
): ComponentType<Optionalize<Props, DependencyName>> {
  function Wrapper(props: Omit<Props, DependencyName>) {
    const container = useContext(ContainerContext);

    // Inject services, unless they have been overridden by props passed from
    // the parent component.
    const dependencies: Partial<Record<DependencyName, unknown>> = {};
    for (const dependency of dependencyNames) {
      if (!(dependency in props)) {
        dependencies[dependency] = container?.[dependency];
      }
    }

    const propsWithServices = { ...dependencies, ...props } as Props;
    return <Component {...propsWithServices} />;
  }

  return Wrapper;
}
