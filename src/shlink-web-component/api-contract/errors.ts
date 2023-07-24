export enum ErrorTypeV2 {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  INVALID_SHORT_URL_DELETION = 'INVALID_SHORT_URL_DELETION',
  DOMAIN_NOT_FOUND = 'DOMAIN_NOT_FOUND',
  FORBIDDEN_OPERATION = 'FORBIDDEN_OPERATION',
  INVALID_URL = 'INVALID_URL',
  INVALID_SLUG = 'INVALID_SLUG',
  INVALID_SHORTCODE = 'INVALID_SHORTCODE',
  TAG_CONFLICT = 'TAG_CONFLICT',
  TAG_NOT_FOUND = 'TAG_NOT_FOUND',
  MERCURE_NOT_CONFIGURED = 'MERCURE_NOT_CONFIGURED',
  INVALID_AUTHORIZATION = 'INVALID_AUTHORIZATION',
  INVALID_API_KEY = 'INVALID_API_KEY',
  NOT_FOUND = 'NOT_FOUND',
}

export enum ErrorTypeV3 {
  INVALID_ARGUMENT = 'https://shlink.io/api/error/invalid-data',
  INVALID_SHORT_URL_DELETION = 'https://shlink.io/api/error/invalid-short-url-deletion',
  DOMAIN_NOT_FOUND = 'https://shlink.io/api/error/domain-not-found',
  FORBIDDEN_OPERATION = 'https://shlink.io/api/error/forbidden-tag-operation',
  INVALID_URL = 'https://shlink.io/api/error/invalid-url',
  INVALID_SLUG = 'https://shlink.io/api/error/non-unique-slug',
  INVALID_SHORTCODE = 'https://shlink.io/api/error/short-url-not-found',
  TAG_CONFLICT = 'https://shlink.io/api/error/tag-conflict',
  TAG_NOT_FOUND = 'https://shlink.io/api/error/tag-not-found',
  MERCURE_NOT_CONFIGURED = 'https://shlink.io/api/error/mercure-not-configured',
  INVALID_AUTHORIZATION = 'https://shlink.io/api/error/missing-authentication',
  INVALID_API_KEY = 'https://shlink.io/api/error/invalid-api-key',
  NOT_FOUND = 'https://shlink.io/api/error/not-found',
}

export interface ProblemDetailsError {
  type: string;
  detail: string;
  title: string;
  status: number;
  [extraProps: string]: any;
}

export interface InvalidArgumentError extends ProblemDetailsError {
  type: ErrorTypeV2.INVALID_ARGUMENT | ErrorTypeV3.INVALID_ARGUMENT;
  invalidElements: string[];
}

export interface InvalidShortUrlDeletion extends ProblemDetailsError {
  type: 'INVALID_SHORTCODE_DELETION' | ErrorTypeV2.INVALID_SHORT_URL_DELETION | ErrorTypeV3.INVALID_SHORT_URL_DELETION;
  threshold: number;
}

export interface RegularNotFound extends ProblemDetailsError {
  type: ErrorTypeV2.NOT_FOUND | ErrorTypeV3.NOT_FOUND;
  status: 404;
}
