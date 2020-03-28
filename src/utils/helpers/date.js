export const formatDate = (format = 'YYYY-MM-DD') => (date) => date && date.format ? date.format(format) : date;

export const formatIsoDate = (date) => date && date.format ? date.format() : date;
