import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  text?: string;
}

export default function ProgressCircle({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#58CC02',
  backgroundColor = '#E5E5E5',
  showText = true,
  text
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Surface style={[styles.container, { width: size, height: size }]} elevation={2}>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBackground,
            {
              width: size - strokeWidth,
              height: size - strokeWidth,
              borderRadius: (size - strokeWidth) / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor,
            }
          ]}
        />
        <View
          style={[
            styles.progressForeground,
            {
              width: size - strokeWidth,
              height: size - strokeWidth,
              borderRadius: (size - strokeWidth) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: color,
              borderRightColor: progress > 25 ? color : 'transparent',
              borderBottomColor: progress > 50 ? color : 'transparent',
              borderLeftColor: progress > 75 ? color : 'transparent',
              transform: [{ rotate: '-90deg' }],
            }
          ]}
        />
        {showText && (
          <View style={styles.textContainer}>
            <Text style={styles.progressText}>
              {text || `${Math.round(progress)}%`}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
  },
  progressForeground: {
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});