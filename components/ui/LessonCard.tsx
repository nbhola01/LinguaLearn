import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import ProgressCircle from './ProgressCircle';
import { Lesson } from '../../services/lessonService';

interface LessonCardProps {
  lesson: Lesson;
  onPress: () => void;
}

export default function LessonCard({ lesson, onPress }: LessonCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#58CC02';
      case 'intermediate': return '#FF9600';
      case 'advanced': return '#FF4B4B';
      default: return '#58CC02';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'basics': return 'waving-hand';
      case 'numbers': return 'numbers';
      case 'family': return 'family-restroom';
      default: return 'school';
    }
  };

  return (
    <Surface style={styles.container} elevation={3}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name={getCategoryIcon(lesson.category)} 
              size={24} 
              color={getDifficultyColor(lesson.difficulty)} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.description}>{lesson.description}</Text>
          </View>
          <ProgressCircle 
            progress={lesson.progress} 
            size={50}
            color={getDifficultyColor(lesson.difficulty)}
          />
        </View>
        
        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(lesson.difficulty) }]}>
                {lesson.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.xpContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.xpText}>{lesson.xpReward} XP</Text>
            </View>
          </View>
          
          {lesson.completed && (
            <View style={styles.completedContainer}>
              <MaterialIcons name="check-circle" size={18} color="#58CC02" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#58CC02',
    marginLeft: 4,
  },
});