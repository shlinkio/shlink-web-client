const TEN_ROUNDING_NUMBER = 10;
const { ceil } = Math;

const formatter = new Intl.NumberFormat('en-US');

export const prettify = (number) => formatter.format(number);

export const roundTen = (number) => ceil(number / TEN_ROUNDING_NUMBER) * TEN_ROUNDING_NUMBER;
