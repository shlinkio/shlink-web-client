export const replaceAuthorityFromUri = (uri: string, newAuthority: string): string => {
  const [schema, rest] = uri.split('://');
  const [, ...pathParts] = rest.split('/');
  const normalizedPath = pathParts.length ? `/${pathParts.join('/')}` : '';

  return `${schema}://${newAuthority}${normalizedPath}`;
};
