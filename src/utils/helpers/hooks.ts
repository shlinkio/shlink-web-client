import { parseQuery } from '@shlinkio/shlink-frontend-kit';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useGoBack = () => {
  const navigate = useNavigate();
  return useCallback(() => navigate(-1), [navigate]);
};

export const useParsedQuery = <T>(): T => {
  const { search } = useLocation();
  return useMemo(() => parseQuery<T>(search), [search]);
};
