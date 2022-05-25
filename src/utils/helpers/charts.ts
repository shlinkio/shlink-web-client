import { ActiveElement, ChartEvent, ChartType, TooltipItem } from 'chart.js';
import { prettify } from './numbers';

export const pointerOnHover = ({ native }: ChartEvent, [firstElement]: ActiveElement[]) => {
  if (!native?.target) {
    return;
  }

  const canvas = native.target as HTMLCanvasElement;

  canvas.style.cursor = firstElement ? 'pointer' : 'default';
};

export const renderChartLabel = ({ dataset, raw }: TooltipItem<ChartType>) => `${dataset.label}: ${prettify(`${raw}`)}`;

export const renderPieChartLabel = ({ label, raw }: TooltipItem<ChartType>) => `${label}: ${prettify(`${raw}`)}`;
