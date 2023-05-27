import { fromAny, fromPartial } from '@total-typescript/shoehorn';

const createLinkMock = () => ({
  setAttribute: vi.fn(),
  click: vi.fn(),
  style: {},
});

export const appendChild = vi.fn();

export const removeChild = vi.fn();

export const windowMock = fromPartial<Window>({
  document: fromAny({
    createElement: vi.fn(createLinkMock),
    body: { appendChild, removeChild },
  }),
});
