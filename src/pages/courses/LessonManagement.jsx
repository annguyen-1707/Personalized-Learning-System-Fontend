import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Book, 
  FileText, 
  Check,
  X,
  ExternalLink
} from 'lucide-react';

function LessonManagement() {
  const { courseId } = useParams();
  const { 
    subjects,
    lessons, 
    addLesson, 
    updateLesson, 
    deleteLesson, 
    addLog 
  } = useData();

  const [course, setCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    status: 'published'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Get course and its lessons
  useEffect(() => {
    const foundSubject = subjects.find(c => c.id === courseId);
    if (foundSubject) {
      setCourse(foundSubject);
    }

    const filteredLessons = lessons
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    
    setCourseLessons(filteredLessons);
  }, [courseId, subjects, lessons]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    const newLesson = addLesson({
      ...formData,
      courseId,
      order: courseLessons.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    addLog('Lesson Created', `New lesson "${formData.title}" was created for course "${course.title}"`);
    
    setFormData({
      title: '',
      description: '',
      duration: '',
      status: 'published'
    });
    
    setIsAdding(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    updateLesson(isEditing, {
      ...formData,
      updatedAt: new Date().toISOString()
    });
    
    addLog('Lesson Updated', `Lesson "${formData.title}" was updated`);
    
    setFormData({
      title: '',
      description: '',
      duration: '',
      status: 'published'
    });
    
    setIsEditing(null);
  };

  const handleDelete = (id) => {
    const lessonToDelete = courseLessons.find(lesson => lesson.id === id);
    deleteLesson(id);
    addLog('Lesson Deleted', `Lesson "${lessonToDelete.title}" was deleted from course "${course.title}"`);
    setShowDeleteConfirm(null);
  };

  const startEdit = (lesson) => {
    setFormData({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      status: lesson.status
    });
    setIsEditing(lesson.id);
    setIsAdding(false);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      status: 'published'
    });
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/courses" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Courses
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title} - Lessons</h1>
            <p className="text-gray-500 mt-1">Manage lessons for this course</p>
          </div>
          <button 
            onClick={() => { setIsAdding(true); setIsEditing(null); }}
            className="btn-primary flex items-center"
            disabled={isAdding || isEditing}
          >
            <Plus size={16} className="mr-1" />
            Add Lesson
          </button>
        </div>
      </div>

      {/* Course Details Card */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Level</h3>
            <p className="text-lg font-medium">{course.level}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
            <p className="text-lg font-medium">{course.duration}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Enrolled Students</h3>
            <p className="text-lg font-medium">{course.enrolledStudents}</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? 'Add New Lesson' : 'Edit Lesson'}
          </h2>
          <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (e.g., "45 minutes")
                </label>
                <input
                  id="duration"
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

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
                {isAdding ? 'Add Lesson' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Course Lessons ({courseLessons.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {courseLessons.length > 0 ? (
            courseLessons.map((lesson) => (
              <div key={lesson.id} className="p-4 hover:bg-gray-50 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Lesson {lesson.order}:</span>
                        <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Book size={14} className="mr-1" />
                          {lesson.duration}
                        </span>
                        <span className={`badge ${
                          lesson.status === 'published' 
                            ? 'bg-success-50 text-success-700' 
                            : 'bg-warning-50 text-warning-700'
                        }`}>
                          {lesson.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Link
                      to={`/courses/${courseId}/lessons/${lesson.id}/content`}
                      className="text-secondary-600 hover:text-secondary-800 mr-3"
                      title="Manage Content"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    {showDeleteConfirm === lesson.id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button onClick={() => handleDelete(lesson.id)} className="text-error-500 hover:text-error-700">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(lesson)} 
                          className="text-primary-600 hover:text-primary-800 mr-2"
                          disabled={isAdding || isEditing}
                          title="Edit Lesson"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(lesson.id)} 
                          className="text-error-500 hover:text-error-700"
                          disabled={isAdding || isEditing}
                          title="Delete Lesson"
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
              <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No lessons have been added to this course yet.</p>
              <button 
                onClick={() => { setIsAdding(true); setIsEditing(null); }}
                className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                disabled={isAdding || isEditing}
              >
                Add your first lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonManagement;