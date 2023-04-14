import { fromAny, fromPartial } from '@total-typescript/shoehorn';

const createLinkMock = () => ({
  setAttribute: jest.fn(),
  click: jest.fn(),
  style: {},
});

export const appendChild = jest.fn();

export const removeChild = jest.fn();

export const windowMock = fromPartial<Window>({
  document: fromAny({
    createElement: jest.fn(createLinkMock),
    body: { appendChild, removeChild },
  }),
});
