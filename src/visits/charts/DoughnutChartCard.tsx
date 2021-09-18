import { FC } from 'react';
import { Stats } from '../types';
import { DoughnutChart } from './DoughnutChart';
import { ChartCard } from './ChartCard';

interface DoughnutChartCardProps {
  title: string;
  stats: Stats;
}

export const DoughnutChartCard: FC<DoughnutChartCardProps> = ({ title, stats }) => (
  <ChartCard title={title}>
    <DoughnutChart stats={stats} />
  </ChartCard>
);
