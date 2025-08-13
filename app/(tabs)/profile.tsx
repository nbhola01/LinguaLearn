import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { lessonService, UserProgress } from '../../services/lessonService';

export default function ProfileScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      const progress = await lessonService.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getXPLevel = (totalXP: number) => {
    return Math.floor(totalXP / 100) + 1;
  };

  const getXPProgress = (totalXP: number) => {
    return totalXP % 100;
  };

  if (loading || !userProgress) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={60} color="#58CC02" />
          </View>
          <Text style={styles.username}>Language Learner</Text>
          <Text style={styles.level}>Level {getXPLevel(userProgress.totalXP)}</Text>
        </View>

        <Surface style={styles.xpCard} elevation={2}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>Experience Points</Text>
            <Text style={styles.xpTotal}>{userProgress.totalXP} XP</Text>
          </View>
          <View style={styles.xpProgressContainer}>
            <View style={styles.xpProgressBar}>
              <View 
                style={[
                  styles.xpProgressFill, 
                  { width: `${getXPProgress(userProgress.totalXP)}%` }
                ]} 
              />
            </View>
            <Text style={styles.xpProgressText}>
              {getXPProgress(userProgress.totalXP)}/100 to Level {getXPLevel(userProgress.totalXP) + 1}
            </Text>
          </View>
        </Surface>

        <Surface style={styles.statsCard} elevation={2}>
          <Text style={styles.statsTitle}>Learning Statistics</Text>
          
          <View style={styles.statsList}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Current Streak</Text>
                <Text style={styles.statValue}>{userProgress.currentStreak} days</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="military-tech" size={24} color="#FFD700" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Longest Streak</Text>
                <Text style={styles.statValue}>{userProgress.longestStreak} days</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="school" size={24} color="#58CC02" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Lessons Completed</Text>
                <Text style={styles.statValue}>{userProgress.lessonsCompleted}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="emoji-events" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Achievements</Text>
                <Text style={styles.statValue}>{userProgress.achievements.length}</Text>
              </View>
            </View>
          </View>
        </Surface>

        <Surface style={styles.settingsCard} elevation={2}>
          <Text style={styles.settingsTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color="#6B7280" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="language" size={24} color="#6B7280" />
              <Text style={styles.settingLabel}>Learning Language</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>Spanish</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="flag" size={24} color="#6B7280" />
              <Text style={styles.settingLabel}>Daily Goal</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{userProgress.dailyGoal} XP</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="volume-up" size={24} color="#6B7280" />
              <Text style={styles.settingLabel}>Sound Effects</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={24} color="#6B7280" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </Surface>

        <View style={styles.footer}>
          <Text style={styles.footerText}>LinguaLearn v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for language learners</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  level: {
    fontSize: 16,
    color: '#58CC02',
    fontWeight: '600',
  },
  xpCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  xpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  xpTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  xpProgressContainer: {
    gap: 8,
  },
  xpProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 6,
  },
  xpProgressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsList: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
});