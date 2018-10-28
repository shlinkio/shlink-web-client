const DEFAULT_TIMEOUT_DELAY = 2000;

export const stateFlagTimeout = (setState, flagName, initialValue = true, delay = DEFAULT_TIMEOUT_DELAY) => {
  setState({ [flagName]: initialValue });
  setTimeout(() => setState({ [flagName]: !initialValue }), delay);
};

export const determineOrderDir = (clickedField, currentOrderField, currentOrderDir) => {
  if (currentOrderField !== clickedField) {
    return 'ASC';
  }

  const newOrderMap = {
    ASC: 'DESC',
    DESC: undefined,
  };

  return currentOrderDir ? newOrderMap[currentOrderDir] : 'ASC';
};
