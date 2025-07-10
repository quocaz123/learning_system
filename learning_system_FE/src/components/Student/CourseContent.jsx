import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Play,
  Code,
  FileText,
  Clock,
  User,
  CheckCircle,
  PlayCircle,
  Upload,
  Save,
  Send,
  ArrowLeft,
  BarChart3,
  Calendar,
  Trophy
} from 'lucide-react';

// Mock Data
const mockCourses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming language",
    language: "JavaScript",
    lessons: 12,
    author: "Nguyễn Văn A",
    enrolled: false,
    progress: 0
  },
  {
    id: 2,
    title: "React Development",
    description: "Build modern web applications with React",
    language: "JavaScript",
    lessons: 15,
    author: "Trần Thị B",
    enrolled: true,
    progress: 60
  },
  {
    id: 3,
    title: "Python for Beginners",
    description: "Introduction to Python programming",
    language: "Python",
    lessons: 10,
    author: "Lê Văn C",
    enrolled: true,
    progress: 30
  }
];

const mockLessons = {
  1: [
    { id: 1, title: "Variables and Data Types", videos: 2, codeBlocks: 3, completed: false },
    { id: 2, title: "Functions and Scope", videos: 3, codeBlocks: 4, completed: false },
    { id: 3, title: "Arrays and Objects", videos: 2, codeBlocks: 5, completed: false }
  ],
  2: [
    { id: 4, title: "JSX and Components", videos: 3, codeBlocks: 6, completed: true },
    { id: 5, title: "State and Props", videos: 4, codeBlocks: 8, completed: true },
    { id: 6, title: "Event Handling", videos: 2, codeBlocks: 4, completed: false }
  ],
  3: [
    { id: 7, title: "Python Basics", videos: 2, codeBlocks: 3, completed: true },
    { id: 8, title: "Control Structures", videos: 3, codeBlocks: 5, completed: false },
    { id: 9, title: "Functions", videos: 2, codeBlocks: 4, completed: false }
  ]
};

const mockAssignments = {
  1: { id: 1, title: "Create a Calculator", type: "code", deadline: "2025-07-15", description: "Build a simple calculator using JavaScript" },
  2: { id: 2, title: "JavaScript Quiz", type: "quiz", deadline: "2025-07-10", description: "Multiple choice questions about JS fundamentals" },
  4: { id: 3, title: "Build a Todo App", type: "code", deadline: "2025-07-20", description: "Create a todo application using React" }
};

const mockLessonContent = {
  1: {
    title: "Variables and Data Types",
    duration: "15 phút",
    type: "Văn bản",
    video: "https://example.com/video1",
    objective: "Hiểu được lịch sử, ứng dụng và đặc điểm của JavaScript",
    content: {
      introduction: "JavaScript là một ngôn ngữ lập trình linh hoạt và mạnh mẽ...",
      sections: [
        {
          title: "JavaScript là gì?",
          content: "JavaScript là một ngôn ngữ lập trình được phát triển bởi Brendan Eich tại Netscape vào năm 1995. Ban đầu được tạo ra để làm cho các trang web trở nên tương tác hơn."
        },
        {
          title: "Ứng dụng của JavaScript",
          content: "JavaScript được sử dụng rộng rãi trong phát triển web, mobile apps, desktop applications, và thậm chí là server-side programming với Node.js."
        }
      ]
    },
    examples: [
      {
        title: "Hello World trong JavaScript",
        code: "console.log('Hello, World!');\nalert('Chào mừng đến với JavaScript!');"
      },
      {
        title: "Khai báo biến",
        code: "let name = 'John';\nconst age = 25;\nvar city = 'Ho Chi Minh';\nconsole.log(name, age, city);"
      }
    ],
    files: ["variables-cheatsheet.pdf", "exercises.js"]
  }
};

const CourseContent = () => {
  const [currentView, setCurrentView] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [courses, setCourses] = useState(mockCourses);
  const [userCode, setUserCode] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});

  const enrollCourse = (courseId) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId ? { ...course, enrolled: true } : course
    ));
  };

  const renderCourseList = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Khóa học của tôi</h1>
          <p className="text-gray-600">Khám phá và đăng ký các khóa học mới</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {course.language}
                </span>
                {course.enrolled && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Đã đăng ký</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{course.lessons} bài học</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{course.author}</span>
                </div>
              </div>

              {course.enrolled && course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiến độ</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (course.enrolled) {
                    setSelectedCourse(course);
                    setCurrentView('courseDetail');
                  } else {
                    enrollCourse(course.id);
                  }
                }}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${course.enrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                {course.enrolled ? 'Vào học' : 'Đăng ký học'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourseDetail = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentView('courses')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách khóa học
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h1>
              <p className="text-gray-600">{selectedCourse.description}</p>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {selectedCourse.language}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <User className="w-5 h-5 mr-2" />
            <span>Giảng viên: {selectedCourse.author}</span>
          </div>

          {selectedCourse.enrolled && selectedCourse.progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Tiến độ học tập</span>
                <span>{selectedCourse.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${selectedCourse.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách bài học</h2>
          <div className="space-y-3">
            {mockLessons[selectedCourse.id]?.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      <span>{lesson.videos} video</span>
                      <Code className="w-4 h-4 ml-3 mr-1" />
                      <span>{lesson.codeBlocks} code block</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {lesson.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <button
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setCurrentView('lesson');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Học ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLesson = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentView('courseDetail')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại khóa học
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{selectedLesson.title}</h1>

          {/* Learning Objective */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">🎯</span>
              </div>
              <h2 className="text-xl font-semibold text-blue-900">Mục tiêu bài học</h2>
            </div>
            <p className="text-blue-800">{mockLessonContent[selectedLesson.id]?.objective}</p>
          </div>

          {/* Content Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Nội dung</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">{mockLessonContent[selectedLesson.id]?.content.introduction}</p>

              <div className="space-y-6">
                {mockLessonContent[selectedLesson.id]?.content.sections.map((section, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Ví dụ minh họa</h2>
            <div className="space-y-6">
              {mockLessonContent[selectedLesson.id]?.examples.map((example, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b">
                    <h3 className="font-medium text-gray-900">{example.title}</h3>
                  </div>
                  <div className="bg-gray-900 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                        <Code className="w-4 h-4 mr-1" />
                        Copy
                      </button>
                    </div>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Video bài học</h2>
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                <p className="text-gray-400">Video player sẽ được tích hợp tại đây</p>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Tài liệu đính kèm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockLessonContent[selectedLesson.id]?.files.map((file, index) => (
                <div key={index} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <FileText className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-900">{file}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Section */}
          {mockAssignments[selectedLesson.id] && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Bài tập</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{mockAssignments[selectedLesson.id].title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{mockAssignments[selectedLesson.id].description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Deadline: {mockAssignments[selectedLesson.id].deadline}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAssignment(mockAssignments[selectedLesson.id]);
                    setCurrentView('assignment');
                  }}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Làm bài tập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAssignment = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentView('lesson')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại bài học
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{selectedAssignment.title}</h1>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Deadline: {selectedAssignment.deadline}
            </span>
          </div>

          <p className="text-gray-600 mb-8">{selectedAssignment.description}</p>

          {selectedAssignment.type === 'code' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-gray-900 text-green-400 resize-none"
                placeholder="// Viết code của bạn tại đây..."
              />
              <div className="flex items-center space-x-4 mt-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Play className="w-4 h-4 mr-2 inline" />
                  Chạy thử
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Save className="w-4 h-4 mr-2 inline" />
                  Lưu nháp
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4 mr-2 inline" />
                  Nộp bài
                </button>
              </div>
            </div>
          )}

          {selectedAssignment.type === 'quiz' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Quiz Questions</h2>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">1. What is the correct way to declare a variable in JavaScript?</h3>
                  <div className="space-y-2">
                    {['var name = "John"', 'variable name = "John"', 'v name = "John"', 'name := "John"'].map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input type="radio" name="q1" value={option} className="mr-2" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">2. Which of the following is NOT a JavaScript data type?</h3>
                  <div className="space-y-2">
                    {['String', 'Number', 'Boolean', 'Character'].map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input type="radio" name="q2" value={option} className="mr-2" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Save className="w-4 h-4 mr-2 inline" />
                  Lưu nháp
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4 mr-2 inline" />
                  Nộp bài
                </button>
              </div>
            </div>
          )}

          {selectedAssignment.type === 'upload' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">File Upload</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Kéo và thả file vào đây hoặc click để chọn</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Chọn file
                </button>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Save className="w-4 h-4 mr-2 inline" />
                  Lưu nháp
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4 mr-2 inline" />
                  Nộp bài
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển</h1>
          <p className="text-gray-600">Theo dõi tiến độ học tập của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Khóa học đã đăng ký</p>
                <p className="text-2xl font-bold text-gray-900">{courses.filter(c => c.enrolled).length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bài học đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(mockLessons).flat().filter(l => l.completed).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bài tập đã nộp</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Tiến độ khóa học</h2>
          <div className="space-y-6">
            {courses.filter(c => c.enrolled).map(course => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{Math.floor(course.lessons * course.progress / 100)}/{course.lessons} bài học</span>
                    <span className="ml-4">Tác giả: {course.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setCurrentView('courseDetail');
                  }}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tiếp tục học
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
            <div className="flex space-x-6">
              <button
                onClick={() => setCurrentView('courses')}
                className={`text-sm font-medium transition-colors ${currentView === 'courses' || currentView === 'courseDetail'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Khóa học
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`text-sm font-medium transition-colors ${currentView === 'dashboard'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Bảng điều khiển
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Xin chào, Học viên!</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {currentView === 'courses' && renderCourseList()}
      {currentView === 'courseDetail' && renderCourseDetail()}
      {currentView === 'lesson' && renderLesson()}
      {currentView === 'assignment' && renderAssignment()}
      {currentView === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default CourseContent;