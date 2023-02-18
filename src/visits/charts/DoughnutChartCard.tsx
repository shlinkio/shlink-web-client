import type { FC } from 'react';
import type { Stats } from '../types';
import { ChartCard } from './ChartCard';
import { DoughnutChart } from './DoughnutChart';

interface DoughnutChartCardProps {
  title: string;
  stats: Stats;
}

export const DoughnutChartCard: FC<DoughnutChartCardProps> = ({ title, stats }) => (
  <ChartCard title={title}>
    <DoughnutChart stats={stats} />
  </ChartCard>
);
