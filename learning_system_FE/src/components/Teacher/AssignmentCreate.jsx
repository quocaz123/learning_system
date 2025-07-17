import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Code, FileQuestion } from 'lucide-react';
import { exerciseTypes } from '../../data/teacher/exercise';
import { toast } from 'react-toastify';
import { createAssignmentAPI, getCoursesByUserAPI, getLessonByCourseIdAPI } from '../../../services/AssignmentService';

const AssignmentCreate = () => {
    const [formData, setFormData] = useState({
        lesson_id: '',
        type: 'code',
        title: '',
        description: '',
        due_date: '',
        code_tests: [],
        quiz_questions: [],
        course_id: ''
    });

    const [courses, setCourses] = useState([]);
    const [lessonsByCourse, setLessonsByCourse] = useState([]);

    // Lấy danh sách khóa học khi mount
    useEffect(() => {
        const getCourses = async () => {
            try {
                const res = await getCoursesByUserAPI();

                setCourses(res.result || []);
            } catch {
                setCourses([]);
            }
        };
        getCourses();
    }, []);

    // Khi chọn khóa học, gọi API lấy lesson
    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setFormData(prev => ({
            ...prev,
            course_id: courseId,
            lesson_id: ''
        }));
        if (courseId) {
            try {
                const res = await getLessonByCourseIdAPI(courseId);
                setLessonsByCourse(res.result || []);
            } catch {
                setLessonsByCourse([]);
            }
        } else {
            setLessonsByCourse([]);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addCodeTest = () => {
        setFormData(prev => ({
            ...prev,
            code_tests: [...prev.code_tests, { input_data: '', expected_output: '' }]
        }));
    };

    const updateCodeTest = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            code_tests: prev.code_tests.map((t, i) => i === index ? { ...t, [field]: value } : t)
        }));
    };

    const removeCodeTest = (index) => {
        setFormData(prev => ({
            ...prev,
            code_tests: prev.code_tests.filter((_, i) => i !== index)
        }));
    };

    const addQuizQuestion = () => {
        setFormData(prev => ({
            ...prev,
            quiz_questions: [...prev.quiz_questions, { question_text: '', options: ['', '', '', ''], correct_index: 0 }]
        }));
    };

    const updateQuizQuestion = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            quiz_questions: prev.quiz_questions.map((q, i) => i === index ? { ...q, [field]: value } : q)
        }));
    };

    const updateQuizOption = (qIndex, oIndex, value) => {
        setFormData(prev => ({
            ...prev,
            quiz_questions: prev.quiz_questions.map((q, i) =>
                i === qIndex ? {
                    ...q,
                    options: q.options.map((opt, j) => j === oIndex ? value : opt)
                } : q
            )
        }));
    };

    const removeQuizQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            quiz_questions: prev.quiz_questions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await createAssignmentAPI(formData);
            if (res && res.status === 201) {
                toast.success('Tạo bài tập thành công!');
                setFormData({
                    lesson_id: '',
                    type: 'code',
                    title: '',
                    description: '',
                    due_date: '',
                    code_tests: [],
                    quiz_questions: [],
                    course_id: ''
                });
            }
        } catch (error) {
            toast.error(`Tạo bài tập thất bại: ${error.message}`);
        }

        if (!formData.lesson_id || !formData.title || !formData.description || !formData.due_date) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        const payload = {
            lesson_id: parseInt(formData.lesson_id),
            type: formData.type,
            title: formData.title,
            description: formData.description,
            due_date: formData.due_date,
            ...(formData.type === 'code' || formData.type === 'mixed' ? {
                code_tests: formData.code_tests.filter(test => test.input_data && test.expected_output)
            } : {}),
            ...(formData.type === 'quiz' || formData.type === 'mixed' ? {
                quiz_questions: formData.quiz_questions
                    .filter(q => q.question_text && q.options.every(opt => opt))
                    .map(q => ({
                        ...q,
                        score_weight: q.score_weight !== undefined ? q.score_weight : 1.0
                    }))
            } : {})
        };


        toast('Tạo bài tập thành công!');
    };

    const showCode = formData.type === 'code' || formData.type === 'mixed';
    const showQuiz = formData.type === 'quiz' || formData.type === 'mixed';

    return (
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <h2 className="text-xl font-bold text-blue-700">Tạo bài tập mới</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Chọn khóa học *</label>
                    <select
                        value={formData.course_id}
                        onChange={handleCourseChange}
                        className="w-full mt-1 border rounded px-3 py-2"
                    >
                        <option value="">-- Chọn khóa học --</option>
                        {Array.isArray(courses) && courses.map(course => (
                            <option key={course.course_id} value={course.course_id}>{course.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Chọn bài học *</label>
                    <select
                        value={formData.lesson_id}
                        onChange={e => handleInputChange('lesson_id', e.target.value)}
                        className="w-full mt-1 border rounded px-3 py-2"
                        disabled={!formData.course_id}
                    >
                        <option value="">-- Chọn bài học --</option>
                        {Array.isArray(lessonsByCourse) && lessonsByCourse.map(lesson => (
                            <option key={lesson.lesson_id} value={lesson.lesson_id}>{lesson.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Title + Description */}
            <div>
                <label className="font-semibold text-sm text-gray-700">Tiêu đề bài tập *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full mt-1 border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="font-semibold text-sm text-gray-700">Mô tả bài tập *</label>
                <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full mt-1 border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 ">Hạn chót *</label>
                <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="w-full mt-1 border rounded px-3 py-2"
                />
            </div>

            {/* Type selector */}
            <div>
                <label className="font-semibold text-sm text-gray-700">Loại bài tập *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {exerciseTypes.map(type => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => handleInputChange('type', type.value)}
                                className={`p-3 border rounded-lg text-sm flex flex-col items-center gap-1 transition-all
                  ${formData.type === type.value
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}
                            >
                                <Icon size={20} />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Code Test Section */}
            {showCode && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                            <Code size={18} /> Test cases (Bài lập trình)
                        </h4>
                        <button onClick={addCodeTest} className="bg-blue-600 text-white px-3 py-1 rounded">+ Thêm test</button>
                    </div>
                    {formData.code_tests.length === 0 && <p className="text-sm text-blue-700">Chưa có test case nào.</p>}
                    {formData.code_tests.map((test, index) => (
                        <div key={test.id || index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Test #{index + 1}</p>
                                <button onClick={() => removeCodeTest(index)} className="text-red-500"><Trash2 size={16} /></button>
                            </div>
                            <input
                                type="text"
                                placeholder="Input"
                                value={test.input_data}
                                onChange={(e) => updateCodeTest(index, 'input_data', e.target.value)}
                                className="w-full mt-2 mb-1 border rounded px-2 py-1"
                            />
                            <input
                                type="text"
                                placeholder="Expected Output"
                                value={test.expected_output}
                                onChange={(e) => updateCodeTest(index, 'expected_output', e.target.value)}
                                className="w-full border rounded px-2 py-1"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Quiz Section */}
            {showQuiz && (
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                            <FileQuestion size={18} /> Câu hỏi trắc nghiệm
                        </h4>
                        <button onClick={addQuizQuestion} className="bg-green-600 text-white px-3 py-1 rounded">+ Thêm câu hỏi</button>
                    </div>
                    {formData.quiz_questions.length === 0 && <p className="text-sm text-green-700">Chưa có câu hỏi nào.</p>}
                    {formData.quiz_questions.map((q, index) => (
                        <div key={q.id || index} className="bg-white p-3 rounded border space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Câu hỏi #{index + 1}</p>
                                <button onClick={() => removeQuizQuestion(index)} className="text-red-500"><Trash2 size={16} /></button>
                            </div>
                            <input
                                type="text"
                                placeholder="Câu hỏi"
                                value={q.question_text}
                                onChange={(e) => updateQuizQuestion(index, 'question_text', e.target.value)}
                                className="w-full border rounded px-2 py-1"
                            />
                            {q.options.map((opt, i) => (
                                <div key={opt.id || i} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct_${index}`}
                                        checked={q.correct_index === i}
                                        onChange={() => updateQuizQuestion(index, 'correct_index', i)}
                                    />
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updateQuizOption(index, i, e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                        placeholder={`Lựa chọn ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Submit Button */}
            <div className="text-right">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                    <Save size={18} /> Tạo bài tập
                </button>
            </div>
        </div>
    );
};

export default AssignmentCreate;
