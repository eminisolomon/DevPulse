import { useTheme } from '@/hooks/useTheme';
import { WakaTimeSummary } from '@/interfaces/summary';
import { Circle } from '@shopify/react-native-skia';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { Bar, CartesianChart, useChartPressState } from 'victory-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ActivityChartProps {
  data: WakaTimeSummary[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const { theme } = useTheme();

  const { state, isActive } = useChartPressState({ x: '', y: { y: 0 } });

  const chartData = data.map((day) => ({
    x: format(parseISO(day.range.date), 'EEE'),
    y: day.grand_total.total_seconds / 3600,
  }));

  const animatedXProps = useAnimatedProps(
    () =>
      ({
        text: `${state.x.value}`,
      }) as any,
  );

  const animatedYProps = useAnimatedProps(() => {
    const hours = typeof state.y.y.value === 'number' ? state.y.y.value : 0;
    return {
      text: `${hours.toFixed(1)} hours`,
    } as any;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['y']}
        padding={16}
        domainPadding={{ left: 20, right: 20, top: 20 }}
        chartPressState={state}
        axisOptions={{
          lineColor: theme.colors.border,
          labelColor: theme.colors.textSecondary,
        }}
      >
        {({ points, chartBounds }) => (
          <>
            <Bar
              points={points.y}
              chartBounds={chartBounds}
              color={theme.colors.primary}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
              animate={{ type: 'spring' }}
            />
            {isActive && (
              <Circle
                cx={state.x.position}
                cy={state.y.y.position}
                r={6}
                color={theme.colors.primary}
              />
            )}
          </>
        )}
      </CartesianChart>
      {isActive && (
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            animatedProps={animatedXProps}
            defaultValue=""
            style={[
              styles.tooltipText,
              { fontWeight: 'bold', color: theme.colors.text },
            ]}
          />
          <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            animatedProps={animatedYProps}
            defaultValue=""
            style={[
              styles.tooltipText,
              { color: theme.colors.textSecondary, fontSize: 10 },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 192,
    width: '100%',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tooltipText: {
    padding: 0,
    margin: 0,
    fontSize: 12,
  },
});
