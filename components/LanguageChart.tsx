import { WakaTimeLanguage } from '@/interfaces/stats';
import React from 'react';
import { Text, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';

interface LanguageChartProps {
  data: WakaTimeLanguage[];
}

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#6b7280',
];

export default function LanguageChart({ data }: LanguageChartProps) {
  // prepare data for Victory
  const chartData = data.slice(0, 5).map((lang, index) => ({
    languageName: lang.name,
    value: lang.total_seconds,
    color: COLORS[index % COLORS.length],
  }));

  const totalSeconds = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (totalSeconds === 0) {
    return (
      <View className="h-64 items-center justify-center">
        <Text className="text-neutral-500">No data available</Text>
      </View>
    );
  }

  return (
    <View className="h-64 justify-center items-center">
      <PolarChart
        data={chartData}
        colorKey="color"
        valueKey="value"
        labelKey="languageName"
      >
        <Pie.Chart>
          {({ slice }) => {
            // Remove 'label' from slice props to avoid type mismatch with Pie.Slice label prop
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { label, ...restSlice } = slice;
            return (
              // @ts-ignore
              <Pie.Slice
                {...restSlice}
                // color is included in restSlice
              />
            );
          }}
        </Pie.Chart>
      </PolarChart>

      {/* Legend */}
      <View className="flex-row flex-wrap justify-center mt-4 gap-2">
        {chartData.map((d) => (
          <View
            key={d.languageName}
            className="flex-row items-center mr-2 mb-1"
          >
            <View
              style={{ backgroundColor: d.color }}
              className="w-3 h-3 rounded-full mr-2"
            />
            <Text className="text-neutral-300 text-xs font-medium">
              {d.languageName}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
