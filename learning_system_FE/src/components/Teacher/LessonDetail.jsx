import React, { useEffect, useState } from 'react';
import { BookOpen, Eye, Edit3, Play, Trash2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getLessonDetailAPI } from '../../../services/CourseService';

const LessonDetail = ({ lessonId, onClose }) => {
    const [lessonDetail, setLessonDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            try {
                const res = await getLessonDetailAPI(lessonId);
                setLessonDetail(res.data);
            } catch {
                setLessonDetail(null);
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) fetchLesson();
    }, [lessonId]);

    if (loading) return <div className="p-8 text-center">Đang tải...</div>;
    if (!lessonDetail) return <div className="p-8 text-center text-red-500">Không tìm thấy bài học</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
            <button onClick={onClose} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft size={20} className="mr-2" />
                Quay lại
            </button>
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <BookOpen className="w-4 h-4" />
                    {lessonDetail.title}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{lessonDetail.title}</h1>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lessonDetail.content_html }} />
            </div>
            {/* Video */}
            {lessonDetail.videos && lessonDetail.videos.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Video bài học</h3>
                    {lessonDetail.videos.map(video => (
                        <div key={video.video_id} className="mb-4">
                            <div className="font-medium">{video.title}</div>
                            <iframe
                                width="560"
                                height="315"
                                src={video.video_url}
                                title={video.title}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            )}
            {/* Code block */}
            {lessonDetail.code_blocks && lessonDetail.code_blocks.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Ví dụ minh họa</h3>
                    {lessonDetail.code_blocks.map(block => (
                        <div key={block.block_id} className="mb-4">
                            <div className="font-medium">{block.title}</div>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>
                                    {block.code.replace(/\\n/g, '\n')}
                                </code>
                            </pre>
                        </div>
                    ))}
                </div>
            )}
            {/* Attachments */}
            {lessonDetail.attachments && lessonDetail.attachments.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Tài liệu đính kèm</h3>
                    <ul>
                        {lessonDetail.attachments.map(file => (
                            <li key={file.attachment_id}>
                                <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {file.file_name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LessonDetail; 