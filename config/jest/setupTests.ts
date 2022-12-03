import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import ResizeObserver from 'resize-observer-polyfill';
import { setAutoFreeze } from 'immer';

(global as any).ResizeObserver = ResizeObserver;
(global as any).scrollTo = () => {};
(global as any).prompt = () => {};
(global as any).matchMedia = (media: string) => ({ matches: false, media });

setAutoFreeze(false); // TODO Bypassing a bug on jest
