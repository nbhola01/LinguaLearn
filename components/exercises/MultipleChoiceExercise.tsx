import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { Exercise } from '../../services/lessonService';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
}

export default function MultipleChoiceExercise({ exercise, onAnswer }: MultipleChoiceExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === exercise.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect, answer);
    }, 1500);
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? styles.selectedOption : styles.option;
    }
    
    if (option === exercise.correctAnswer) {
      return styles.correctOption;
    }
    
    if (option === selectedAnswer && selectedAnswer !== exercise.correctAnswer) {
      return styles.incorrectOption;
    }
    
    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? styles.selectedOptionText : styles.optionText;
    }
    
    if (option === exercise.correctAnswer) {
      return styles.correctOptionText;
    }
    
    if (option === selectedAnswer && selectedAnswer !== exercise.correctAnswer) {
      return styles.incorrectOptionText;
    }
    
    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.questionContainer} elevation={2}>
        <Text style={styles.question}>{exercise.question}</Text>
      </Surface>
      
      <View style={styles.optionsContainer}>
        {exercise.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleAnswer(option)}
            disabled={showResult}
            activeOpacity={0.7}
          >
            <Text style={getOptionTextStyle(option)}>{option}</Text>
            {showResult && option === exercise.correctAnswer && (
              <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
            )}
            {showResult && option === selectedAnswer && selectedAnswer !== exercise.correctAnswer && (
              <MaterialIcons name="cancel" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {showResult && exercise.explanation && (
        <Surface style={styles.explanationContainer} elevation={1}>
          <View style={styles.explanationHeader}>
            <MaterialIcons 
              name="lightbulb" 
              size={20} 
              color={selectedAnswer === exercise.correctAnswer ? '#58CC02' : '#FF4B4B'} 
            />
            <Text style={styles.explanationTitle}>Explanation</Text>
          </View>
          <Text style={styles.explanationText}>{exercise.explanation}</Text>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#58CC02',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#58CC02',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incorrectOption: {
    backgroundColor: '#FF4B4B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF4B4B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  correctOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  incorrectOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});