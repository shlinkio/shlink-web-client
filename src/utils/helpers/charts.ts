import { ActiveElement, ChartEvent, ChartType, TooltipItem } from 'chart.js';
import { prettify } from './numbers';

export const pointerOnHover = ({ native }: ChartEvent, [ firstElement ]: ActiveElement[]) => {
  if (!native?.target) {
    return;
  }

  (native.target as any).style.cursor = firstElement ? 'pointer' : 'default';
};

export const renderChartLabel = ({ dataset, label }: TooltipItem<ChartType>) => `${dataset.label}: ${prettify(label)}`;
