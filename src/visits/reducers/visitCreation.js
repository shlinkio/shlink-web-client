export const CREATE_VISIT = 'shlink/visitCreation/CREATE_VISIT';

export const createNewVisit = ({ shortUrl, visit }) => ({ shortUrl, visit, type: CREATE_VISIT });
