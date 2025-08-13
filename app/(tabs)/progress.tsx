import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { lessonService, UserProgress, Lesson } from '../../services/lessonService';
import ProgressCircle from '../../components/ui/ProgressCircle';

export default function ProgressScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [progress, lessonData] = await Promise.all([
        lessonService.getUserProgress(),
        lessonService.getLessons()
      ]);
      setUserProgress(progress);
      setLessons(lessonData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallProgress = () => {
    if (lessons.length === 0) return 0;
    const totalProgress = lessons.reduce((sum, lesson) => sum + lesson.progress, 0);
    return totalProgress / lessons.length;
  };

  const getCompletedLessons = () => {
    return lessons.filter(lesson => lesson.completed).length;
  };

  const getCategoryProgress = () => {
    const categories = lessons.reduce((acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = { total: 0, completed: 0 };
      }
      acc[lesson.category].total++;
      if (lesson.completed) {
        acc[lesson.category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return Object.entries(categories).map(([category, data]) => ({
      category,
      progress: (data.completed / data.total) * 100,
      completed: data.completed,
      total: data.total
    }));
  };

  if (loading || !userProgress) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text>Loading progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categoryProgress = getCategoryProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Surface style={styles.overallCard} elevation={3}>
          <View style={styles.overallHeader}>
            <View style={styles.overallInfo}>
              <Text style={styles.overallTitle}>Overall Progress</Text>
              <Text style={styles.overallStats}>
                {getCompletedLessons()} of {lessons.length} lessons completed
              </Text>
            </View>
            <ProgressCircle
              progress={getOverallProgress()}
              size={80}
              color="#58CC02"
            />
          </View>
        </Surface>

        <View style={styles.statsGrid}>
          <Surface style={styles.statCard} elevation={2}>
            <View style={styles.statContent}>
              <MaterialIcons name="local-fire-department" size={32} color="#FF6B35" />
              <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
          </Surface>

          <Surface style={styles.statCard} elevation={2}>
            <View style={styles.statContent}>
              <MaterialIcons name="military-tech" size={32} color="#FFD700" />
              <Text style={styles.statNumber}>{userProgress.longestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
          </Surface>

          <Surface style={styles.statCard} elevation={2}>
            <View style={styles.statContent}>
              <MaterialIcons name="star" size={32} color="#FFD700" />
              <Text style={styles.statNumber}>{userProgress.totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </Surface>

          <Surface style={styles.statCard} elevation={2}>
            <View style={styles.statContent}>
              <MaterialIcons name="emoji-events" size={32} color="#8B5CF6" />
              <Text style={styles.statNumber}>{userProgress.achievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </Surface>
        </View>

        <Surface style={styles.categoryCard} elevation={2}>
          <Text style={styles.categoryTitle}>Progress by Category</Text>
          
          {categoryProgress.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryStats}>
                  {category.completed}/{category.total} lessons
                </Text>
              </View>
              <View style={styles.categoryProgressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${category.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.categoryPercentage}>
                  {Math.round(category.progress)}%
                </Text>
              </View>
            </View>
          ))}
        </Surface>

        <Surface style={styles.achievementsCard} elevation={2}>
          <View style={styles.achievementsHeader}>
            <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
            <Text style={styles.achievementsTitle}>Achievements</Text>
          </View>
          
          {userProgress.achievements.length > 0 ? (
            <View style={styles.achievementsList}>
              {userProgress.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <MaterialIcons name="military-tech" size={24} color="#FFD700" />
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementName}>
                      {getAchievementName(achievement)}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {getAchievementDescription(achievement)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noAchievements}>
              Complete lessons and maintain streaks to earn achievements!
            </Text>
          )}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function getAchievementName(achievementId: string): string {
  switch (achievementId) {
    case 'first-100-xp': return 'XP Collector';
    case 'week-streak': return 'Week Warrior';
    default: return 'Achievement';
  }
}

function getAchievementDescription(achievementId: string): string {
  switch (achievementId) {
    case 'first-100-xp': return 'Earned your first 100 XP points';
    case 'week-streak': return 'Maintained a 7-day learning streak';
    default: return 'Achievement unlocked';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  overallCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallInfo: {
    flex: 1,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  overallStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 40,
    textAlign: 'right',
  },
  achievementsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
  },
  achievementContent: {
    flex: 1,
    marginLeft: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#A16207',
  },
  noAchievements: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});