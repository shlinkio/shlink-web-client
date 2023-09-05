import { parseQuery } from '@shlinkio/shlink-frontend-kit';
import { useLocation, useNavigate } from 'react-router-dom';

export const useGoBack = () => {
  const navigate = useNavigate();
  return () => navigate(-1);
};

export const useParsedQuery = <T>(): T => {
  const { search } = useLocation();
  return parseQuery<T>(search);
};
