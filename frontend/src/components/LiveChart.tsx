import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { memo } from 'react';

interface LiveChartProps {
  data: { time: string; price: number }[];
  color: string;
}

export const LiveChart = memo(({ data, color }: LiveChartProps) => {
  return (
    <div className="h-32 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2d3748"
            vertical={false}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a202c',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ display: 'none' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // Performans için animasyonu kapatıyoruz (Doherty Eşiği!)
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
