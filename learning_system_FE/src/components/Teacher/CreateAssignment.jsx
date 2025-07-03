import React, { useState } from 'react';
import { Plus, Trash2, Save, BookOpen, Code, FileQuestion, Upload, Layers } from 'lucide-react';

const ExerciseCreator = () => {
  const [formData, setFormData] = useState({
    lesson_id: '',
    type: 'code',
    title: '',
    description: '',
    due_date: '',
    code_tests: [],
    quiz_questions: []
  });

  const [lessons] = useState([
    { id: 1, name: 'Bài 1: Giới thiệu Python' },
    { id: 2, name: 'Bài 2: Biến và kiểu dữ liệu' },
    { id: 3, name: 'Bài 3: Vòng lặp và điều kiện' },
    { id: 4, name: 'Bài 4: Hàm và module' }
  ]);

  const exerciseTypes = [
    { value: 'code', label: 'Lập trình', icon: Code, color: 'text-blue-600 bg-blue-50' },
    { value: 'quiz', label: 'Trắc nghiệm', icon: FileQuestion, color: 'text-green-600 bg-green-50' },
    { value: 'upload', label: 'Nộp file', icon: Upload, color: 'text-purple-600 bg-purple-50' },
    { value: 'mixed', label: 'Tổng hợp', icon: Layers, color: 'text-orange-600 bg-orange-50' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCodeTest = () => {
    setFormData(prev => ({
      ...prev,
      code_tests: [
        ...prev.code_tests,
        { input_data: '', expected_output: '' }
      ]
    }));
  };

  const updateCodeTest = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      code_tests: prev.code_tests.map((test, i) => 
        i === index ? { ...test, [field]: value } : test
      )
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
      quiz_questions: [
        ...prev.quiz_questions,
        {
          question_text: '',
          options: ['', '', '', ''],
          correct_index: 0
        }
      ]
    }));
  };

  const updateQuizQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      quiz_questions: prev.quiz_questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuizOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      quiz_questions: prev.quiz_questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
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
    
    // Validation
    if (!formData.lesson_id || !formData.title || !formData.description || !formData.due_date) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Clean data based on type
    let cleanData = {
      lesson_id: parseInt(formData.lesson_id),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date
    };

    if (formData.type === 'code' || formData.type === 'mixed') {
      cleanData.code_tests = formData.code_tests.filter(test => 
        test.input_data.trim() && test.expected_output.trim()
      );
    }

    if (formData.type === 'quiz' || formData.type === 'mixed') {
      cleanData.quiz_questions = formData.quiz_questions.filter(q => 
        q.question_text.trim() && q.options.every(opt => opt.trim())
      );
    }

    console.log('Dữ liệu gửi lên API:', JSON.stringify(cleanData, null, 2));
    
    try {
      // Simulate API call
      alert('Tạo bài tập thành công!\nKiểm tra console để xem dữ liệu JSON.');
      
      // Reset form
      setFormData({
        lesson_id: '',
        type: 'code',
        title: '',
        description: '',
        due_date: '',
        code_tests: [],
        quiz_questions: []
      });
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  const shouldShowCodeTests = formData.type === 'code' || formData.type === 'mixed';
  const shouldShowQuizQuestions = formData.type === 'quiz' || formData.type === 'mixed';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              Tạo bài tập mới
            </h1>
            <p className="text-blue-100 mt-2">Nhập thông tin để tạo bài tập cho học sinh</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn bài học *
                </label>
                <select
                  value={formData.lesson_id}
                  onChange={(e) => handleInputChange('lesson_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Chọn bài học --</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hạn chót *
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiêu đề bài tập *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nhập tiêu đề bài tập..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả bài tập *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Nhập mô tả chi tiết cho bài tập..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Exercise Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Loại bài tập *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exerciseTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${type.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">{type.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Tests Section */}
            {shouldShowCodeTests && (
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Test cases (Bài lập trình)
                  </h3>
                  <button
                    type="button"
                    onClick={addCodeTest}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm test
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.code_tests.map((test, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Test case #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCodeTest(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Input
                          </label>
                          <input
                            type="text"
                            value={test.input_data}
                            onChange={(e) => updateCodeTest(index, 'input_data', e.target.value)}
                            placeholder="2,3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Expected Output
                          </label>
                          <input
                            type="text"
                            value={test.expected_output}
                            onChange={(e) => updateCodeTest(index, 'expected_output', e.target.value)}
                            placeholder="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.code_tests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có test case nào. Nhấn "Thêm test" để bắt đầu.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Questions Section */}
            {shouldShowQuizQuestions && (
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-green-600" />
                    Câu hỏi trắc nghiệm
                  </h3>
                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm câu hỏi
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.quiz_questions.map((question, qIndex) => (
                    <div key={qIndex} className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Câu hỏi #{qIndex + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeQuizQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Nội dung câu hỏi
                        </label>
                        <input
                          type="text"
                          value={question.question_text}
                          onChange={(e) => updateQuizQuestion(qIndex, 'question_text', e.target.value)}
                          placeholder="Python là gì?"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">
                          Các lựa chọn (chọn đáp án đúng)
                        </label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct_${qIndex}`}
                              checked={question.correct_index === oIndex}
                              onChange={() => updateQuizQuestion(qIndex, 'correct_index', oIndex)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Lựa chọn ${String.fromCharCode(65 + oIndex)}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {formData.quiz_questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileQuestion className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-lg"
              >
                <Save className="h-5 w-5" />
                Tạo bài tập
              </button>
            </div>
          </div>
        </div>

        {/* Preview JSON */}
        {(formData.title || formData.description) && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preview JSON Data:</h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              {JSON.stringify({
                lesson_id: formData.lesson_id ? parseInt(formData.lesson_id) : '',
                type: formData.type,
                title: formData.title,
                description: formData.description,
                due_date: formData.due_date,
                ...(shouldShowCodeTests && { code_tests: formData.code_tests }),
                ...(shouldShowQuizQuestions && { quiz_questions: formData.quiz_questions })
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCreator;