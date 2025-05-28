import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  ArrowLeft, 
  Book, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  BookOpen,
  Pencil,
  Dumbbell,
  Mic,
  BookMarked,
  Headphones
} from 'lucide-react';

function ContentManagement() {
  const { courseId, lessonId } = useParams();
  const { 
    courses, 
    lessons, 
    vocabulary, 
    grammar, 
    exercises, 
    resources,
    addVocabulary,
    updateVocabulary,
    deleteVocabulary,
    addGrammar,
    updateGrammar,
    deleteGrammar,
    addExercise,
    updateExercise,
    deleteExercise,
    addResource,
    updateResource,
    deleteResource,
    addLog
  } = useData();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Get course and lesson
  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }

    const foundLesson = lessons.find(l => l.id === lessonId);
    if (foundLesson) {
      setLesson(foundLesson);
    }
  }, [courseId, lessonId, courses, lessons]);

  // Filter lesson-specific content
  const lessonVocabulary = vocabulary.filter(item => item.lessonId === lessonId);
  const lessonGrammar = grammar.filter(item => item.lessonId === lessonId);
  const lessonExercises = exercises.filter(item => item.lessonId === lessonId);
  
  // Get resources for the three skill types
  const readingResources = resources.filter(resource => resource.type === 'reading');
  const listeningResources = resources.filter(resource => resource.type === 'listening');
  const speakingResources = resources.filter(resource => resource.type === 'speaking');

  // Reset form when changing tabs
  useEffect(() => {
    setIsAdding(false);
    setIsEditing(null);
    setShowDeleteConfirm(null);
    
    // Set default form data based on active tab
    switch (activeTab) {
      case 'vocabulary':
        setFormData({
          word: '',
          translation: '',
          example: '',
          difficulty: 'easy'
        });
        break;
      case 'grammar':
        setFormData({
          title: '',
          explanation: '',
          examples: '',
          notes: ''
        });
        break;
      case 'exercises':
        setFormData({
          title: '',
          type: 'multiple-choice',
          instructions: '',
          content: '',
          difficulty: 'easy'
        });
        break;
      case 'reading':
      case 'listening':
      case 'speaking':
        setFormData({
          title: '',
          description: '',
          url: '',
          level: 'beginner'
        });
        break;
      default:
        setFormData({});
    }
  }, [activeTab]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    let newItem;
    let logAction;
    
    switch (activeTab) {
      case 'vocabulary':
        newItem = addVocabulary({
          ...formData,
          lessonId
        });
        logAction = 'Vocabulary Added';
        break;
      case 'grammar':
        newItem = addGrammar({
          ...formData,
          lessonId,
          examples: formData.examples.split('\n')
        });
        logAction = 'Grammar Added';
        break;
      case 'exercises':
        newItem = addExercise({
          ...formData,
          lessonId,
          content: formData.content // In a real app, this would be properly structured JSON
        });
        logAction = 'Exercise Added';
        break;
      case 'reading':
      case 'listening':
      case 'speaking':
        newItem = addResource({
          ...formData,
          type: activeTab
        });
        logAction = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Resource Added`;
        break;
      default:
        return;
    }
    
    addLog(logAction, `New ${activeTab} content was added to lesson "${lesson.title}"`);
    setIsAdding(false);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    let logAction;
    
    switch (activeTab) {
      case 'vocabulary':
        updateVocabulary(isEditing, formData);
        logAction = 'Vocabulary Updated';
        break;
      case 'grammar':
        updateGrammar(isEditing, {
          ...formData,
          examples: typeof formData.examples === 'string' 
            ? formData.examples.split('\n') 
            : formData.examples
        });
        logAction = 'Grammar Updated';
        break;
      case 'exercises':
        updateExercise(isEditing, formData);
        logAction = 'Exercise Updated';
        break;
      case 'reading':
      case 'listening':
      case 'speaking':
        updateResource(isEditing, formData);
        logAction = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Resource Updated`;
        break;
      default:
        return;
    }
    
    addLog(logAction, `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content was updated in lesson "${lesson.title}"`);
    setIsEditing(null);
    resetForm();
  };

  const handleDelete = (id) => {
    let logAction;
    
    switch (activeTab) {
      case 'vocabulary':
        deleteVocabulary(id);
        logAction = 'Vocabulary Deleted';
        break;
      case 'grammar':
        deleteGrammar(id);
        logAction = 'Grammar Deleted';
        break;
      case 'exercises':
        deleteExercise(id);
        logAction = 'Exercise Deleted';
        break;
      case 'reading':
      case 'listening':
      case 'speaking':
        deleteResource(id);
        logAction = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Resource Deleted`;
        break;
      default:
        return;
    }
    
    addLog(logAction, `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content was deleted from lesson "${lesson.title}"`);
    setShowDeleteConfirm(null);
  };

  const startEdit = (item) => {
    let editData;
    
    switch (activeTab) {
      case 'vocabulary':
        editData = {
          word: item.word,
          translation: item.translation,
          example: item.example,
          difficulty: item.difficulty
        };
        break;
      case 'grammar':
        editData = {
          title: item.title,
          explanation: item.explanation,
          examples: Array.isArray(item.examples) ? item.examples.join('\n') : item.examples,
          notes: item.notes
        };
        break;
      case 'exercises':
        editData = {
          title: item.title,
          type: item.type,
          instructions: item.instructions,
          content: item.content,
          difficulty: item.difficulty
        };
        break;
      case 'reading':
      case 'listening':
      case 'speaking':
        editData = {
          title: item.title,
          description: item.description,
          url: item.url,
          level: item.level
        };
        break;
      default:
        editData = {};
    }
    
    setFormData(editData);
    setIsEditing(item.id);
    setIsAdding(false);
  };

  const resetForm = () => {
    // Reset form based on active tab
    switch (activeTab) {
      case 'vocabulary':
        setFormData({
          word: '',
          translation: '',
          example: '',
          difficulty: 'easy'
        });
        break;
      case 'grammar':
        setFormData({
          title: '',
          explanation: '',
          examples: '',
          notes: ''
        });
        break;
      case 'exercises':
        setFormData({
          title: '',
          type: 'multiple-choice',
          instructions: '',
          content: '',
          difficulty: 'easy'
        });
        break;
      case 'reading':
      case 'listening':
      case 'speaking':
        setFormData({
          title: '',
          description: '',
          url: '',
          level: 'beginner'
        });
        break;
      default:
        setFormData({});
    }
  };

  const cancelAction = () => {
    setIsAdding(false);
    setIsEditing(null);
    resetForm();
  };

  // Get tab icon
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'vocabulary':
        return BookOpen;
      case 'grammar':
        return Pencil;
      case 'exercises':
        return Dumbbell;
      case 'reading':
        return BookMarked;
      case 'listening':
        return Headphones;
      case 'speaking':
        return Mic;
      default:
        return FileText;
    }
  };

  if (!course || !lesson) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Render form based on active tab
  const renderForm = () => {
    switch (activeTab) {
      case 'vocabulary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
                Word
              </label>
              <input
                id="word"
                type="text"
                required
                value={formData.word || ''}
                onChange={(e) => setFormData({...formData, word: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-1">
                Translation
              </label>
              <input
                id="translation"
                type="text"
                required
                value={formData.translation || ''}
                onChange={(e) => setFormData({...formData, translation: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">
                Example Sentence
              </label>
              <input
                id="example"
                type="text"
                required
                value={formData.example || ''}
                onChange={(e) => setFormData({...formData, example: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty || 'easy'}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        );
      
      case 'grammar':
        return (
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Grammar Point Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">
                Explanation
              </label>
              <textarea
                id="explanation"
                rows={3}
                required
                value={formData.explanation || ''}
                onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="examples" className="block text-sm font-medium text-gray-700 mb-1">
                Examples (one per line)
              </label>
              <textarea
                id="examples"
                rows={3}
                required
                value={typeof formData.examples === 'string' 
                  ? formData.examples 
                  : Array.isArray(formData.examples) 
                    ? formData.examples.join('\n') 
                    : ''}
                onChange={(e) => setFormData({...formData, examples: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="I play tennis every Sunday.&#10;She works in a bank.&#10;They don't like coffee."
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        );
      
      case 'exercises':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Type
              </label>
              <select
                id="type"
                value={formData.type || 'multiple-choice'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="fill-in-the-blank">Fill in the Blank</option>
                <option value="sentence-building">Sentence Building</option>
                <option value="writing">Writing</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty || 'easy'}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                id="instructions"
                rows={2}
                required
                value={formData.instructions || ''}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Content (JSON format)
              </label>
              <textarea
                id="content"
                rows={6}
                required
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                placeholder={`{"questions":[{"question":"What is the capital of France?","options":["Paris","London","Berlin","Madrid"],"answer":"Paris"}]}`}
              />
            </div>
          </div>
        );
      
      case 'reading':
      case 'listening':
      case 'speaking':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={2}
                required
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Resource URL
              </label>
              <input
                id="url"
                type="url"
                required
                value={formData.url || ''}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="level"
                value={formData.level || 'beginner'}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render content list based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'vocabulary':
        return (
          <div className="divide-y divide-gray-200">
            {lessonVocabulary.length > 0 ? (
              lessonVocabulary.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{item.word}</h3>
                        <span className={`ml-2 badge ${
                          item.difficulty === 'easy' 
                            ? 'bg-success-50 text-success-700' 
                            : item.difficulty === 'medium'
                            ? 'bg-warning-50 text-warning-700'
                            : 'bg-error-50 text-error-700'
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Translation: {item.translation}</p>
                      <p className="text-sm text-gray-700 mt-2 italic">"{item.example}"</p>
                    </div>
                    <div className="flex items-center">
                      {showDeleteConfirm === item.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button onClick={() => handleDelete(item.id)} className="text-error-500 hover:text-error-700">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(item)} 
                            className="text-primary-600 hover:text-primary-800 mr-2"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(item.id)} 
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <BookOpen className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No vocabulary has been added to this lesson yet.</p>
                <button 
                  onClick={() => { setIsAdding(true); setIsEditing(null); }}
                  className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                  disabled={isAdding || isEditing}
                >
                  Add your first vocabulary item
                </button>
              </div>
            )}
          </div>
        );
      
      case 'grammar':
        return (
          <div className="divide-y divide-gray-200">
            {lessonGrammar.length > 0 ? (
              lessonGrammar.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div className="w-full pr-8">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-700 mt-2">{item.explanation}</p>
                      
                      {item.examples.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 uppercase">Examples:</p>
                          <ul className="mt-1 space-y-1">
                            {item.examples.map((example, index) => (
                              <li key={index} className="text-sm text-gray-700 pl-3 border-l-2 border-primary-200">
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.notes && (
                        <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Note:</span> {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      {showDeleteConfirm === item.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button onClick={() => handleDelete(item.id)} className="text-error-500 hover:text-error-700">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(item)} 
                            className="text-primary-600 hover:text-primary-800 mr-2"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(item.id)} 
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Pencil className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No grammar points have been added to this lesson yet.</p>
                <button 
                  onClick={() => { setIsAdding(true); setIsEditing(null); }}
                  className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                  disabled={isAdding || isEditing}
                >
                  Add your first grammar point
                </button>
              </div>
            )}
          </div>
        );
      
      case 'exercises':
        return (
          <div className="divide-y divide-gray-200">
            {lessonExercises.length > 0 ? (
              lessonExercises.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <span className={`ml-2 badge ${
                          item.difficulty === 'easy' 
                            ? 'bg-success-50 text-success-700' 
                            : item.difficulty === 'medium'
                            ? 'bg-warning-50 text-warning-700'
                            : 'bg-error-50 text-error-700'
                        }`}>
                          {item.difficulty}
                        </span>
                        <span className="ml-2 badge bg-primary-50 text-primary-700">
                          {item.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{item.instructions}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Content preview:</span> 
                        <span className="font-mono bg-gray-50 p-1 rounded ml-1">
                          {item.content.length > 50 ? item.content.substring(0, 50) + '...' : item.content}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {showDeleteConfirm === item.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button onClick={() => handleDelete(item.id)} className="text-error-500 hover:text-error-700">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(item)} 
                            className="text-primary-600 hover:text-primary-800 mr-2"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(item.id)} 
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Dumbbell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No exercises have been added to this lesson yet.</p>
                <button 
                  onClick={() => { setIsAdding(true); setIsEditing(null); }}
                  className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                  disabled={isAdding || isEditing}
                >
                  Add your first exercise
                </button>
              </div>
            )}
          </div>
        );
      
      case 'reading':
      case 'listening':
      case 'speaking': {
        const resources = activeTab === 'reading' 
          ? readingResources 
          : activeTab === 'listening' 
          ? listeningResources 
          : speakingResources;
          
        const TabIcon = getTabIcon(activeTab);
        
        return (
          <div className="divide-y divide-gray-200">
            {resources.length > 0 ? (
              resources.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <span className="ml-2 badge bg-primary-50 text-primary-700">
                          {item.level === 'all-levels' 
                            ? 'All Levels' 
                            : item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-primary-600 hover:text-primary-800 flex items-center"
                      >
                        View Resource
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center">
                      {showDeleteConfirm === item.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button onClick={() => handleDelete(item.id)} className="text-error-500 hover:text-error-700">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(item)} 
                            className="text-primary-600 hover:text-primary-800 mr-2"
                            disabled={isAdding || isEditing}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(item.id)} 
                            className="text-error-500 hover:text-error-700"
                            disabled={isAdding || isEditing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <TabIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No {activeTab} resources have been added yet.</p>
                <button 
                  onClick={() => { setIsAdding(true); setIsEditing(null); }}
                  className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                  disabled={isAdding || isEditing}
                >
                  Add your first {activeTab} resource
                </button>
              </div>
            )}
          </div>
        );
      }
      
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to={`/courses/${courseId}/lessons`} className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Lessons
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title} - Content</h1>
            <p className="text-gray-500 mt-1">Manage learning content for this lesson</p>
          </div>
          <button 
            onClick={() => { setIsAdding(true); setIsEditing(null); }}
            className="btn-primary flex items-center"
            disabled={isAdding || isEditing}
          >
            <Plus size={16} className="mr-1" />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </div>
      </div>

      {/* Course and Lesson Details Card */}
      <div className="card p-4 mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
            <Book className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-medium">{course.title}</p>
          </div>
          <div className="mx-4 text-gray-300">|</div>
          <div className="h-10 w-10 rounded-md bg-secondary-100 flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lesson {lesson.order}</p>
            <p className="font-medium">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Content Management Tabs */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {['vocabulary', 'grammar', 'exercises', 'reading', 'listening', 'speaking'].map((tab) => {
              const TabIcon = getTabIcon(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <TabIcon size={16} className="mr-2" />
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-medium mb-4">
              {isAdding ? `Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </h2>
            <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}>
              {renderForm()}

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={cancelAction}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {isAdding ? 'Add' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content List */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;