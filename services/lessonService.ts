export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'translation' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  translation?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  xpReward: number;
  exercises: Exercise[];
  completed: boolean;
  progress: number;
}

export interface UserProgress {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  achievements: string[];
  dailyGoal: number;
  dailyProgress: number;
  lastStudyDate: string;
}

class LessonService {
  private lessons: Lesson[] = [
    {
      id: '1',
      title: 'Basic Greetings',
      description: 'Learn how to say hello and goodbye',
      difficulty: 'beginner',
      category: 'Basics',
      xpReward: 15,
      completed: false,
      progress: 0,
      exercises: [
        {
          id: '1-1',
          type: 'multiple-choice',
          question: 'How do you say "Hello" in Spanish?',
          options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
          correctAnswer: 'Hola',
          explanation: 'Hola is the most common way to say hello in Spanish.'
        },
        {
          id: '1-2',
          type: 'translation',
          question: 'Translate: Good morning',
          correctAnswer: 'Buenos días',
          explanation: 'Buenos días is used to greet someone in the morning.'
        },
        {
          id: '1-3',
          type: 'multiple-choice',
          question: 'What does "Adiós" mean?',
          options: ['Hello', 'Thank you', 'Goodbye', 'Please'],
          correctAnswer: 'Goodbye',
          explanation: 'Adiós means goodbye in Spanish.'
        }
      ]
    },
    {
      id: '2',
      title: 'Numbers 1-10',
      description: 'Learn to count from one to ten',
      difficulty: 'beginner',
      category: 'Numbers',
      xpReward: 20,
      completed: false,
      progress: 0,
      exercises: [
        {
          id: '2-1',
          type: 'multiple-choice',
          question: 'How do you say "one" in Spanish?',
          options: ['dos', 'uno', 'tres', 'cuatro'],
          correctAnswer: 'uno',
          explanation: 'Uno is the number one in Spanish.'
        },
        {
          id: '2-2',
          type: 'fill-blank',
          question: 'Fill in the blank: Uno, dos, ___, cuatro',
          correctAnswer: 'tres',
          explanation: 'Tres is the number three in Spanish.'
        }
      ]
    },
    {
      id: '3',
      title: 'Family Members',
      description: 'Learn words for family relationships',
      difficulty: 'beginner',
      category: 'Family',
      xpReward: 25,
      completed: false,
      progress: 0,
      exercises: [
        {
          id: '3-1',
          type: 'multiple-choice',
          question: 'How do you say "mother" in Spanish?',
          options: ['padre', 'hermano', 'madre', 'hijo'],
          correctAnswer: 'madre',
          explanation: 'Madre means mother in Spanish.'
        },
        {
          id: '3-2',
          type: 'translation',
          question: 'Translate: My father',
          correctAnswer: 'Mi padre',
          explanation: 'Mi padre means my father in Spanish.'
        }
      ]
    }
  ];

  private userProgress: UserProgress = {
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lessonsCompleted: 0,
    achievements: [],
    dailyGoal: 50,
    dailyProgress: 0,
    lastStudyDate: ''
  };

  async getLessons(): Promise<Lesson[]> {
    return this.lessons;
  }

  async getLesson(id: string): Promise<Lesson | null> {
    return this.lessons.find(lesson => lesson.id === id) || null;
  }

  async getUserProgress(): Promise<UserProgress> {
    return this.userProgress;
  }

  async updateLessonProgress(lessonId: string, progress: number): Promise<void> {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.progress = progress;
      if (progress >= 100) {
        lesson.completed = true;
        this.userProgress.lessonsCompleted++;
        this.userProgress.totalXP += lesson.xpReward;
        this.userProgress.dailyProgress += lesson.xpReward;
        this.updateStreak();
      }
    }
  }

  private updateStreak(): void {
    const today = new Date().toDateString();
    const lastStudy = new Date(this.userProgress.lastStudyDate).toDateString();
    
    if (lastStudy !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStudy === yesterday.toDateString()) {
        this.userProgress.currentStreak++;
      } else if (lastStudy !== today) {
        this.userProgress.currentStreak = 1;
      }
      
      this.userProgress.lastStudyDate = today;
      
      if (this.userProgress.currentStreak > this.userProgress.longestStreak) {
        this.userProgress.longestStreak = this.userProgress.currentStreak;
      }
    }
  }

  async checkAchievements(): Promise<string[]> {
    const newAchievements: string[] = [];
    
    if (this.userProgress.totalXP >= 100 && !this.userProgress.achievements.includes('first-100-xp')) {
      newAchievements.push('first-100-xp');
      this.userProgress.achievements.push('first-100-xp');
    }
    
    if (this.userProgress.currentStreak >= 7 && !this.userProgress.achievements.includes('week-streak')) {
      newAchievements.push('week-streak');
      this.userProgress.achievements.push('week-streak');
    }
    
    return newAchievements;
  }
}

export const lessonService = new LessonService();