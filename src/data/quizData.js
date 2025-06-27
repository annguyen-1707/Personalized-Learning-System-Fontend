export const quizData = {
  quizzes: [
    {
      listId: 'jlpt-n5-basic',
      title: 'JLPT N5 Basic Vocabulary Quiz',
      description: 'Test your knowledge of basic JLPT N5 vocabulary with this multiple-choice quiz.',
      timeLimit: 300, // 5 minutes in seconds
      questions: [
        {
          vocabularyId: 'n5-q1',
          quizQuestion: 'What does "本" mean?',
          japanese: '本',
          options: ['book', 'pen', 'desk', 'school'],
          correctAnswer: 'book'
        },
        {
          vocabularyId: 'n5-q2',
          quizQuestion: 'What does "人" mean?',
          japanese: '人',
          options: ['person', 'dog', 'cat', 'bird'],
          correctAnswer: 'person'
        },
        {
          vocabularyId: 'n5-q3',
          quizQuestion: 'What does "学校" mean?',
          japanese: '学校',
          options: ['school', 'hospital', 'library', 'park'],
          correctAnswer: 'school',
          example: '"学校" (gakkō) means "school" in Japanese. "学" refers to learning or study, and "校" refers to a school or educational institution.'
        },
        {
          vocabularyId: 'n5-q4',
          quizQuestion: 'What does "食べる" mean?',
          japanese: '食べる',
          options: ['to eat', 'to drink', 'to sleep', 'to run'],
          correctAnswer: 'to eat'
        },
        {
          vocabularyId: 'n5-q5',
          quizQuestion: 'What does "大きい" mean?',
          japanese: '大きい',
          options: ['big', 'small', 'tall', 'short'],
          correctAnswer: 'big',
          example: '"大きい" (ōkii) means "big" or "large" in Japanese. It\'s an i-adjective.'
        }
      ]
    },
    {
      listId: 'jlpt-n5-grammar',
      title: 'JLPT N5 Grammar Quiz',
      description: 'Test your understanding of basic JLPT N5 grammar patterns.',
      timeLimit: 600, // 10 minutes in seconds
      questions: [
        {
          vocabularyId: 'n5g-q1',
          quizQuestion: 'Which particle is used to mark the direct object of a verb?',
          options: ['は (wa)', 'が (ga)', 'を (wo)', 'に (ni)'],
          correctAnswer: 'を (wo)',
          example: 'The particle "を" (wo) is used to mark the direct object of a verb, showing what action is being performed on something.'
        },
        {
          vocabularyId: 'n5g-q2',
          quizQuestion: 'Complete the sentence: 私は日本語___勉強しています。',
          options: ['が', 'を', 'に', 'で'],
          correctAnswer: 'を',
          example: 'The particle "を" is used with the verb "勉強する" (to study) to indicate what is being studied.'
        },
        {
          vocabularyId: 'n5g-q3',
          quizQuestion: 'Which sentence pattern is used for expressing "I want to do something"?',
          options: ['〜たい', '〜ている', '〜なければならない', '〜ことができる'],
          correctAnswer: '〜たい',
          example: 'The "〜たい" form is attached to the stem of a verb to express the desire to do something. For example: 食べる (to eat) → 食べたい (want to eat)'
        },
        {
          vocabularyId: 'n5g-q4',
          quizQuestion: 'Complete the sentence: 明日、友達___映画を見に行きます。',
          options: ['が', 'を', 'に', 'と'],
          correctAnswer: 'と',
          example: 'The particle "と" is used to mean "with" when referring to doing something together with someone.'
        },
        {
          vocabularyId: 'n5g-q5',
          quizQuestion: 'Which form is used to give a reason with "because"?',
          options: ['〜から', '〜ても', '〜ながら', '〜たり'],
          correctAnswer: '〜から',
          example: 'The "〜から" form is attached to the end of a sentence to give a reason, equivalent to "because" in English.'
        }
      ]
    },
    {
      listId: 'kanji-n5',
      title: 'JLPT N5 Kanji Quiz',
      description: 'Test your knowledge of basic JLPT N5 kanji characters.',
      timeLimit: 300, // 5 minutes in seconds
      questions: [
        {
          vocabularyId: 'kanji-q1',
          quizQuestion: 'What does the kanji "水" mean?',
          japanese: '水',
          options: ['water', 'fire', 'earth', 'wind'],
          correctAnswer: 'water'
        },
        {
          vocabularyId: 'kanji-q2',
          quizQuestion: 'What does the kanji "日" mean?',
          japanese: '日',
          options: ['sun', 'moon', 'star', 'sky'],
          correctAnswer: 'sun',
          example: 'The kanji "日" (hi) primarily means "sun" but is also used to mean "day" in Japanese.'
        },
        {
          vocabularyId: 'kanji-q3',
          quizQuestion: 'What does "山" mean?',
          japanese: '山',
          options: ['mountain', 'river', 'ocean', 'forest'],
          correctAnswer: 'mountain'
        },
        {
          vocabularyId: 'kanji-q4',
          quizQuestion: 'What does "火" mean?',
          japanese: '火',
          options: ['fire', 'water', 'earth', 'wind'],
          correctAnswer: 'fire'
        },
        {
          vocabularyId: 'kanji-q5',
          quizQuestion: 'What does "木" mean?',
          japanese: '木',
          options: ['tree', 'grass', 'flower', 'fruit'],
          correctAnswer: 'tree',
          example: 'The kanji "木" (ki) means "tree" or "wood" in Japanese. Multiple "木" characters together form different kanji, like "森" (forest).'
        }
      ]
    }
  ]
}