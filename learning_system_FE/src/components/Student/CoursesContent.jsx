import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Play,
    FileText,
    Download,
    Eye,
    Clock,
    Target,
    BookOpen,
    Code,
    Video,
    FileImage,
    Save,
    Upload,
    CheckCircle,
    Send,
    Edit3,
    RotateCcw,
    Settings,
    Copy,
    AlertCircle,
    CheckSquare
} from 'lucide-react';
import courses from '../../data/student/courses';

const CoursesContent = () => {
    // State bổ sung cho logic chọn khóa học, chương, bài học
    const [selectedCourse, setSelectedCourse] = useState(Object.keys(courses)[0]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});

    // Hàm toggle mở rộng/thu gọn chương
    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
        setSelectedChapter(chapterId);
    };

    // Hàm chọn bài học
    const selectLesson = (chapterId, lesson) => {
        setSelectedChapter(chapterId);
        setSelectedLesson(lesson);
    };

    // Hàm icon file đơn giản
    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="w-4 h-4 text-red-500" />;
            case 'image':
                return <FileImage className="w-4 h-4 text-green-500" />;
            case 'video':
                return <Video className="w-4 h-4 text-blue-500" />;
            default:
                return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Khóa học</h2>
                </div>
                <div className="p-4 border-b border-gray-200">
                    <div className="space-y-2">
                        {Object.entries(courses).map(([key, course]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCourse(key)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCourse === key ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    <div>
                                        <div className="font-medium">{course.name}</div>
                                        <div className="text-sm text-gray-500">{course.description}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Danh sách chương</h3>
                    <div className="space-y-2">
                        {courses[selectedCourse]?.chapters.map((chapter) => (
                            <div key={chapter.id} className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
                                >
                                    <span className="font-medium text-gray-800">{chapter.title}</span>
                                    {expandedChapters[chapter.id] ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                </button>
                                {expandedChapters[chapter.id] && (
                                    <div className="border-t border-gray-200">
                                        {chapter.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => selectLesson(chapter.id, lesson)}
                                                className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${selectedLesson?.id === lesson.id ? 'bg-blue-50 text-blue-800' : 'text-gray-700'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {lesson.type === 'video' ? <Play className="w-4 h-4 text-green-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">{lesson.title}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {lesson.duration}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {selectedLesson ? (
                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <BookOpen className="w-4 h-4" />
                                {courses[selectedCourse].name} / {courses[selectedCourse].chapters.find(c => c.id === selectedChapter)?.title}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {selectedLesson.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                    {selectedLesson.type === 'video' ? <Play className="w-4 h-4 text-green-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                                    {selectedLesson.type === 'video' ? 'Video' : 'Văn bản'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-1">Mục tiêu bài học</h3>
                                    <p className="text-blue-800">{selectedLesson.content.objective}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Nội dung</h3>
                            <p className="text-gray-700">{selectedLesson.content.description}</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                            {selectedLesson.type === 'video' ? (
                                <div>
                                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                                        <div className="text-center text-white">
                                            <Play className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                            <p className="text-gray-400">Video Player</p>
                                            <p className="text-sm text-gray-500">({selectedLesson.content.videoUrl})</p>
                                        </div>
                                    </div>
                                    {selectedLesson.content.attachments && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Tài liệu đính kèm</h4>
                                            <div className="space-y-2">
                                                {selectedLesson.content.attachments.map((file, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        {getFileIcon(file.type)}
                                                        <span className="flex-1 text-gray-800">{file.name}</span>
                                                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                                            <Download className="w-4 h-4" />
                                                            Tải xuống
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedLesson.content.htmlContent }} />
                            )}
                        </div>

                        {selectedLesson.content.examples && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">Ví dụ minh họa</h3>
                                {selectedLesson.content.examples.map((example, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h4 className="font-medium text-gray-900">{example.title}</h4>
                                        </div>
                                        <div className="p-4">
                                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                                                <code>{example.code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-medium mb-2">Chọn bài học</h3>
                            <p>Hãy chọn một bài học từ danh sách bên trái để bắt đầu học</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesContent;
