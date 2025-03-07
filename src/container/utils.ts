import type { IContainer } from 'bottlejs';
import type { FC } from 'react';
import { useMemo } from 'react';

export type FCWithDeps<Props, Deps> = FC<Props> & Partial<Deps>;

export function useDependencies<Deps>(obj: Deps): Omit<Required<Deps>, keyof FC> {
  return useMemo(() => obj as Omit<Required<Deps>, keyof FC>, [obj]);
}

export function componentFactory<Deps, CompType = Omit<Partial<Deps>, keyof FC>>(
  Component: CompType,
  deps: ReadonlyArray<keyof CompType>,
) {
  return (container: IContainer, console = globalThis.console) => {
    deps.forEach((dep) => {
      const resolvedDependency = container[dep as string];
      if (!resolvedDependency && process.env.NODE_ENV !== 'production') {
        console.error(`[Debug] Could not find "${dep as string}" dependency in container`);
      }

      Component[dep] = resolvedDependency;
    });

    return Component;
  };
}
