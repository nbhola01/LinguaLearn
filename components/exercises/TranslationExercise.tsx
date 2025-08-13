
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { Exercise } from '../../services/lessonService';

interface TranslationExerciseProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, userAnswer: string) => void;
}

export default function TranslationExercise({ exercise, onAnswer }: TranslationExerciseProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (showResult || !userAnswer.trim()) return;
    
    const correct = userAnswer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(correct, userAnswer);
    }, 1500);
  };

  const getInputStyle = () => {
    if (!showResult) return styles.input;
    return isCorrect ? styles.correctInput : styles.incorrectInput;
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.questionContainer} elevation={2}>
        <Text style={styles.question}>{exercise.question}</Text>
      </Surface>
      
      <View style={styles.answerContainer}>
        <TextInput
          style={getInputStyle()}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="Type your answer here..."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!showResult}
          multiline
          textAlignVertical="top"
        />
        
        {showResult && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <MaterialIcons 
                name={isCorrect ? "check-circle" : "cancel"} 
                size={24} 
                color={isCorrect ? "#58CC02" : "#FF4B4B"} 
              />
              <Text style={[styles.resultText, { color: isCorrect ? "#58CC02" : "#FF4B4B" }]}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </Text>
            </View>
            
            {!isCorrect && (
              <Text style={styles.correctAnswerText}>
                Correct answer: <Text style={styles.correctAnswer}>{exercise.correctAnswer}</Text>
              </Text>
            )}
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: userAnswer.trim() && !showResult ? '#58CC02' : '#E5E7EB',
              opacity: userAnswer.trim() && !showResult ? 1 : 0.6
            }
          ]}
          onPress={handleSubmit}
          disabled={!userAnswer.trim() || showResult}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.submitButtonText,
            { color: userAnswer.trim() && !showResult ? '#FFFFFF' : '#9CA3AF' }
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View> {/* This closing tag was missing */}
      
      {showResult && exercise.explanation && (
        <Surface style={styles.explanationContainer} elevation={1}>
          <View style={styles.explanationHeader}>
            <MaterialIcons name="lightbulb" size={20} color={isCorrect ? '#58CC02' : '#FF4B4B'} />
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
  answerContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  correctInput: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#58CC02',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  incorrectInput: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FF4B4B',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  resultContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  correctAnswer: {
    fontWeight: 'bold',
    color: '#374151',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
