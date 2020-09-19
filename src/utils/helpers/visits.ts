import bowser from 'bowser';
import { zipObj } from 'ramda';
import { ChartData, ChartTooltipItem } from 'chart.js';
import { Empty, hasValue } from '../utils';
import { Stats, UserAgent } from '../../visits/types';
import { prettify } from './numbers';

const DEFAULT = 'Others';
const BROWSERS_WHITELIST = [
  'Android Browser',
  'Chrome',
  'Chromium',
  'Firefox',
  'Internet Explorer',
  'Microsoft Edge',
  'Opera',
  'Safari',
  'Samsung Internet for Android',
  'Vivaldi',
  'WeChat',
];

export const parseUserAgent = (userAgent: string | Empty): UserAgent => {
  if (!hasValue(userAgent)) {
    return { browser: DEFAULT, os: DEFAULT };
  }

  const { browser: { name: browser }, os: { name: os } } = bowser.parse(userAgent);

  return { os: os ?? DEFAULT, browser: browser && BROWSERS_WHITELIST.includes(browser) ? browser : DEFAULT };
};

export const extractDomain = (url: string | Empty): string => {
  if (!hasValue(url)) {
    return 'Direct';
  }

  return url.split('/')[url.includes('://') ? 2 : 0]?.split(':')[0] ?? '';
};

export const fillTheGaps = (stats: Stats, labels: string[]): number[] =>
  Object.values({ ...zipObj(labels, labels.map(() => 0)), ...stats });

export const renderDoughnutChartLabel = (
  { datasetIndex, index }: ChartTooltipItem,
  { labels, datasets }: ChartData,
) => {
  const datasetLabel = index !== undefined && labels?.[index] || '';
  const value = datasetIndex !== undefined && index !== undefined
    && datasets?.[datasetIndex]?.data?.[index]
    || '';

  return `${datasetLabel}: ${prettify(Number(value))}`;
};

export const renderNonDoughnutChartLabel = (labelToPick: 'yLabel' | 'xLabel') => (
  item: ChartTooltipItem,
  { datasets }: ChartData,
) => {
  const { datasetIndex } = item;
  const value = item[labelToPick];
  const datasetLabel = datasetIndex !== undefined && datasets?.[datasetIndex]?.label || '';

  return `${datasetLabel}: ${prettify(Number(value))}`;
};
