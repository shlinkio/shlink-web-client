export type OrderDir = 'ASC' | 'DESC' | undefined;

export interface Order<Fields> {
  field?: Fields;
  dir?: OrderDir;
}

export const determineOrderDir = <T extends string = string>(
  currentField: T,
  newField?: T,
  currentOrderDir?: OrderDir,
): OrderDir => {
  if (currentField !== newField) {
    return 'ASC';
  }

  const newOrderMap: Record<'ASC' | 'DESC', OrderDir> = {
    ASC: 'DESC',
    DESC: undefined,
  };

  return currentOrderDir ? newOrderMap[currentOrderDir] : 'ASC';
};

export const sortList = <List>(list: List[], { field, dir }: Order<Partial<keyof List>>) => (
  !field || !dir ? list : list.sort((a, b) => {
    const greaterThan = dir === 'ASC' ? 1 : -1;
    const smallerThan = dir === 'ASC' ? -1 : 1;

    return a[field] > b[field] ? greaterThan : smallerThan;
  })
);

export const orderToString = <T>(order: Order<T>): string | undefined => (
  order.dir ? `${order.field}-${order.dir}` : undefined
);

export const stringToOrder = <T>(order: string): Order<T> => {
  const [field, dir] = order.split('-') as [ T | undefined, OrderDir | undefined ];
  return { field, dir };
};
