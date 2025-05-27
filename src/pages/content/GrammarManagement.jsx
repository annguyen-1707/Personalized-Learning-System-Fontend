import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, Filter, Book } from 'lucide-react';

function GrammarManagement() {
  const { contentId } = useParams();
  const [selectedGrammar, setSelectedGrammar] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    lesson: ''
  });

  // Mock data for demonstration
  const [availableGrammar] = useState([
    {
      id: '1',
      pattern: 'てform + います',
      explanation: 'Used to express ongoing actions',
      examples: ['食べています - I am eating', '勉強しています - I am studying'],
      course: 'Basic Japanese',
      lesson: 'Present Continuous'
    },
    {
      id: '2',
      pattern: 'なければなりません',
      explanation: 'Must do something / have to do something',
      examples: ['勉強しなければなりません - I must study', '行かなければなりません - I have to go'],
      course: 'Basic Japanese',
      lesson: 'Obligations'
    }
  ]);

  const handleAddGrammar = (grammar) => {
    setSelectedGrammar([...selectedGrammar, grammar]);
  };

  const handleRemoveGrammar = (id) => {
    setSelectedGrammar(selectedGrammar.filter(g => g.id !== id));
  };

  // Get unique courses and lessons for filters
  const courses = [...new Set(availableGrammar.map(g => g.course))];
  const lessons = [...new Set(availableGrammar.map(g => g.lesson))];

  // Filter grammar based on search and filters
  const filteredGrammar = availableGrammar.filter(grammar => {
    const searchMatch = 
      grammar.pattern.toLowerCase().includes(search.toLowerCase()) ||
      grammar.explanation.toLowerCase().includes(search.toLowerCase()) ||
      grammar.examples.some(ex => ex.toLowerCase().includes(search.toLowerCase()));
    
    const courseMatch = !filters.course || grammar.course === filters.course;
    const lessonMatch = !filters.lesson || grammar.lesson === filters.lesson;
    
    return searchMatch && courseMatch && lessonMatch;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/content/reading" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Reading Content
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900">Grammar Management</h1>
        <p className="text-gray-500 mt-1">Manage grammar points for this content</p>
      </div>

      {/* Selected Grammar List */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Grammar Points</h2>
        {selectedGrammar.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {selectedGrammar.map((grammar) => (
              <div key={grammar.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{grammar.pattern}</p>
                    <p className="text-sm text-gray-500 mt-1">{grammar.explanation}</p>
                    <div className="mt-2 space-y-1">
                      {grammar.examples.map((example, index) => (
                        <p key={index} className="text-sm text-gray-600 pl-3 border-l-2 border-primary-200">
                          {example}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveGrammar(grammar.id)}
                    className="text-error-500 hover:text-error-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No grammar points selected</p>
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
                placeholder="Search grammar points..."
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

      {/* Available Grammar List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Grammar Points</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredGrammar.map((grammar) => (
            <div key={grammar.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{grammar.pattern}</p>
                  <p className="text-sm text-gray-500 mt-1">{grammar.explanation}</p>
                  <div className="mt-2 space-y-1">
                    {grammar.examples.map((example, index) => (
                      <p key={index} className="text-sm text-gray-600 pl-3 border-l-2 border-primary-200">
                        {example}
                      </p>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{grammar.course}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{grammar.lesson}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddGrammar(grammar)}
                  disabled={selectedGrammar.some(g => g.id === grammar.id)}
                  className={`btn-outline py-1 px-2 ${
                    selectedGrammar.some(g => g.id === grammar.id)
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

export default GrammarManagement;