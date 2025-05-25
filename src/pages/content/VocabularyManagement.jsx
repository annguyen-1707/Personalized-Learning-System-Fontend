import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, Filter, Book } from 'lucide-react';

function VocabularyManagement() {
  const { contentId } = useParams();
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    lesson: ''
  });

  // Mock data for demonstration
  const [availableVocabulary] = useState([
    {
      id: '1',
      word: '食べる',
      reading: 'たべる',
      meaning: 'to eat',
      course: 'Basic Japanese',
      lesson: 'Daily Activities'
    },
    {
      id: '2',
      word: '飲む',
      reading: 'のむ',
      meaning: 'to drink',
      course: 'Basic Japanese',
      lesson: 'Daily Activities'
    }
  ]);

  const handleAddVocabulary = (vocab) => {
    setSelectedVocabulary([...selectedVocabulary, vocab]);
  };

  const handleRemoveVocabulary = (id) => {
    setSelectedVocabulary(selectedVocabulary.filter(v => v.id !== id));
  };

  // Get unique courses and lessons for filters
  const courses = [...new Set(availableVocabulary.map(v => v.course))];
  const lessons = [...new Set(availableVocabulary.map(v => v.lesson))];

  // Filter vocabulary based on search and filters
  const filteredVocabulary = availableVocabulary.filter(vocab => {
    const searchMatch = 
      vocab.word.toLowerCase().includes(search.toLowerCase()) ||
      vocab.reading.toLowerCase().includes(search.toLowerCase()) ||
      vocab.meaning.toLowerCase().includes(search.toLowerCase());
    
    const courseMatch = !filters.course || vocab.course === filters.course;
    const lessonMatch = !filters.lesson || vocab.lesson === filters.lesson;
    
    return searchMatch && courseMatch && lessonMatch;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/content/reading" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Reading Content
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary Management</h1>
        <p className="text-gray-500 mt-1">Manage vocabulary items for this content</p>
      </div>

      {/* Selected Vocabulary List */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Vocabulary</h2>
        {selectedVocabulary.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {selectedVocabulary.map((vocab) => (
              <div key={vocab.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{vocab.word}</p>
                  <p className="text-sm text-gray-500">{vocab.reading} - {vocab.meaning}</p>
                </div>
                <button
                  onClick={() => handleRemoveVocabulary(vocab.id)}
                  className="text-error-500 hover:text-error-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No vocabulary items selected</p>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vocabulary..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Book size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value})}
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                value={filters.lesson}
                onChange={(e) => setFilters({...filters, lesson: e.target.value})}
              >
                <option value="">All Lessons</option>
                {lessons.map(lesson => (
                  <option key={lesson} value={lesson}>{lesson}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Available Vocabulary List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Vocabulary</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredVocabulary.map((vocab) => (
            <div key={vocab.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{vocab.word}</p>
                  <p className="text-sm text-gray-500">{vocab.reading} - {vocab.meaning}</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{vocab.course}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{vocab.lesson}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddVocabulary(vocab)}
                  disabled={selectedVocabulary.some(v => v.id === vocab.id)}
                  className={`btn-outline py-1 px-2 ${
                    selectedVocabulary.some(v => v.id === vocab.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VocabularyManagement;