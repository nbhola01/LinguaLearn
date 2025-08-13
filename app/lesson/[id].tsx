import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { lessonService, Lesson, Exercise } from '../../services/lessonService';
import MultipleChoiceExercise from '../../components/exercises/MultipleChoiceExercise';
import TranslationExercise from '../../components/exercises/TranslationExercise';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Web alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });

  useEffect(() => {
    if (id) {
      loadLesson(id);
    }
  }, [id]);

  const loadLesson = async (lessonId: string) => {
    try {
      setLoading(true);
      const lessonData = await lessonService.getLesson(lessonId);
      if (lessonData) {
        setLesson(lessonData);
      } else {
        showAlert('Error', 'Lesson not found', () => router.back());
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      showAlert('Error', 'Failed to load lesson', () => router.back());
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      const buttons = onOk ? [{ text: 'OK', onPress: onOk }] : undefined;
      require('react-native').Alert.alert(title, message, buttons);
    }
  };

  const handleAnswer = (isCorrect: boolean, userAnswer: string) => {
    const newAnswers = [...answers, { correct: isCorrect, answer: userAnswer }];
    setAnswers(newAnswers);

    if (currentExerciseIndex < (lesson?.exercises.length ?? 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      finishLesson(newAnswers);
    }
  };

  const finishLesson = async (finalAnswers: { correct: boolean; answer: string }[]) => {
    if (!lesson) return;

    const correctAnswers = finalAnswers.filter(a => a.correct).length;
    const totalQuestions = lesson.exercises.length;
    const score = (correctAnswers / totalQuestions) * 100;

    try {
      await lessonService.updateLessonProgress(lesson.id, 100);
      setLessonCompleted(true);
      setShowResult(true);
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const getProgressPercentage = () => {
    if (!lesson) return 0;
    return ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;
  };

  const renderExercise = (exercise: Exercise) => {
    switch (exercise.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceExercise
            key={exercise.id}
            exercise={exercise}
            onAnswer={handleAnswer}
          />
        );
      case 'translation':
        return (
          <TranslationExercise
            key={exercise.id}
            exercise={exercise}
            onAnswer={handleAnswer}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Text>Loading lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text>Lesson not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentExerciseIndex + 1} / {lesson.exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => showAlert(
            'Exit Lesson',
            'Are you sure you want to exit? Your progress will be lost.',
            () => router.back()
          )}
          activeOpacity={0.7}
        >
          <MaterialIcons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {!showResult ? (
        <View style={styles.exerciseContainer}>
          {renderExercise(lesson.exercises[currentExerciseIndex])}
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Surface style={styles.resultCard} elevation={3}>
            <View style={styles.resultHeader}>
              <MaterialIcons name="celebration" size={48} color="#58CC02" />
              <Text style={styles.resultTitle}>Lesson Complete!</Text>
              <Text style={styles.resultSubtitle}>{lesson.title}</Text>
            </View>

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatNumber}>
                  {answers.filter(a => a.correct).length}
                </Text>
                <Text style={styles.resultStatLabel}>Correct</Text>
              </View>
              
              <View style={styles.resultStat}>
                <Text style={styles.resultStatNumber}>
                  {lesson.exercises.length}
                </Text>
                <Text style={styles.resultStatLabel}>Total</Text>
              </View>
              
              <View style={styles.resultStat}>
                <Text style={styles.resultStatNumber}>+{lesson.xpReward}</Text>
                <Text style={styles.resultStatLabel}>XP</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Surface>
        </View>
      )}

      {/* Web Alert Modal */}
      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertTitle}>{alertConfig.title}</Text>
              <Text style={styles.alertMessage}>{alertConfig.message}</Text>
              <TouchableOpacity 
                style={styles.alertButton}
                onPress={() => {
                  alertConfig.onOk?.();
                  setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseContainer: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultCard: {
    width: '100%',
    padding: 32,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  resultStat: {
    alignItems: 'center',
  },
  resultStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  resultStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 150,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Web alert styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 280,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});