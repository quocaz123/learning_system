import React, { useState, useRef, useEffect } from 'react';
import {
    Play, Save, Upload, Code, CheckCircle, Clock, FileText,
    Send, Edit3, RotateCcw, Settings, Copy, Download,
    ChevronDown, ChevronRight, AlertCircle, CheckSquare
} from 'lucide-react';
import { assignments, codeExamples } from '../../data/student/assignment';

const AssignmentContent = () => {
    const [activeTab, setActiveTab] = useState('assignments');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [codeLanguage, setCodeLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [uploadedFile, setUploadedFile] = useState(null);
    const [savedDrafts, setSavedDrafts] = useState({});
    const codeEditorRef = useRef(null);

    useEffect(() => {
        if (selectedAssignment && selectedAssignment.type === 'code') {
            setCodeLanguage(selectedAssignment.language);
            setCode(selectedAssignment.starterCode || '');
        }
    }, [selectedAssignment]);

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Đang chạy...');

        // Simulate code execution
        setTimeout(() => {
            try {
                if (codeLanguage === 'python') {
                    // Simulate Python execution
                    if (code.includes('print(')) {
                        const matches = code.match(/print\((.*?)\)/g);
                        if (matches) {
                            const outputs = matches.map(match => {
                                const content = match.match(/print\((.*?)\)/)[1];
                                // Basic string evaluation
                                if (content.includes('f"') || content.includes("f'")) {
                                    return content.replace(/f["']/, '').replace(/["']/g, '').replace(/\{.*?\}/g, 'value');
                                }
                                return content.replace(/["']/g, '');
                            });
                            setOutput(outputs.join('\n'));
                        } else {
                            setOutput('Không có output');
                        }
                    } else {
                        setOutput('Chương trình chạy thành công (không có output)');
                    }
                } else if (codeLanguage === 'perl') {
                    // Simulate Perl execution
                    if (code.includes('print')) {
                        const matches = code.match(/print ".*?";/g);
                        if (matches) {
                            const outputs = matches.map(match =>
                                match.replace(/print "/, '').replace(/";/, '').replace(/\\n/, '')
                            );
                            setOutput(outputs.join('\n'));
                        } else {
                            setOutput('Không có output');
                        }
                    } else {
                        setOutput('Chương trình chạy thành công (không có output)');
                    }
                }
            } catch (error) {
                setOutput(`Lỗi: ${error.message}`);
            }
            setIsRunning(false);
        }, 1500);
    };

    const loadExample = (exampleName) => {
        const example = codeExamples[codeLanguage][exampleName];
        if (example) {
            setCode(example);
        }
    };

    const saveDraft = () => {
        if (selectedAssignment) {
            setSavedDrafts(prev => ({
                ...prev,
                [selectedAssignment.id]: {
                    code: selectedAssignment.type === 'code' ? code : null,
                    answers: selectedAssignment.type === 'quiz' ? selectedAnswers : null,
                    file: selectedAssignment.type === 'upload' ? uploadedFile : null,
                    savedAt: new Date().toLocaleString()
                }
            }));
            alert('Đã lưu bản nháp!');
        }
    };

    const submitAssignment = () => {
        if (selectedAssignment) {
            // Simulate submission
            alert(`Đã nộp bài: ${selectedAssignment.title}`);
        }
    };

    const handleQuizAnswer = (questionId, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'overdue': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const renderAssignmentContent = () => {
        if (!selectedAssignment) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-medium mb-2">Chọn bài tập</h3>
                        <p>Hãy chọn một bài tập từ danh sách để bắt đầu làm bài</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-6">
                {/* Assignment Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAssignment.status)}`}>
                            {selectedAssignment.status === 'submitted' ? 'Đã nộp' :
                                selectedAssignment.status === 'pending' ? 'Chưa nộp' : 'Quá hạn'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Hạn nộp: {selectedAssignment.dueDate}
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Loại: {selectedAssignment.type === 'code' ? 'Viết code' :
                                selectedAssignment.type === 'quiz' ? 'Trắc nghiệm' : 'Upload file'}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">Mô tả bài tập</h3>
                        <p className="text-blue-800">{selectedAssignment.description}</p>

                        {selectedAssignment.requirements && (
                            <div className="mt-3">
                                <h4 className="font-medium text-blue-900 mb-1">Yêu cầu:</h4>
                                <ul className="list-disc list-inside text-blue-800 space-y-1">
                                    {selectedAssignment.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignment Content based on type */}
                {selectedAssignment.type === 'code' && (
                    <div className="space-y-6">
                        {/* Code Editor */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-semibold text-gray-900">Code Editor</h3>
                                    <select
                                        value={codeLanguage}
                                        onChange={(e) => setCodeLanguage(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                                    >
                                        <option value="python">Python</option>
                                        <option value="perl">Perl</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Examples Dropdown */}
                                    <div className="relative">
                                        <select
                                            onChange={(e) => e.target.value && loadExample(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                                            defaultValue=""
                                        >
                                            <option value="">Chọn ví dụ mẫu</option>
                                            {Object.keys(codeExamples[codeLanguage]).map(example => (
                                                <option key={example} value={example}>{example}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={runCode}
                                        disabled={isRunning}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Play className="w-4 h-4" />
                                        {isRunning ? 'Đang chạy...' : 'Chạy thử'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-0">
                                <textarea
                                    ref={codeEditorRef}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-64 p-4 font-mono text-sm border-none resize-none focus:outline-none bg-gray-900 text-green-400"
                                    placeholder={`Viết code ${codeLanguage} của bạn ở đây...`}
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        {/* Output Panel */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-900">Kết quả</h3>
                            </div>
                            <div className="p-4">
                                <pre className="bg-gray-100 p-4 rounded font-mono text-sm whitespace-pre-wrap min-h-[100px]">
                                    {output || 'Nhấn "Chạy thử" để xem kết quả...'}
                                </pre>
                            </div>
                        </div>

                        {selectedAssignment.expectedOutput && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-2">Kết quả mong đợi:</h4>
                                <pre className="text-green-800 font-mono text-sm">{selectedAssignment.expectedOutput}</pre>
                            </div>
                        )}
                    </div>
                )}

                {selectedAssignment.type === 'quiz' && (
                    <div className="space-y-6">
                        {selectedAssignment.questions.map((question) => (
                            <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Câu {question.id}: {question.question}
                                </h3>
                                <div className="space-y-3">
                                    {question.options.map((option, index) => (
                                        <label key={index} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                checked={selectedAnswers[question.id] === index}
                                                onChange={() => handleQuizAnswer(question.id, index)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedAssignment.type === 'upload' && (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Upload File</h3>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <div className="mb-4">
                                    <p className="text-gray-600 mb-2">Kéo thả file vào đây hoặc</p>
                                    <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                                        Chọn file
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            accept={selectedAssignment.allowedFormats?.join(',')}
                                        />
                                    </label>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p>Định dạng cho phép: {selectedAssignment.allowedFormats?.join(', ')}</p>
                                    <p>Dung lượng tối đa: {selectedAssignment.maxFileSize}</p>
                                </div>
                            </div>

                            {uploadedFile && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">{uploadedFile.name}</p>
                                            <p className="text-sm text-green-700">
                                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <button
                        onClick={saveDraft}
                        className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                    >
                        <Save className="w-4 h-4" />
                        Lưu nháp
                    </button>

                    <button
                        onClick={submitAssignment}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        disabled={selectedAssignment.status === 'submitted'}
                    >
                        <Send className="w-4 h-4" />
                        {selectedAssignment.status === 'submitted' ? 'Đã nộp bài' : 'Nộp bài'}
                    </button>

                    {selectedAssignment.status === 'submitted' && (
                        <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
                            <RotateCcw className="w-4 h-4" />
                            Nộp lại
                        </button>
                    )}

                    {savedDrafts[selectedAssignment.id] && (
                        <div className="text-sm text-gray-600">
                            Đã lưu: {savedDrafts[selectedAssignment.id].savedAt}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Bài tập & Thực hành</h2>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('assignments')}
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'assignments'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Bài tập
                        </button>
                        <button
                            onClick={() => setActiveTab('practice')}
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'practice'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Thực hành
                        </button>
                    </div>
                </div>

                {/* Assignment List */}
                {activeTab === 'assignments' && (
                    <div className="p-4 space-y-3">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                onClick={() => setSelectedAssignment(assignment)}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAssignment?.id === assignment.id
                                    ? 'bg-blue-50 border-blue-300'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-medium text-gray-900 text-sm">{assignment.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                        {assignment.status === 'submitted' ? 'Đã nộp' : 'Chưa nộp'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {assignment.dueDate}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {assignment.type === 'code' ? <Code className="w-3 h-3" /> :
                                            assignment.type === 'quiz' ? <CheckSquare className="w-3 h-3" /> :
                                                <Upload className="w-3 h-3" />}
                                        {assignment.type === 'code' ? 'Code' :
                                            assignment.type === 'quiz' ? 'Quiz' : 'Upload'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Practice Mode */}
                {activeTab === 'practice' && (
                    <div className="p-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-green-900 mb-2">IDE Online</h3>
                            <p className="text-sm text-green-700">Môi trường lập trình trực tuyến để thực hành code</p>
                        </div>

                        <button
                            onClick={() => setSelectedAssignment({
                                id: 'practice',
                                title: 'Thực hành Code Online',
                                type: 'code',
                                description: 'Môi trường IDE online để thực hành lập trình',
                                language: 'python'
                            })}
                            className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <Code className="w-5 h-5 text-blue-600" />
                                <div>
                                    <div className="font-medium text-gray-900">IDE Online</div>
                                    <div className="text-sm text-gray-500">Viết và chạy code trực tiếp</div>
                                </div>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {renderAssignmentContent()}
            </div>
        </div>
    );
};

export default AssignmentContent;
