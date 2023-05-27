import 'vitest-canvas-mock';
import 'chart.js/auto';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { setAutoFreeze } from 'immer';
import ResizeObserver from 'resize-observer-polyfill';
import { afterEach, expect } from 'vitest';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

(global as any).ResizeObserver = ResizeObserver;
(global as any).scrollTo = () => {};
(global as any).prompt = () => {};
(global as any).matchMedia = (media: string) => ({ matches: false, media });

setAutoFreeze(false); // TODO Bypassing a bug on jest
