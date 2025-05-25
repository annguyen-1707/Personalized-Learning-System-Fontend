// Mock Admins
export const mockAdmins = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Super Admin',
    lastLogin: '2023-07-12T08:30:00Z',
    permissions: {
      manageUsers: true,
      manageCourses: true,
      manageAdmins: true,
      viewLogs: true
    }
  },
  {
    id: '2',
    name: 'Content Manager',
    email: 'content@example.com',
    role: 'Content Admin',
    lastLogin: '2023-07-10T10:15:00Z',
    permissions: {
      manageUsers: false,
      manageCourses: true,
      manageAdmins: false,
      viewLogs: false
    }
  },
  {
    id: '3',
    name: 'User Manager',
    email: 'users@example.com',
    role: 'User Admin',
    lastLogin: '2023-07-11T14:20:00Z',
    permissions: {
      manageUsers: true,
      manageCourses: false,
      manageAdmins: false,
      viewLogs: true
    }
  }
];

// Mock Users
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    joinDate: '2023-01-15T10:00:00Z',
    lastActive: '2023-07-12T15:30:00Z',
    progress: 65
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    joinDate: '2023-02-20T11:30:00Z',
    lastActive: '2023-07-11T09:45:00Z',
    progress: 78
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    status: 'inactive',
    joinDate: '2023-03-05T14:20:00Z',
    lastActive: '2023-06-30T16:15:00Z',
    progress: 42
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    status: 'active',
    joinDate: '2023-04-10T09:15:00Z',
    lastActive: '2023-07-12T11:30:00Z',
    progress: 91
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    status: 'active',
    joinDate: '2023-05-25T13:45:00Z',
    lastActive: '2023-07-10T10:20:00Z',
    progress: 23
  }
];

// Mock Courses
export const mockCourses = [
  {
    id: '1',
    title: 'English for Beginners',
    description: 'A comprehensive course for those starting to learn English.',
    level: 'Beginner',
    duration: '12 weeks',
    enrolledStudents: 156,
    status: 'active',
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2023-06-15T14:30:00Z',
    completion: 78
  },
  {
    id: '2',
    title: 'Intermediate English',
    description: 'Enhance your English skills with more complex topics and vocabulary.',
    level: 'Intermediate',
    duration: '10 weeks',
    enrolledStudents: 98,
    status: 'active',
    createdAt: '2023-02-05T10:30:00Z',
    updatedAt: '2023-06-20T11:15:00Z',
    completion: 62
  },
  {
    id: '3',
    title: 'Business English',
    description: 'English focused on professional settings and business communication.',
    level: 'Advanced',
    duration: '8 weeks',
    enrolledStudents: 74,
    status: 'active',
    createdAt: '2023-03-15T09:45:00Z',
    updatedAt: '2023-07-01T15:00:00Z',
    completion: 45
  },
  {
    id: '4',
    title: 'English for Academic Purposes',
    description: 'Prepare for academic studies with this specialized English course.',
    level: 'Advanced',
    duration: '14 weeks',
    enrolledStudents: 63,
    status: 'draft',
    createdAt: '2023-04-20T13:20:00Z',
    updatedAt: '2023-07-05T10:45:00Z',
    completion: 25
  },
  {
    id: '5',
    title: 'Conversational English',
    description: 'Focus on speaking fluently and naturally in everyday situations.',
    level: 'Intermediate',
    duration: '6 weeks',
    enrolledStudents: 112,
    status: 'active',
    createdAt: '2023-05-10T11:00:00Z',
    updatedAt: '2023-07-10T09:30:00Z',
    completion: 85
  }
];

// Mock Lessons
export const mockLessons = [
  {
    id: '1',
    courseId: '1',
    title: 'Introduction to English Alphabet',
    description: 'Learn the English alphabet and basic pronunciation.',
    order: 1,
    duration: '45 minutes',
    status: 'published',
    createdAt: '2023-01-12T10:00:00Z',
    updatedAt: '2023-01-12T10:00:00Z'
  },
  {
    id: '2',
    courseId: '1',
    title: 'Basic Greetings and Introductions',
    description: 'Learn how to greet people and introduce yourself in English.',
    order: 2,
    duration: '60 minutes',
    status: 'published',
    createdAt: '2023-01-14T11:30:00Z',
    updatedAt: '2023-01-14T11:30:00Z'
  },
  {
    id: '3',
    courseId: '1',
    title: 'Numbers and Counting',
    description: 'Learn numbers and how to count in English.',
    order: 3,
    duration: '50 minutes',
    status: 'published',
    createdAt: '2023-01-16T09:45:00Z',
    updatedAt: '2023-01-16T09:45:00Z'
  },
  {
    id: '4',
    courseId: '2',
    title: 'Present Tense Mastery',
    description: 'Deep dive into present simple and present continuous tenses.',
    order: 1,
    duration: '75 minutes',
    status: 'published',
    createdAt: '2023-02-07T14:20:00Z',
    updatedAt: '2023-02-07T14:20:00Z'
  },
  {
    id: '5',
    courseId: '2',
    title: 'Describing People and Places',
    description: 'Learn vocabulary and structures to describe people and places.',
    order: 2,
    duration: '65 minutes',
    status: 'published',
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-02-10T10:15:00Z'
  },
  {
    id: '6',
    courseId: '3',
    title: 'Business Communication',
    description: 'Learn how to communicate effectively in business settings.',
    order: 1,
    duration: '90 minutes',
    status: 'published',
    createdAt: '2023-03-17T13:40:00Z',
    updatedAt: '2023-03-17T13:40:00Z'
  },
  {
    id: '7',
    courseId: '3',
    title: 'Meeting Vocabulary and Phrases',
    description: 'Essential vocabulary and phrases for business meetings.',
    order: 2,
    duration: '60 minutes',
    status: 'draft',
    createdAt: '2023-03-20T11:25:00Z',
    updatedAt: '2023-03-20T11:25:00Z'
  }
];

// Mock System Logs
export const mockSystemLogs = [
  {
    id: '1',
    timestamp: '2023-07-12T15:30:00Z',
    action: 'User Login',
    details: 'Admin user logged in',
    user: 'Admin User'
  },
  {
    id: '2',
    timestamp: '2023-07-12T14:45:00Z',
    action: 'Course Updated',
    details: 'Course "English for Beginners" was updated',
    user: 'Content Manager'
  },
  {
    id: '3',
    timestamp: '2023-07-12T13:20:00Z',
    action: 'New User',
    details: 'New user "Emily Davis" was created',
    user: 'User Manager'
  },
  {
    id: '4',
    timestamp: '2023-07-12T11:05:00Z',
    action: 'Lesson Created',
    details: 'New lesson "Advanced Grammar Rules" was created',
    user: 'Content Manager'
  },
  {
    id: '5',
    timestamp: '2023-07-12T10:30:00Z',
    action: 'Permission Changed',
    details: 'User "Content Manager" permissions updated',
    user: 'Admin User'
  },
  {
    id: '6',
    timestamp: '2023-07-11T16:45:00Z',
    action: 'User Deleted',
    details: 'User "Test Account" was deleted',
    user: 'User Manager'
  },
  {
    id: '7',
    timestamp: '2023-07-11T15:20:00Z',
    action: 'System Backup',
    details: 'System backup completed successfully',
    user: 'System'
  },
  {
    id: '8',
    timestamp: '2023-07-11T14:10:00Z',
    action: 'Course Created',
    details: 'New course "English for Tourism" was created',
    user: 'Content Manager'
  },
  {
    id: '9',
    timestamp: '2023-07-11T12:35:00Z',
    action: 'User Login',
    details: 'Failed login attempt',
    user: 'Unknown'
  },
  {
    id: '10',
    timestamp: '2023-07-11T11:50:00Z',
    action: 'Content Updated',
    details: 'Vocabulary list for "Business English" updated',
    user: 'Content Manager'
  }
];

// Mock Vocabulary Items
export const mockVocabulary = [
  {
    id: '1',
    lessonId: '1',
    word: 'Apple',
    translation: 'Quả táo',
    example: 'I eat an apple every day.',
    difficulty: 'easy'
  },
  {
    id: '2',
    lessonId: '1',
    word: 'Book',
    translation: 'Quyển sách',
    example: 'She reads a book before sleeping.',
    difficulty: 'easy'
  },
  {
    id: '3',
    lessonId: '2',
    word: 'Hello',
    translation: 'Xin chào',
    example: 'Hello, how are you today?',
    difficulty: 'easy'
  },
  {
    id: '4',
    lessonId: '2',
    word: 'Goodbye',
    translation: 'Tạm biệt',
    example: 'Goodbye, see you tomorrow!',
    difficulty: 'easy'
  },
  {
    id: '5',
    lessonId: '4',
    word: 'Diligent',
    translation: 'Chăm chỉ',
    example: 'She is a diligent student who always does her homework.',
    difficulty: 'medium'
  },
  {
    id: '6',
    lessonId: '6',
    word: 'Negotiation',
    translation: 'Đàm phán',
    example: 'The negotiation lasted for three hours.',
    difficulty: 'hard'
  }
];

// Mock Grammar Items
export const mockGrammar = [
  {
    id: '1',
    lessonId: '1',
    title: 'The Alphabet',
    explanation: 'The English alphabet consists of 26 letters...',
    examples: ['A is for Apple', 'B is for Book', 'C is for Cat'],
    notes: 'Practice writing each letter several times'
  },
  {
    id: '2',
    lessonId: '2',
    title: 'Basic Greeting Structures',
    explanation: 'When greeting someone in English, you can use...',
    examples: ['Hello, how are you?', 'Good morning!', 'Nice to meet you.'],
    notes: 'Greetings change based on time of day'
  },
  {
    id: '3',
    lessonId: '4',
    title: 'Present Simple Tense',
    explanation: 'We use the present simple for habits, facts, and routines...',
    examples: ['I work every day.', 'She likes coffee.', 'They play tennis on Sundays.'],
    notes: 'Remember to add -s for third person singular (he/she/it)'
  },
  {
    id: '4',
    lessonId: '4',
    title: 'Present Continuous Tense',
    explanation: 'We use the present continuous for actions happening now...',
    examples: ['I am working now.', 'She is drinking coffee.', 'They are playing tennis.'],
    notes: 'Form: subject + am/is/are + verb-ing'
  },
  {
    id: '5',
    lessonId: '6',
    title: 'Formal Business Language',
    explanation: 'In business settings, it\'s important to use formal language...',
    examples: ['I would be grateful if you could...', 'We look forward to hearing from you.', 'Please do not hesitate to contact me.'],
    notes: 'Avoid contractions in formal written business communication'
  }
];

// Mock Exercises
export const mockExercises = [
  {
    id: '1',
    lessonId: '1',
    title: 'Alphabet Recognition',
    type: 'multiple-choice',
    instructions: 'Choose the correct letter for each image.',
    content: JSON.stringify({
      questions: [
        {
          question: 'What letter does "Apple" start with?',
          options: ['A', 'B', 'C', 'D'],
          answer: 'A'
        },
        {
          question: 'What letter does "Book" start with?',
          options: ['A', 'B', 'C', 'D'],
          answer: 'B'
        }
      ]
    }),
    difficulty: 'easy'
  },
  {
    id: '2',
    lessonId: '2',
    title: 'Greeting Practice',
    type: 'fill-in-the-blank',
    instructions: 'Fill in the blanks with appropriate greetings.',
    content: JSON.stringify({
      sentences: [
        {
          sentence: '_______, my name is John.',
          answer: 'Hello'
        },
        {
          sentence: 'Good _______, how are you today?',
          answer: 'morning'
        }
      ]
    }),
    difficulty: 'easy'
  },
  {
    id: '3',
    lessonId: '4',
    title: 'Present Tense Practice',
    type: 'sentence-building',
    instructions: 'Arrange the words to form correct sentences in present tense.',
    content: JSON.stringify({
      sentences: [
        {
          words: ['She', 'coffee', 'drinks', 'morning', 'every'],
          answer: 'She drinks coffee every morning.'
        },
        {
          words: ['They', 'are', 'now', 'studying'],
          answer: 'They are studying now.'
        }
      ]
    }),
    difficulty: 'medium'
  },
  {
    id: '4',
    lessonId: '6',
    title: 'Business Email Writing',
    type: 'writing',
    instructions: 'Write a formal business email to request a meeting.',
    content: JSON.stringify({
      scenario: 'You want to schedule a meeting with a potential client to discuss your services.',
      wordCount: '100-150',
      keyPoints: [
        'Introduce yourself and your company',
        'State the purpose of the meeting',
        'Suggest possible dates and times',
        'Use formal language'
      ]
    }),
    difficulty: 'hard'
  }
];

// Mock Learning Resources
export const mockResources = [
  {
    id: '1',
    type: 'reading',
    title: 'Short Stories for Beginners',
    description: 'A collection of simple stories for beginner English learners.',
    url: 'https://example.com/beginner-stories',
    level: 'beginner'
  },
  {
    id: '2',
    type: 'reading',
    title: 'News Articles (Simplified)',
    description: 'Current news articles written in simplified English.',
    url: 'https://example.com/simple-news',
    level: 'intermediate'
  },
  {
    id: '3',
    type: 'listening',
    title: 'Basic Conversations',
    description: 'Audio recordings of everyday conversations.',
    url: 'https://example.com/basic-conversations',
    level: 'beginner'
  },
  {
    id: '4',
    type: 'listening',
    title: 'English Podcasts',
    description: 'Various podcasts on different topics in clear English.',
    url: 'https://example.com/english-podcasts',
    level: 'intermediate'
  },
  {
    id: '5',
    type: 'speaking',
    title: 'Pronunciation Guides',
    description: 'Videos and exercises to improve English pronunciation.',
    url: 'https://example.com/pronunciation',
    level: 'all-levels'
  },
  {
    id: '6',
    type: 'speaking',
    title: 'Conversation Topics',
    description: 'List of topics and questions to practice speaking English.',
    url: 'https://example.com/conversation-topics',
    level: 'all-levels'
  }
];