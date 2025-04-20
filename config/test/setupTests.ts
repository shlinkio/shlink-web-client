import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clear all mocks and cleanup DOM after every test
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
