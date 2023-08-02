import { createContext, useContext } from 'react';

const RoutesPrefixContext = createContext('');

export const RoutesPrefixProvider = RoutesPrefixContext.Provider;

export const useRoutesPrefix = (): string => useContext(RoutesPrefixContext);
