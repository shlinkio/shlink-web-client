import { ChangeEvent, FC } from 'react';
import { ChartData, ChartTooltipItem } from 'chart.js';
import { prettify } from './numbers';

export const pointerOnHover = ({ target }: ChangeEvent<HTMLElement>, chartElement: FC[]) => {
  target.style.cursor = chartElement[0] ? 'pointer' : 'default';
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

export const renderDoughnutChartLabel = (
  { datasetIndex, index }: ChartTooltipItem,
  { labels, datasets }: ChartData,
) => {
  const datasetLabel = index !== undefined && labels?.[index] || '';
  const value = datasetIndex !== undefined && index !== undefined
    && datasets?.[datasetIndex]?.data?.[index]
    || '';

  return `${datasetLabel}: ${prettify(Number(value))}`; // eslint-disable-line @typescript-eslint/no-base-to-string
};
