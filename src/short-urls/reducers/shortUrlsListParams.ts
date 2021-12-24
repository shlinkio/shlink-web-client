import { Order } from '../../utils/helpers/ordering';

export const SORTABLE_FIELDS = {
  dateCreated: 'Created at',
  shortCode: 'Short URL',
  longUrl: 'Long URL',
  title: 'Title',
  visits: 'Visits',
};

export type OrderableFields = keyof typeof SORTABLE_FIELDS;

export type ShortUrlsOrder = Order<OrderableFields>;
