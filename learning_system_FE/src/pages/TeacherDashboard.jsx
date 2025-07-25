import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    PlusCircle,
    Edit3,
    Trash2,
    Eye,
    Download,
    Bell,
    Search
} from 'lucide-react';
import TopBar from '../components/Common/TopBar';
import Sidebar from '../components/Common/Sidebar';
import { sidebarItems, assignments } from '../data/teacher/data_dashboard';
import AssignmentCreate from '../components/Teacher/AssignmentCreate';
import AssignmentList from '../components/Teacher/AssignmentList';
import HomeContent from '../components/Teacher/HomeContent';
import CourseCreator from '../components/Teacher/CourseCreator';
import LessonCreator from '../components/Teacher/LessonCreator';
import { getLessonsByCourseAPI, getStudentsByCourseAPI, deleteCourseAPI, getAllCoursesAPI } from '../../services/CourseService';
import LessonList from '../components/Teacher/LessonList';
import LessonDetail from '../components/Teacher/LessonDetail';
import { getName } from "../../services/AuthService";
import UserProfileSystem from '../components/Student/UserProfileContent';
import LessonEdit from '../components/Teacher/LessonEdit';
import { getLessonByIdAPI } from '../../services/LessonService';

// --- Di chuyển CoursesTab ra ngoài và bọc trong memo ---
const CoursesTab = memo(({
    showCoursesOpen, showLessonCreator, showLessons, showLessonDetail, showLessonEdit,
    courses, lessons, editingLesson, selectedCourseId, selectedLessonId, searchTerm,
    setShowCoursesOpen, setShowLessonCreator, setLessons, setEditingLesson, setShowLessonEdit, setSearchTerm,
    handleViewLessons, handleDeleteCourse, handleCloseLessons, handleCreateLesson, handleEditLesson, handleViewLesson, handleCloseLessonDetail
}) => {
    const selectedCourseName = useMemo(() => {
        if (!selectedCourseId) return '';
        const course = courses.find(c => c.course_id === selectedCourseId || c.id === selectedCourseId);
        return course?.name || course?.title || '';
    }, [courses, selectedCourseId]);

    return (
        <div className="space-y-6">
            {(!showCoursesOpen && !showLessonCreator && !showLessons) ? (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h2>
                        <div className="flex gap-2">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                                onClick={() => setShowCoursesOpen(true)}
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Thêm khóa học
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
                                onClick={handleCreateLesson}
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Tạo bài học
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sinh viên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài giảng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài tập</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {courses.map(course => (
                                        <tr key={course.course_id || course.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.students}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.lessons}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.assignments}</td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleViewLessons(course.course_id || course.id)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded" onClick={() => handleDeleteCourse(course.course_id || course.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : showCoursesOpen ? (
                <CourseCreator onCancel={() => setShowCoursesOpen(false)} />
            ) : showLessonCreator ? (
                <LessonCreator onCancel={() => setShowLessonCreator(false)} />
            ) : null}
            {showLessons && !showLessonCreator && !showLessonDetail && !showLessonEdit && (
                <LessonList
                    lessons={lessons}
                    setLessons={setLessons}
                    selectedCourseName={selectedCourseName}
                    onBack={handleCloseLessons}
                    onCreateLesson={handleCreateLesson}
                    onEditLesson={handleEditLesson}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onViewLesson={handleViewLesson}
                />
            )}
            {showLessonEdit && (
                <LessonEdit
                    mode="edit"
                    lessonData={editingLesson}
                    onSave={() => {
                        setShowLessonEdit(false);
                        setEditingLesson(null);
                        handleViewLessons(selectedCourseId);
                    }}
                    onCancel={() => {
                        setShowLessonEdit(false);
                        setEditingLesson(null);
                    }}
                />
            )}
            {showLessonDetail && (
                <LessonDetail lessonId={selectedLessonId} onClose={handleCloseLessonDetail} />
            )}
        </div>
    );
});

const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCoursesOpen, setShowCoursesOpen] = useState(false);
    const [showLessonCreator, setShowLessonCreator] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [showLessons, setShowLessons] = useState(false);
    const [selectedStudentCourseId, setSelectedStudentCourseId] = useState(null);
    const [studentsByCourse, setStudentsByCourse] = useState([]);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [showLessonDetail, setShowLessonDetail] = useState(false);
    const [courses, setCourses] = useState([]);
    const [showLessonEdit, setShowLessonEdit] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho tìm kiếm

    const [inFor, setInFor] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const userInfo = getName();
        if (userInfo) {
            setInFor(userInfo.fullName || '');
            setRole(userInfo.role || 'Student');
        }
        const fetchCourses = async () => {
            try {
                const res = await getAllCoursesAPI();

                setCourses(res.data || []);
            } catch {
                setCourses([]);
            }
        };
        fetchCourses();
    }, []);

    const handleViewLessons = useCallback(async (courseId) => {
        setSelectedCourseId(courseId);
        try {
            const res = await getLessonsByCourseAPI(courseId);
            // Kiểm tra dữ liệu trả về
            const lessonsArr = res?.result || [];
            setLessons(Array.isArray(lessonsArr) ? lessonsArr : []);
            setShowLessons(true);
        } catch {
            setLessons([]);
            setShowLessons(true);
        }
    }, []); // Empty dependency array as it doesn't depend on component state/props

    const handleCloseLessons = useCallback(() => {
        setShowLessons(false);
        setLessons([]);
        setSelectedCourseId(null);
    }, []);

    const handleViewStudents = useCallback(async (courseId) => {
        setSelectedStudentCourseId(courseId);
        try {
            const res = await getStudentsByCourseAPI(courseId);

            setStudentsByCourse(res.data.students || []);
        } catch {
            setStudentsByCourse([]);
        }
    }, []);

    const handleViewLesson = useCallback((lessonId) => {
        setSelectedLessonId(lessonId);
        setShowLessonDetail(true);
    }, []);
    const handleCloseLessonDetail = useCallback(() => {
        setShowLessonDetail(false);
        setSelectedLessonId(null);
    }, []);

    const handleEditLesson = useCallback(async (lessonId) => {
        // Tìm lesson trong danh sách lessons để lấy course_id
        const lessonInList = lessons.find(l => l.lesson_id === lessonId);
        try {
            const res = await getLessonByIdAPI(lessonId);
            let lessonDetail = res.data;

            // Nếu lessonDetail không có course_id, gán lại từ lessonInList
            if (!lessonDetail.course_id && lessonInList?.course_id) {
                lessonDetail = { ...lessonDetail, course_id: lessonInList.course_id };
            }
            setEditingLesson(lessonDetail);
            setShowLessonEdit(true);
        } catch {
            alert('Không lấy được dữ liệu bài học!');
        }
    }, [lessons]); // Depends on 'lessons' state

    const handleDeleteCourse = useCallback(async (course_id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
            try {
                await deleteCourseAPI(course_id);
                alert("Đã xóa khóa học thành công!");
                setCourses(prev => prev.filter(c => (c.course_id || c.id) !== course_id));
            } catch {
                alert("Xóa khóa học thất bại!");
            }
        }
    }, []);

    const handleCreateLesson = useCallback(() => {
        setShowLessonCreator(true);
    }, []);

    const selectedCourseName = useMemo(() => {
        if (!selectedCourseId) return '';
        const course = courses.find(c => c.course_id === selectedCourseId || c.id === selectedCourseId);
        return course?.name || course?.title || '';
    }, [courses, selectedCourseId]);

    // Xóa định nghĩa CoursesTab ở đây

    const AssignmentsTab = () => {
        const [showCreate, setShowCreate] = useState(false);
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý bài tập</h2>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                        onClick={() => setShowCreate(prev => !prev)}
                    >
                        <PlusCircle size={20} className="mr-2" />
                        {showCreate ? 'Quay lại danh sách' : 'Tạo bài tập'}
                    </button>
                </div>

                {showCreate ? (
                    <AssignmentCreate onCancel={() => setShowCreate(false)} />
                ) : (
                    <AssignmentList assignments={assignments} />
                )}
            </div>
        );
    };

    const StudentsTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sinh viên</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sinh viên..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        <Download size={20} className="mr-2" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>
            <div className="flex gap-2 mb-4">
                {courses.map(course => (
                    <button
                        key={course.course_id || course.id}
                        className={`px-4 py-2 rounded ${selectedStudentCourseId === (course.course_id || course.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => handleViewStudents(course.course_id || course.id)}
                    >
                        {course.name || course.title}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sinh viên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentsByCourse.map(student => (
                                <tr key={student.user_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{student.full_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <HomeContent />;
            case 'courses':
                return <CoursesTab
                    showCoursesOpen={showCoursesOpen}
                    setShowCoursesOpen={setShowCoursesOpen}
                    showLessonCreator={showLessonCreator}
                    setShowLessonCreator={setShowLessonCreator}
                    showLessons={showLessons}
                    courses={courses}
                    handleViewLessons={handleViewLessons}
                    handleDeleteCourse={handleDeleteCourse}
                    lessons={lessons}
                    setLessons={setLessons}
                    selectedCourseName={selectedCourseName}
                    handleCloseLessons={handleCloseLessons}
                    handleCreateLesson={handleCreateLesson}
                    handleEditLesson={handleEditLesson}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleViewLesson={handleViewLesson}
                    showLessonDetail={showLessonDetail}
                    showLessonEdit={showLessonEdit}
                    editingLesson={editingLesson}
                    setShowLessonEdit={setShowLessonEdit}
                    setEditingLesson={setEditingLesson}
                    selectedCourseId={selectedCourseId}
                    selectedLessonId={selectedLessonId}
                    handleCloseLessonDetail={handleCloseLessonDetail}
                />;
            case 'assignments':
                return <AssignmentsTab />;
            case 'students':
                return <StudentsTab />;
            case 'upload':
                return <div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-bold">Tải lên tài liệu</h2><p className="text-gray-600 mt-2">Chức năng tải lên tài liệu sẽ được phát triển.</p></div>;
            case 'reports':
                return <div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-bold">Báo cáo</h2><p className="text-gray-600 mt-2">Chức năng báo cáo sẽ được phát triển.</p></div>;
            case 'settings':
                return <UserProfileSystem />;
            default:
                return <Dashboard />;
        }
    };

    const getPageTitle = () => {
        const tabTitles = {
            dashboard: 'Dashboard',
            courses: 'Quản lý khóa học',
            assignments: 'Quản lý bài tập',
            students: 'Sinh viên',
            upload: 'Tải lên tài liệu',
            reports: 'Báo cáo',
            settings: 'Cài đặt'
        };
        return tabTitles[activeTab] || 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                sidebarItems={sidebarItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
            />
            <div className="flex-1 flex flex-col">
                <TopBar
                    title={getPageTitle()}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    inFor={inFor}
                    role={role}
                    rightContent={
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </button>
                    }
                />
                <main className="flex-1 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;
