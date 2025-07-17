import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Code,
    MessageSquare,
    Award,
    Play,
    FileText,
    Settings,
    Send,
    Bot,
    UserCheck
} from 'lucide-react';
import { submissions, testCases, rubrics } from '../../data/grading';

const GradingFeedbackContent = () => {
    const [activeTab, setActiveTab] = useState('submissions');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeMode, setGradeMode] = useState('rubrics'); // 'rubrics' or 'pass-fail'
    const [feedback, setFeedback] = useState('');
    const [autoGrading, setAutoGrading] = useState(false);

    const [currentRubrics, setCurrentRubrics] = useState(rubrics);

    // Auto grade function
    const runAutoGrading = async (submission) => {
        setAutoGrading(true);

        // Simulate running test cases
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockResults = {
            passed: Math.floor(Math.random() * testCases.length) + 1,
            total: testCases.length,
            passRate: 0
        };
        mockResults.passRate = (mockResults.passed / mockResults.total) * 100;

        // Update submission with test results
        const updatedSubmission = {
            ...submission,
            testResults: mockResults,
            status: 'auto-graded'
        };

        setSelectedSubmission(updatedSubmission);
        setAutoGrading(false);
    };

    // Calculate final grade from rubrics
    const calculateRubricsGrade = () => {
        const totalScore = currentRubrics.reduce((sum, rubric) => {
            return sum + (rubric.score * rubric.weight / 100);
        }, 0);
        return Math.round(totalScore);
    };

    // Generate AI feedback
    const generateAIFeedback = () => {
        const feedbackTemplates = [
            "Code của bạn có logic đúng nhưng cần tối ưu về performance. Hãy xem xét sử dụng thuật toán hiệu quả hơn.",
            "Bài làm tốt! Code sạch và dễ hiểu. Tuy nhiên, cần thêm error handling cho các edge cases.",
            "Thuật toán chính xác nhưng thiếu comments. Hãy thêm documentation để code dễ hiểu hơn.",
            "Code chạy đúng với hầu hết test cases. Cần xử lý thêm trường hợp đầu vào rỗng hoặc null."
        ];

        const randomFeedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
        setFeedback(randomFeedback);
    };

    // Update rubric score
    const updateRubricScore = (index, score) => {
        const updated = [...currentRubrics];
        updated[index].score = Math.max(0, Math.min(score, updated[index].maxScore));
        setCurrentRubrics(updated);
    };

    const SubmissionsList = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Danh sách bài nộp</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Cấu hình
                    </button>
                </div>
            </div>

            {submissions.map((submission, idx) => (
                <div
                    key={submission.id || idx}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium">{submission.studentName}</h4>
                            <p className="text-sm text-gray-600">ID: {submission.studentId}</p>
                            <p className="text-sm text-gray-600">{submission.assignment}</p>
                            <p className="text-xs text-gray-500">Nộp lúc: {submission.submittedAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {submission.status === 'pending' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Chờ chấm
                                </span>
                            )}
                            {submission.status === 'graded' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Đã chấm: {submission.grade}đ
                                </span>
                            )}
                            {submission.status === 'auto-graded' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs flex items-center gap-1">
                                    <Bot className="w-3 h-3" />
                                    Tự động chấm
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const GradingPanel = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chấm điểm</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setGradeMode('rubrics')}
                        className={`px-4 py-2 rounded-lg ${gradeMode === 'rubrics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Rubrics
                    </button>
                    <button
                        onClick={() => setGradeMode('pass-fail')}
                        className={`px-4 py-2 rounded-lg ${gradeMode === 'pass-fail' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Pass/Fail
                    </button>
                </div>
            </div>

            {selectedSubmission && (
                <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-medium">{selectedSubmission.studentName}</h4>
                            <p className="text-sm text-gray-600">{selectedSubmission.assignment}</p>
                        </div>
                        <button
                            onClick={() => runAutoGrading(selectedSubmission)}
                            disabled={autoGrading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            {autoGrading ? 'Đang chấm...' : 'Chấm tự động'}
                        </button>
                    </div>

                    {/* Code display */}
                    <div className="mb-4">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Code
                        </h5>
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                            {selectedSubmission.code}
                        </pre>
                    </div>

                    {/* Test results */}
                    {selectedSubmission.testResults && (
                        <div className="mb-4">
                            <h5 className="font-medium mb-2">Kết quả test</h5>
                            <div className="bg-blue-50 p-4 rounded">
                                <p>Passed: {selectedSubmission.testResults.passed}/{selectedSubmission.testResults.total} test cases</p>
                                <p>Pass Rate: {selectedSubmission.testResults.passRate}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${selectedSubmission.testResults.passRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grading section */}
                    {gradeMode === 'rubrics' ? (
                        <div className="space-y-4">
                            <h5 className="font-medium">Chấm điểm theo Rubrics</h5>
                            {currentRubrics.map((rubric, index) => (
                                <div key={rubric.id || index} className="border rounded p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{rubric.criterion}</span>
                                        <span className="text-sm text-gray-600">Trọng số: {rubric.weight}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max={rubric.maxScore}
                                            value={rubric.score}
                                            onChange={(e) => updateRubricScore(index, parseInt(e.target.value) || 0)}
                                            className="w-20 px-2 py-1 border rounded"
                                        />
                                        <span>/ {rubric.maxScore}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-4">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${(rubric.score / rubric.maxScore) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="bg-blue-50 p-4 rounded">
                                <p className="font-semibold">Điểm tổng: {calculateRubricsGrade()}/100</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h5 className="font-medium">Chấm điểm Pass/Fail</h5>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    PASS
                                </button>
                                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    FAIL
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const FeedbackPanel = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Phản hồi</h3>

            {selectedSubmission ? (
                <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Gửi phản hồi cho {selectedSubmission.studentName}</h4>

                        <div className="mb-4">
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={generateAIFeedback}
                                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1"
                                >
                                    <Bot className="w-3 h-3" />
                                    AI Feedback
                                </button>
                                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                                    Template
                                </button>
                            </div>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Nhập phản hồi cho sinh viên..."
                                className="w-full h-32 px-3 py-2 border rounded-lg resize-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Gửi phản hồi
                            </button>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                Lưu nháp
                            </button>
                        </div>
                    </div>

                    {/* Previous feedback */}
                    <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">Lịch sử phản hồi</h5>
                        <div className="space-y-2">
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="flex items-center gap-2 mb-1">
                                    <UserCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium">Giảng viên</span>
                                    <span className="text-xs text-gray-500">2 giờ trước</span>
                                </div>
                                <p className="text-sm">Code của bạn có logic đúng nhưng cần tối ưu về performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chọn một bài nộp để gửi phản hồi</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Hệ thống Chấm điểm & Phản hồi</h1>
                <p className="text-gray-600">Quản lý chấm điểm và phản hồi bài tập lập trình</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Tổng bài nộp</p>
                            <p className="text-xl font-bold text-blue-600">24</p>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div>
                            <p className="text-sm text-gray-600">Chờ chấm</p>
                            <p className="text-xl font-bold text-yellow-600">8</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">Đã chấm</p>
                            <p className="text-xl font-bold text-green-600">16</p>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">Điểm TB</p>
                            <p className="text-xl font-bold text-purple-600">78.5</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'submissions'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Danh sách bài nộp
                    </button>
                    <button
                        onClick={() => setActiveTab('grading')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'grading'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Chấm điểm
                    </button>
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'feedback'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Phản hồi
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            <div className="min-h-96">
                {activeTab === 'submissions' && <SubmissionsList />}
                {activeTab === 'grading' && <GradingPanel />}
                {activeTab === 'feedback' && <FeedbackPanel />}
            </div>
        </div>
    );
};

export default GradingFeedbackContent;