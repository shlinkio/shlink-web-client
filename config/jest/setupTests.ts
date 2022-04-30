import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import ResizeObserver from 'resize-observer-polyfill';

(global as any).ResizeObserver = ResizeObserver;
