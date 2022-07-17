import { Mock } from 'ts-mockery';

const createLinkMock = () => ({
  setAttribute: jest.fn(),
  click: jest.fn(),
  style: {},
});

export const appendChild = jest.fn();

export const removeChild = jest.fn();

export const windowMock = Mock.of<Window>({
  document: {
    createElement: jest.fn(createLinkMock),
    body: { appendChild, removeChild },
  },
});
