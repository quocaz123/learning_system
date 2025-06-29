import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  FileText,
  MessageCircle,
  User,
  Settings,
  Menu,
  X,
  CheckCircle,
  Clock,
  BookOpenCheck,
  Send,
  Upload,
  Download,
  Eye,
  Edit,
  Save,
  Camera,
  Mail,
  Phone,
  Calendar,
  Award,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Trash2,
  Plus,
  Search,
  Filter,
  Star,
  Play,
  Pause,
  RotateCcw,
  Users,
  Video,
  FileDown,
  BarChart3,
  Target,
  Trophy,
  ChevronRight,
  Lock,
  Unlock,
  PlayCircle,
  PauseCircle,
  BookmarkPlus,
  Share2,
  MessageSquare,
  ThumbsUp,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('courses');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "ai", time: "10:30" },
    { id: 2, text: "Làm thế nào để khai báo biến trong Python?", sender: "user", time: "10:31" },
    { id: 3, text: "Trong Python, bạn có thể khai báo biến bằng cách gán giá trị trực tiếp:\n\n```python\nten_bien = gia_tri\nx = 10\nten = 'Hello'\n```", sender: "ai", time: "10:31" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    studentId: "SV2023001",
    birthDate: "1995-05-15",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    language: 'vi',
    emailNotifications: true,
    autoSave: true
  });
  const [filterStatus, setFilterStatus] = useState('all');

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập', icon: FileText },
    { id: 'chatbot', label: 'Chatbot AI', icon: MessageCircle },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  const courses = [
    {
      id: 1,
      name: "Python cơ bản",
      progress: 75,
      color: "bg-blue-500",
      instructor: "GV. Trần Văn A",
      lessons: 24,
      completedLessons: 18,
      duration: "6 tuần",
      description: "Học lập trình Python từ cơ bản đến nâng cao với các bài tập thực hành",
      nextLesson: "Bài 19: Xử lý ngoại lệ",
      lastAccessed: "2 giờ trước",
      category: "programming",
      difficulty: "Cơ bản",
      rating: 4.8,
      students: 1250,
      price: "Miễn phí",
      tags: ["Python", "Lập trình", "Cơ bản"],
      thumbnail: "/logo192.png",
      videoCount: 24,
      totalHours: 12,
      certificate: true,
      enrollDate: "2025-05-15",
      chapters: [
        {
          id: 1,
          title: "Giới thiệu Python",
          lessons: [
            { id: 1, title: "Cài đặt Python", duration: "15 phút", completed: true, type: "video" },
            { id: 2, title: "IDE và Text Editor", duration: "20 phút", completed: true, type: "video" },
            { id: 3, title: "Hello World đầu tiên", duration: "10 phút", completed: true, type: "practice" }
          ]
        },
        {
          id: 2,
          title: "Biến và kiểu dữ liệu",
          lessons: [
            { id: 4, title: "Khai báo biến", duration: "25 phút", completed: true, type: "video" },
            { id: 5, title: "Các kiểu dữ liệu cơ bản", duration: "30 phút", completed: true, type: "video" },
            { id: 6, title: "Bài tập thực hành", duration: "45 phút", completed: false, type: "assignment" }
          ]
        },
        {
          id: 3,
          title: "Cấu trúc điều kiện",
          lessons: [
            { id: 7, title: "If-else statement", duration: "20 phút", completed: false, type: "video" },
            { id: 8, title: "Nested conditions", duration: "25 phút", completed: false, type: "video" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Perl nâng cao",
      progress: 45,
      color: "bg-purple-500",
      instructor: "GV. Lê Thị B",
      lessons: 20,
      completedLessons: 9,
      duration: "4 tuần",
      description: "Nắm vững các kỹ thuật lập trình Perl nâng cao và ứng dụng thực tế",
      nextLesson: "Bài 10: Biểu thức chính quy",
      lastAccessed: "1 ngày trước",
      category: "programming",
      difficulty: "Nâng cao",
      rating: 4.6,
      students: 650,
      price: "299,000 VNĐ",
      tags: ["Perl", "Nâng cao", "Web"],
      thumbnail: "/logo192.png",
      videoCount: 20,
      totalHours: 15,
      certificate: true,
      enrollDate: "2025-06-01",
      chapters: [
        {
          id: 1,
          title: "Perl Fundamentals Review",
          lessons: [
            { id: 1, title: "Advanced Variables", duration: "30 phút", completed: true, type: "video" },
            { id: 2, title: "References and Complex Data", duration: "45 phút", completed: true, type: "video" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "JavaScript ES6+",
      progress: 0,
      color: "bg-yellow-500",
      instructor: "GV. Phạm Văn C",
      lessons: 32,
      completedLessons: 0,
      duration: "8 tuần",
      description: "Học JavaScript hiện đại với ES6+ và các framework phổ biến",
      nextLesson: "Bài 1: Giới thiệu JavaScript ES6",
      lastAccessed: "Chưa bắt đầu",
      category: "programming",
      difficulty: "Trung bình",
      rating: 4.9,
      students: 2100,
      price: "599,000 VNĐ",
      tags: ["JavaScript", "ES6", "Frontend"],
      thumbnail: "/logo192.png",
      videoCount: 32,
      totalHours: 20,
      certificate: true,
      enrollDate: "2025-06-20",
      chapters: []
    },
    {
      id: 4,
      name: "Database Design",
      progress: 30,
      color: "bg-green-500",
      instructor: "GV. Hoàng Thị D",
      lessons: 18,
      completedLessons: 5,
      duration: "5 tuần",
      description: "Thiết kế cơ sở dữ liệu hiệu quả với MySQL và PostgreSQL",
      nextLesson: "Bài 6: Normalization",
      lastAccessed: "3 ngày trước",
      category: "database",
      difficulty: "Trung bình",
      rating: 4.7,
      students: 890,
      price: "449,000 VNĐ",
      tags: ["Database", "MySQL", "PostgreSQL"],
      thumbnail: "/logo192.png",
      videoCount: 18,
      totalHours: 14,
      certificate: true,
      enrollDate: "2025-06-10",
      chapters: []
    }
  ];

  const assignments = [
    {
      id: 1,
      title: "Thuật toán sắp xếp",
      course: "Python cơ bản",
      dueDate: "2025-06-25",
      status: "submitted",
      score: 85,
      maxScore: 100,
      submittedAt: "2025-06-20 14:30",
      feedback: "Bài làm tốt, cần cải thiện phần tối ưu thuật toán."
    },
    {
      id: 2,
      title: "Biểu thức chính quy",
      course: "Perl nâng cao",
      dueDate: "2025-06-28",
      status: "grading",
      submittedAt: "2025-06-22 16:45"
    },
    {
      id: 3,
      title: "Xử lý file và thư mục",
      course: "Python cơ bản",
      dueDate: "2025-06-30",
      status: "pending",
      description: "Viết chương trình xử lý file CSV và JSON"
    },
    {
      id: 4,
      title: "Module và Package",
      course: "Python cơ bản",
      dueDate: "2025-07-02",
      status: "not_started"
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const usermessage = {
        id: chatMessages.length + 1,
        text: newMessage,
        sender: "user",
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, usermessage]);
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          text: "Cảm ơn bạn đã hỏi! Tôi đang xử lý câu hỏi của bạn...",
          sender: "ai",
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleProfileSave = () => {
    setIsEditing(false);
    alert('Thông tin đã được cập nhật thành công!');
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getFilteredCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(course => course.category === filterCategory);
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.students - a.students;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Cơ bản': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Nâng cao': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'grading': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'not_started': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted': return 'Đã nộp';
      case 'grading': return 'Đang chấm';
      case 'pending': return 'Chờ nộp';
      case 'not_started': return 'Chưa bắt đầu';
      default: return 'Không xác định';
    }
  };

  const studentName = profileData.name;

  const renderCourseDetail = (course) => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Quay lại danh sách khóa học
          </button>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
                  <p className="text-gray-600 mb-2">Giảng viên: {course.instructor}</p>
                  <p className="text-gray-500 mb-4">{course.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{course.progress}%</div>
                  <div className="text-sm text-gray-500">Hoàn thành</div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Video className="mx-auto text-blue-500 mb-1" size={20} />
                  <div className="text-lg font-semibold text-blue-600">{course.videoCount}</div>
                  <div className="text-xs text-gray-600">Video</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Clock className="mx-auto text-green-500 mb-1" size={20} />
                  <div className="text-lg font-semibold text-green-600">{course.totalHours}h</div>
                  <div className="text-xs text-gray-600">Tổng thời gian</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Users className="mx-auto text-yellow-500 mb-1" size={20} />
                  <div className="text-lg font-semibold text-yellow-600">{course.students}</div>
                  <div className="text-xs text-gray-600">Học viên</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Star className="mx-auto text-purple-500 mb-1" size={20} />
                  <div className="text-lg font-semibold text-purple-600">{course.rating}</div>
                  <div className="text-xs text-gray-600">Đánh giá</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <Play className="mr-2" size={20} />
                  Tiếp tục học
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <BookmarkPlus className="mr-2" size={20} />
                  Lưu
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Share2 className="mr-2" size={20} />
                  Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tiến độ học tập</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ tổng thể</span>
              <span>{course.completedLessons}/{course.lessons} bài học ({course.progress}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${course.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-green-600">{course.completedLessons}</div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="mx-auto text-blue-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-blue-600">{course.lessons - course.completedLessons}</div>
              <div className="text-sm text-gray-600">Còn lại</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Trophy className="mx-auto text-purple-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-purple-600">{course.certificate ? '1' : '0'}</div>
              <div className="text-sm text-gray-600">Chứng chỉ</div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Nội dung khóa học</h3>
          <div className="space-y-4">
            {course.chapters && course.chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="border rounded-lg">
                <div className="p-4 bg-gray-50 border-b">
                  <h4 className="font-semibold flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      {chapterIndex + 1}
                    </span>
                    {chapter.title}
                    <span className="ml-auto text-sm text-gray-500">
                      {chapter.lessons.length} bài học
                    </span>
                  </h4>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {lesson.completed ? (
                              <CheckCircle className="text-green-500" size={20} />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              {lesson.type === 'video' && <Video className="mr-1" size={14} />}
                              {lesson.type === 'practice' && <Target className="mr-1" size={14} />}
                              {lesson.type === 'assignment' && <FileText className="mr-1" size={14} />}
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {lesson.completed ? (
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button className="p-2 text-blue-500 hover:text-blue-700">
                              <PlayCircle size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discussion */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Thảo luận khóa học
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Nguyễn Văn B</div>
                <div className="text-sm text-gray-500">2 giờ trước</div>
              </div>
              <p className="text-gray-700 mb-2">Có ai biết cách xử lý exception trong Python không?</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <button className="flex items-center hover:text-blue-500">
                  <ThumbsUp size={14} className="mr-1" />
                  5 thích
                </button>
                <button className="hover:text-blue-500">Trả lời</button>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Trần Thị C</div>
                <div className="text-sm text-gray-500">4 giờ trước</div>
              </div>
              <p className="text-gray-700 mb-2">Bài tập về loop rất hay, cảm ơn thầy!</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <button className="flex items-center hover:text-blue-500">
                  <ThumbsUp size={14} className="mr-1" />
                  12 thích
                </button>
                <button className="hover:text-blue-500">Trả lời</button>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Chia sẻ suy nghĩ của bạn..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Xin chào, {studentName}!</h2>
              <p className="text-blue-100">Chào mừng bạn trở lại với hệ thống học tập</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                    <div className="text-2xl font-bold text-green-600">{assignments.filter(a => a.status === 'submitted').length}</div>
                    <div className="text-sm text-gray-600">Bài đã nộp</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="mx-auto text-yellow-500 mb-2" size={24} />
                    <div className="text-2xl font-bold text-yellow-600">{assignments.filter(a => a.status === 'grading').length}</div>
                    <div className="text-sm text-gray-600">Đang chấm</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">Đã hoàn thành bài học "Vòng lặp trong Python"</span>
                  <span className="text-xs text-gray-500 ml-auto">2 giờ trước</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Nộp bài tập "Thuật toán sắp xếp"</span>
                  <span className="text-xs text-gray-500 ml-auto">1 ngày trước</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm">Bắt đầu khóa học "Perl nâng cao"</span>
                  <span className="text-xs text-gray-500 ml-auto">3 ngày trước</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        if (selectedCourse) {
          return renderCourseDetail(selectedCourse);
        }

        return (
          <div className="space-y-6">
            {/* Header with Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Khóa học của tôi</h2>
                  <p className="text-gray-600">Quản lý và theo dõi tiến độ học tập</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2 border rounded-lg hover:bg-gray-50"
                  >
                    {viewMode === 'grid' ? <BarChart3 size={20} /> : <BookOpen size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học, giảng viên..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="programming">Lập trình</option>
                  <option value="database">Cơ sở dữ liệu</option>
                  <option value="design">Thiết kế</option>
                </select>

                <select
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="progress">Tiến độ</option>
                  <option value="name">Tên khóa học</option>
                  <option value="rating">Đánh giá</option>
                  <option value="students">Số học viên</option>
                </select>
              </div>
            </div>

            {/* Courses Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {getFilteredCourses().map((course) => (
                <div
                  key={course.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex' : ''
                    }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                    <img
                      src={course.thumbnail}
                      alt={course.name}
                      className={`w-full object-cover ${viewMode === 'list' ? 'h-32' : 'h-48'}`}
                    />
                  </div>

                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{course.instructor}</p>
                        <p className="text-gray-500 text-sm line-clamp-2">{course.description}</p>
                      </div>
                      {viewMode === 'grid' && (
                        <div className="text-right ml-4">
                          <span className="text-2xl font-bold text-blue-600">{course.progress}%</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star size={14} className="mr-1" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">• {course.students} học viên</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Tiến độ học tập</span>
                        <span>{course.completedLessons}/{course.lessons} bài học</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${course.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Video className="mr-2" size={14} />
                        {course.videoCount} video • {course.totalHours} giờ
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2" size={14} />
                        Đăng ký: {new Date(course.enrollDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2" size={14} />
                        Truy cập: {course.lastAccessed}
                      </div>
                    </div>

                    {course.nextLesson && course.progress > 0 && course.progress < 100 && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-blue-800 mb-1">Bài học tiếp theo:</p>
                        <p className="text-sm text-blue-600">{course.nextLesson}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      {course.progress === 0 ? (
                        <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                          <Play className="mr-2" size={16} />
                          Bắt đầu học
                        </button>
                      ) : course.progress === 100 ? (
                        <button className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
                          <Award className="mr-2" size={16} />
                          Xem chứng chỉ
                        </button>
                      ) : (
                        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                          <Play className="mr-2" size={16} />
                          Tiếp tục học
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <BookmarkPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredCourses().length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            )}

            {/* Course Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Thống kê học tập tổng quan</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="mx-auto text-blue-500 mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                  <div className="text-sm text-gray-600">Tổng khóa học</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                  <div className="text-2xl font-bold text-green-600">{courses.reduce((sum, course) => sum + course.completedLessons, 0)}</div>
                  <div className="text-sm text-gray-600">Bài đã hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Clock className="mx-auto text-yellow-500 mb-2" size={24} />
                  <div className="text-2xl font-bold text-yellow-600">{Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%</div>
                  <div className="text-sm text-gray-600">Tiến độ trung bình</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="mx-auto text-purple-500 mb-2" size={24} />
                  <div className="text-2xl font-bold text-purple-600">{courses.filter(c => c.progress === 100).length}</div>
                  <div className="text-sm text-gray-600">Chứng chỉ đạt được</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Khóa học theo danh mục</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lập trình</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">3</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cơ sở dữ liệu</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-sm font-medium">1</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Thời gian học trong tuần</h4>
                  <div className="space-y-2">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{day}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{Math.floor(Math.random() * 3)}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bài tập</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Bài tập gần đây</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thuật toán sắp xếp</h4>
                    <p className="text-sm text-gray-600">Python cơ bản</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Đã nộp</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Biểu thức chính quy</h4>
                    <p className="text-sm text-gray-600">Perl nâng cao</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Đang chấm</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'chatbot':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Chatbot AI Hỗ trợ học tập</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="mr-2" size={16} />
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button className="flex items-center px-3 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
                      <Camera className="mr-2" size={16} />
                      Đổi ảnh
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sinh viên</label>
                    <p className="text-gray-900">{profileData.studentId}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{new Date(profileData.birthDate).toLocaleDateString('vi-VN')}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.address}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleProfileSave}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Save className="mr-2" size={16} />
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-6">Cài đặt hệ thống</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Chế độ tối</h4>
                    <p className="text-sm text-gray-600">Bật/tắt giao diện tối</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Thông báo</h4>
                    <p className="text-sm text-gray-600">Nhận thông báo từ hệ thống</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', !settings.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ngôn ngữ</h4>
                    <p className="text-sm text-gray-600">Chọn ngôn ngữ giao diện</p>
                  </div>
                  <select
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email thông báo</h4>
                    <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Tự động lưu</h4>
                    <p className="text-sm text-gray-600">Tự động lưu thay đổi khi chỉnh sửa</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            {/* Khóa học đang theo học */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpenCheck className="mr-2 text-blue-500" size={20} />
                Khóa học đang theo học
              </h3>
              <div className="space-y-4">
                {courses.slice(0, 2).map((course, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{course.name}</h4>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${course.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Chọn một mục từ menu để bắt đầu</h2>
            <p className="text-gray-500">Hệ thống quản lý học tập trực tuyến</p>
          </div>
        );
    }
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar and Topbar code here if needed */}
      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}