const TEN_ROUNDING_NUMBER = 10;
const { ceil } = Math;

export const roundTen = (number) => ceil(number / TEN_ROUNDING_NUMBER) * TEN_ROUNDING_NUMBER;
