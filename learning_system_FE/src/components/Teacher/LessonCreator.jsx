import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Video, Code, FileText, Save, Eye } from 'lucide-react';
import { getAllCoursesAPI } from '../../../services/CourseService';
import { createLessonAPI, updateLessonAPI } from '../../../services/LessonService';
import { toast } from 'react-toastify';
import { uploadFileAPI } from '../../../services/FileUploadService';

const LessonCreator = ({ mode = 'create', lessonData = null, onSave, onCancel }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [lesson, setLesson] = useState({
        title: '',
        content_html: '',
        course_id: ''
    });

    const [codeBlocks, setCodeBlocks] = useState([]);
    const [videos, setVideos] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [isPreview, setIsPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getAllCoursesAPI();
                // API trả về một mảng [ { id, name, ... } ]
                if (res.data && Array.isArray(res.data)) {
                    const formattedCourses = res.data.map(course => ({
                        course_id: course.id,
                        title: course.name
                    }));
                    setCourses(formattedCourses);
                } else {
                    setCourses([]);
                }
            } catch {
                setCourses([]);
            }
        };
        fetchCourses();
    }, []);

    // Fill dữ liệu khi edit
    useEffect(() => {
        if (mode === 'edit' && lessonData) {
            setLesson({
                title: lessonData.title || '',
                content_html: lessonData.content_html || '',
                course_id: lessonData.course_id || ''
            });
            setSelectedCourse(lessonData.course_id || '');

            // Map backend data to include a client-side 'id' for consistent handling
            setCodeBlocks(lessonData.code_blocks?.map(b => ({ ...b, id: b.block_id })) || []);
            setVideos(lessonData.videos?.map(v => ({ ...v, id: v.video_id })) || []);
            setAttachments(lessonData.attachments?.map(a => ({ ...a, id: a.attachment_id })) || []);

        } else if (mode === 'create') {
            setLesson({ title: '', content_html: '', course_id: '' });
            setSelectedCourse('');
            setCodeBlocks([]);
            setVideos([]);
            setAttachments([]);
        }
    }, [mode, lessonData]);

    const addCodeBlock = () => {
        setCodeBlocks([...codeBlocks, {
            id: Date.now(),
            title: '',
            language: 'javascript',
            code: '',
            display_order: codeBlocks.length + 1
        }]);
    };

    const updateCodeBlock = (id, field, value) => {
        setCodeBlocks(codeBlocks.map(block =>
            block.id === id ? { ...block, [field]: value } : block
        ));
    };

    const removeCodeBlock = (id) => {
        setCodeBlocks(codeBlocks.filter(block => block.id !== id));
    };

    const addVideo = () => {
        setVideos([...videos, {
            id: Date.now(),
            title: '',
            video_url: '',
            display_order: videos.length + 1
        }]);
    };

    const updateVideo = (id, field, value) => {
        setVideos(videos.map(video =>
            video.id === id ? { ...video, [field]: value } : video
        ));
    };

    const removeVideo = (id) => {
        setVideos(videos.filter(video => video.id !== id));
    };

    const addAttachment = () => {
        setAttachments([...attachments, {
            id: Date.now(),
            file_name: '',
            file_url: '',
            file_type: 'pdf'
        }]);
    };

    const updateAttachment = (id, field, value) => {
        setAttachments(attachments.map(attachment =>
            attachment.id === id ? { ...attachment, [field]: value } : attachment
        ));
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter(attachment => attachment.id !== id));
    };

    // Thêm hàm xử lý upload file cho attachment
    const handleFileChange = async (id, file) => {
        if (!file) return;

        // Cập nhật trực tiếp để hiển thị 'Đang upload...'
        updateAttachment(id, 'file_url', 'Đang upload...');

        try {
            const res = await uploadFileAPI(file);

            if (res && res.file_url) {
                const fileName = file.name;
                const fileType = fileName.split('.').pop();

                // Cập nhật tất cả các trường trong một lần duy nhất
                setAttachments(prev => prev.map(att =>
                    att.id === id
                        ? { ...att, file_name: fileName, file_type: fileType, file_url: res.file_url }
                        : att
                ));
            } else {
                // Nếu thất bại, xóa trạng thái 'Đang upload...'
                updateAttachment(id, 'file_url', '');
                toast.error('Upload file thất bại!');
            }
        } catch {
            updateAttachment(id, 'file_url', '');
            toast.error('Upload file thất bại!');
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Ensure course_id is a number
            const courseIdNumber = parseInt(selectedCourse, 10);
            if (isNaN(courseIdNumber)) {
                toast.error("Invalid Course ID. Please select a valid course.");
                setIsLoading(false);
                return;
            }

            const lessonDataToSend = {
                course_id: courseIdNumber,
                title: lesson.title,
                content_html: lesson.content_html,
                code_blocks: codeBlocks,
                videos: videos.map(video => ({
                    ...video,
                    video_url: convertToEmbedUrl(video.video_url)
                })),
                attachments: attachments
            };
            let response;
            if (mode === 'edit' && lessonData && lessonData.lesson_id) {
                response = await updateLessonAPI(lessonData.lesson_id, lessonDataToSend);
            } else {
                response = await createLessonAPI(lessonDataToSend);
            }
            if ((response.status === 201 && mode === 'create') || (response.status === 200 && mode === 'edit')) {
                toast(mode === 'edit' ? 'Cập nhật bài học thành công!' : 'Tạo bài học thành công!');
                if (onSave) onSave();
                if (onCancel) onCancel();
            } else {
                toast('Có lỗi khi lưu bài học!');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Có lỗi khi lưu bài học!');
        } finally {
            setIsLoading(false);
        }
    };

    // Thêm hàm chuyển đổi link YouTube thành embed
    function convertToEmbedUrl(url) {
        url = url.replace(/^@/, '').trim();
        const matchShort = url.match(/^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
        const matchLong = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
        if (url.includes('youtube.com/embed/')) return url;
        return '';
    }

    const renderContent = () => {
        if (isPreview) {
            return (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Preview</h3>
                    <div className="prose max-w-none">
                        <h4 className="text-lg font-medium mb-2">{lesson.title || 'Untitled Lesson'}</h4>
                        <div
                            className="text-gray-700 mb-6"
                            dangerouslySetInnerHTML={{ __html: lesson.content_html || 'No content added yet.' }}
                        />

                        {codeBlocks.length > 0 && (
                            <div className="mb-6">
                                <h5 className="font-medium mb-3">Code Examples</h5>
                                {codeBlocks.map((block, index) => (
                                    <div key={block.id} className="mb-4">
                                        <div className="bg-gray-100 rounded-t px-4 py-2 text-sm font-medium">
                                            {block.title || `Code Block ${index + 1}`} - {block.language}
                                        </div>
                                        <pre className="bg-gray-900 text-gray-100 rounded-b p-4 overflow-x-auto">
                                            <code>{block.code || '// No code added yet'}</code>
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        )}

                        {videos.length > 0 && (
                            <div className="mb-6">
                                <h5 className="font-medium mb-3">Videos</h5>
                                {videos.map((video, index) => {
                                    const embedUrl = convertToEmbedUrl(video.video_url);
                                    return (
                                        <div key={video.id || index} className="mb-3 p-3 bg-gray-50 rounded">
                                            <div className="font-medium">{video.title || `Video ${index + 1}`}</div>
                                            {embedUrl ? (
                                                <div className="mt-2">
                                                    <iframe
                                                        width="100%"
                                                        height="315"
                                                        src={embedUrl}
                                                        title={video.title || `Video ${index + 1}`}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-600">{video.video_url || 'No URL provided'}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {attachments.length > 0 && (
                            <div className="mb-6">
                                <h5 className="font-medium mb-3">Attachments</h5>
                                {attachments.map((attachment, index) => (
                                    <div key={attachment.id || index} className="mb-2 p-2 bg-gray-50 rounded flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        <span>{attachment.file_name || `Attachment ${index + 1}`}</span>
                                        <span className="ml-2 text-xs text-gray-500">({attachment.file_type})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course
                            </label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lesson Title
                            </label>
                            <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter lesson title"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lesson Content (HTML)
                        </label>
                        <textarea
                            value={lesson.content_html}
                            onChange={(e) => setLesson({ ...lesson, content_html: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            placeholder="Enter lesson content in HTML format"
                        />
                    </div>
                </div>

                {/* Code Blocks */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Code Blocks</h3>
                        <button
                            type="button"
                            onClick={addCodeBlock}
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Code Block
                        </button>
                    </div>

                    {codeBlocks.map((block, index) => (
                        <div key={block.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Code className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Code Block {index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCodeBlock(block.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={block.title}
                                    onChange={(e) => updateCodeBlock(block.id, 'title', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Code block title"
                                />
                                <select
                                    value={block.language}
                                    onChange={(e) => updateCodeBlock(block.id, 'language', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="sql">SQL</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>

                            <textarea
                                value={block.code}
                                onChange={(e) => updateCodeBlock(block.id, 'code', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                                placeholder="Enter your code here"
                            />
                        </div>
                    ))}
                </div>

                {/* Videos */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Videos</h3>
                        <button
                            type="button"
                            onClick={addVideo}
                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Video
                        </button>
                    </div>

                    {videos.map((video, index) => (
                        <div key={video.id || index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Video className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Video {index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeVideo(video.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Video title"
                                />
                                <input
                                    type="url"
                                    value={video.video_url}
                                    onChange={(e) => updateVideo(video.id, 'video_url', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Attachments */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Attachments</h3>
                        <button
                            type="button"
                            onClick={addAttachment}
                            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Attachment
                        </button>
                    </div>

                    {attachments.map((attachment, index) => (
                        <div key={attachment.id || index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Upload className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Attachment {index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeAttachment(attachment.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {attachment.file_url && attachment.file_url !== 'Đang upload...' ? (
                                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                        <span className="text-sm text-gray-700 truncate">{attachment.file_name}</span>
                                        <button
                                            onClick={() => window.open(`http://localhost:5000${attachment.file_url}`, '_blank')}
                                            className="text-blue-500 hover:underline ml-4"
                                        >
                                            Download
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.jpg,.jpeg,.png,.gif"
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                if (file) handleFileChange(attachment.id, file);
                                            }}
                                            className="w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                        {attachment.file_url === 'Đang upload...' && <span className="text-sm ml-2">Đang tải lên...</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{mode === 'edit' ? 'Edit Lesson' : 'Create New Lesson'}</h1>
                    <p className="text-gray-600">Add a new lesson to your course with content, code examples, videos, and attachments.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {renderContent()}
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
                                    {isPreview ? 'Edit' : 'Preview'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !selectedCourse || !lesson.title}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isLoading ? 'Saving...' : (mode === 'edit' ? 'Update Lesson' : 'Create Lesson')}
                                </button>

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

                            {/* Summary */}
                            <div className="mt-6 pt-6 border-t">
                                <h4 className="font-medium mb-3">Summary</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>Course: {selectedCourse ? courses.find(c => c.course_id == selectedCourse)?.title : 'Not selected'}</div>
                                    <div>Code blocks: {codeBlocks.length}</div>
                                    <div>Videos: {videos.length}</div>
                                    <div>Attachments: {attachments.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonCreator;