import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { lessonService, UserProgress } from '../../services/lessonService';
import ProgressCircle from '../../components/ui/ProgressCircle';

export default function HomeScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadUserProgress();
    setGreeting(getGreeting());
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await lessonService.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  const getDailyGoalProgress = () => {
    if (!userProgress) return 0;
    return Math.min((userProgress.dailyProgress / userProgress.dailyGoal) * 100, 100);
  };

  if (!userProgress) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>Ready to learn?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <MaterialIcons name="person" size={28} color="#58CC02" />
          </TouchableOpacity>
        </View>

        <Surface style={styles.dailyGoalCard} elevation={3}>
          <View style={styles.dailyGoalHeader}>
            <View style={styles.dailyGoalInfo}>
              <Text style={styles.dailyGoalTitle}>Daily Goal</Text>
              <Text style={styles.dailyGoalProgress}>
                {userProgress.dailyProgress} / {userProgress.dailyGoal} XP
              </Text>
            </View>
            <ProgressCircle
              progress={getDailyGoalProgress()}
              size={70}
              color="#58CC02"
              text={`${Math.round(getDailyGoalProgress())}%`}
            />
          </View>
          
          {getDailyGoalProgress() >= 100 ? (
            <View style={styles.goalCompleted}>
              <MaterialIcons name="check-circle" size={24} color="#58CC02" />
              <Text style={styles.goalCompletedText}>Daily goal completed! 🎉</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/lessons')}
              activeOpacity={0.7}
            >
              <Text style={styles.continueButtonText}>Continue Learning</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </Surface>

        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={2}>
            <View style={styles.statContent}>
              <MaterialIcons name="local-fire-department" size={32} color="#FF6B35" />
              <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
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
              <MaterialIcons name="school" size={32} color="#58CC02" />
              <Text style={styles.statNumber}>{userProgress.lessonsCompleted}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </Surface>
        </View>

        <Surface style={styles.achievementsCard} elevation={2}>
          <View style={styles.achievementsHeader}>
            <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
            <Text style={styles.achievementsTitle}>Recent Achievements</Text>
          </View>
          
          {userProgress.achievements.length > 0 ? (
            <View style={styles.achievementsList}>
              {userProgress.achievements.slice(-3).map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <MaterialIcons name="military-tech" size={20} color="#FFD700" />
                  <Text style={styles.achievementText}>
                    {getAchievementName(achievement)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noAchievements}>Complete lessons to earn achievements!</Text>
          )}
        </Surface>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/lessons')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="play-circle-filled" size={48} color="#58CC02" />
            <Text style={styles.actionButtonText}>Start Lesson</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/progress')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="trending-up" size={48} color="#3B82F6" />
            <Text style={styles.actionButtonText}>View Progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getAchievementName(achievementId: string): string {
  switch (achievementId) {
    case 'first-100-xp': return 'First 100 XP earned!';
    case 'week-streak': return '7-day streak achieved!';
    default: return 'Achievement unlocked!';
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyGoalCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyGoalInfo: {
    flex: 1,
  },
  dailyGoalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dailyGoalProgress: {
    fontSize: 14,
    color: '#6B7280',
  },
  goalCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  goalCompletedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58CC02',
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#58CC02',
    padding: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    fontWeight: '500',
  },
  noAchievements: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});