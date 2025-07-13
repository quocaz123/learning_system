import React, { useState } from 'react';
import { Save, Eye, Book, Globe, User, Calendar, Edit3 } from 'lucide-react';
import { createCourseAPI } from '../../../services/CourseService';
import { toast } from 'react-toastify';

const CourseCreator = ({ onCancel }) => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    language: 'javascript'
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'python', label: 'Python', color: 'bg-blue-100 text-blue-800' },
    { value: 'java', label: 'Java', color: 'bg-orange-100 text-orange-800' },
    { value: 'cpp', label: 'C++', color: 'bg-purple-100 text-purple-800' },
    { value: 'csharp', label: 'C#', color: 'bg-green-100 text-green-800' },
    { value: 'php', label: 'PHP', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'ruby', label: 'Ruby', color: 'bg-red-100 text-red-800' },
    { value: 'go', label: 'Go', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'rust', label: 'Rust', color: 'bg-orange-100 text-orange-800' },
    { value: 'swift', label: 'Swift', color: 'bg-blue-100 text-blue-800' },
    { value: 'kotlin', label: 'Kotlin', color: 'bg-purple-100 text-purple-800' },
    { value: 'typescript', label: 'TypeScript', color: 'bg-blue-100 text-blue-800' },
    { value: 'html', label: 'HTML/CSS', color: 'bg-pink-100 text-pink-800' },
    { value: 'sql', label: 'SQL', color: 'bg-gray-100 text-gray-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleInputChange = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!course.title.trim()) {
      alert('Please enter a course title');
      return;
    }

    setIsLoading(true);
    try {
      const courseData = {
        title: course.title,
        description: course.description,
        language: course.language
      };

      const response = await createCourseAPI(courseData);

      if (response.status === 201) {
        toast('Khóa học được tạo thành công!');
        setCourse({ title: '', description: '', language: 'javascript' });
        setIsPreview(false);

        if (onCancel) {
          onCancel();
        }
      } else {
        toast('Có lỗi khi tạo khóa học. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.error || 'Error creating course. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageInfo = (lang) => {
    return languages.find(l => l.value === lang) || languages[0];
  };

  const completionPercentage = ((course.title ? 1 : 0) + (course.description ? 1 : 0)) * 50;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600">Create a comprehensive course with lessons and materials.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {isPreview ? (
              // Preview Mode
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <Book className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLanguageInfo(course.language).color}`}>
                      {getLanguageInfo(course.language).label}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {course.title || 'Untitled Course'}
                  </h2>

                  <div className="flex items-center text-gray-600 mb-4">
                    <User className="w-4 h-4 mr-2" />
                    <span>Current User</span>
                    <Calendar className="w-4 h-4 ml-4 mr-2" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {course.description || 'No description provided yet.'}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>Language: {getLanguageInfo(course.language).label}</span>
                    </div>
                    <div className="text-sm text-gray-500">0 lessons • 0 students</div>
                  </div>
                </div>
              </div>
            ) : (
              // Form Mode
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter course title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
                      <select
                        value={course.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        {languages.map(lang => (
                          <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
                      <textarea
                        value={course.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                        placeholder="Describe what students will learn in this course..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Course Structure
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-center py-8">
                      Course structure will be available after creating the course.
                      <br />
                      You can add lessons, assignments, and other content later.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreview ? 'Edit Course' : 'Preview Course'}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !course.title.trim()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create Course'}
                </button>

                {/* Nút Quay lại */}
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Quay lại
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Course Summary</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Title:</span>
                    <span className="font-medium">{course.title ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className="font-medium">{course.description ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="font-medium">{getLanguageInfo(course.language).label}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Completion Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {completionPercentage}% Complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreator;