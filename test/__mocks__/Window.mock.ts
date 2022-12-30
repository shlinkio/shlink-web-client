import { Mock } from 'ts-mockery';

const createLinkMock = () => ({
  setAttribute: vi.fn(),
  click: vi.fn(),
  style: {},
});

export const appendChild = vi.fn();

export const removeChild = vi.fn();

export const windowMock = Mock.of<Window>({
  document: {
    createElement: vi.fn(createLinkMock),
    body: { appendChild, removeChild },
  },
});
