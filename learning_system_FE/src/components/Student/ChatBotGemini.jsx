import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, Sparkles } from 'lucide-react';
import { sendChatGemini, getChatHistoryGemini, deleteChatHistoryGemini } from '../../../services/CodeCompletionService';
import { toast } from 'react-toastify';

// Hàm làm sạch và in đậm nếu có **...**
function cleanBotContent(content) {
    if (!content) return '';
    let lines = content.split('\n');
    let inCodeBlock = false;
    let cleaned = [];
    for (let line of lines) {
        // Xử lý mở/đóng block code
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        // Nếu dòng bắt đầu bằng * và kết thúc bằng ** thì in đậm toàn bộ dòng
        if (/^\*.*\*\*$/.test(line.trim())) {
            let text = line.trim().replace(/^\*\s*/, '').replace(/\*\*$/, '').trim();
            cleaned.push([{ type: 'bold', text }]);
            continue;
        }
        // Xóa * trước số thứ tự: *1. hoặc * 1.
        let newLine = line.replace(/^\*\s*\d+\.\s*/, '');
        // Xóa các ký tự đầu dòng: *, -, số thứ tự (1., 2., ...), *1., -1.
        newLine = newLine.replace(/^([*-]?\s*\d+\.|[*-])\s*/, '');
        // Nếu là dòng code, giữ nguyên
        if (inCodeBlock) {
            cleaned.push({ type: 'code', text: newLine });
        } else {
            // Xử lý in đậm **...**
            let parts = [];
            let lastIdx = 0;
            let regex = /\*\*(.+?)\*\*/g;
            let match;
            let found = false;
            while ((match = regex.exec(newLine)) !== null) {
                found = true;
                if (match.index > lastIdx) {
                    parts.push({ type: 'text', text: newLine.slice(lastIdx, match.index) });
                }
                parts.push({ type: 'bold', text: match[1] });
                lastIdx = match.index + match[0].length;
            }
            if (lastIdx < newLine.length) {
                parts.push({ type: 'text', text: newLine.slice(lastIdx) });
            }
            if (found) {
                cleaned.push(parts);
            } else {
                cleaned.push([{ type: 'text', text: newLine }]);
            }
        }
    }
    // Xóa dòng trống đầu/cuối
    while (cleaned.length && (Array.isArray(cleaned[0]) ? cleaned[0].every(p => p.text.trim() === '') : cleaned[0].text.trim() === '')) cleaned.shift();
    while (cleaned.length && (Array.isArray(cleaned[cleaned.length - 1]) ? cleaned[cleaned.length - 1].every(p => p.text.trim() === '') : cleaned[cleaned.length - 1].text.trim() === '')) cleaned.pop();
    // Xóa các dòng trống liên tiếp
    let final = [];
    let lastBlank = false;
    for (let l of cleaned) {
        let isBlank = Array.isArray(l) ? l.every(p => p.text.trim() === '') : l.text.trim() === '';
        if (isBlank) {
            if (!lastBlank) final.push(l);
            lastBlank = true;
        } else {
            final.push(l);
            lastBlank = false;
        }
    }
    return final;
}

const ChatBotGemini = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getChatHistoryGemini();
                if (Array.isArray(res?.history)) {
                    const flat = [];
                    res.history.slice().reverse().forEach(item => {
                        flat.push({
                            type: 'user',
                            content: item.question,
                            timestamp: item.created_at
                        });
                        flat.push({
                            type: 'bot',
                            content: item.answer,
                            timestamp: item.created_at
                        });
                    });
                    setHistory(flat);
                } else {
                    setHistory([]);
                }
            } catch {
                setHistory([]);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage = input.trim();
        setInput('');
        setLoading(true);
        const newUserMessage = {
            type: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };
        setHistory(prev => [...prev, newUserMessage]);
        const loadingMessage = {
            type: 'bot',
            content: '',
            loading: true,
            timestamp: new Date().toISOString()
        };
        setHistory(prev => [...prev, loadingMessage]);
        try {
            const res = await sendChatGemini(userMessage);
            const answer = res && (res.answer || (res.data && res.data.answer))
                ? (res.answer || res.data.answer)
                : 'Lỗi: Không nhận được phản hồi từ server.';
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = {
                    type: 'bot',
                    content: answer,
                    loading: false,
                    timestamp: new Date().toISOString()
                };
                return newHistory;
            });
        } catch {
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = {
                    type: 'bot',
                    content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                    loading: false,
                    error: true,
                    timestamp: new Date().toISOString()
                };
                return newHistory;
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render dòng bot với in đậm nếu có **...**
    function renderBotContent(content) {
        const lines = cleanBotContent(content);
        return lines.map((line, idx) => {
            if (Array.isArray(line)) {
                return (
                    <div key={idx}>
                        {line.map((part, i) =>
                            part.type === 'bold' ? <b key={i}>{part.text}</b> : part.text
                        )}
                    </div>
                );
            } else if (line.type === 'code') {
                return <pre key={idx} className="bg-gray-100 rounded p-2 my-1 text-sm overflow-x-auto"><code>{line.text}</code></pre>;
            } else {
                return <div key={idx}>{line.text}</div>;
            }
        });
    }

    // Xóa lịch sử chat
    const handleDeleteHistory = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?')) return;
        try {
            await deleteChatHistoryGemini();
            setHistory([]);
            toast.success('Đã xóa lịch sử chat!');
        } catch {
            toast.error('Xóa lịch sử thất bại!');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Trợ lý học tập AI</h1>
                            <p className="text-sm text-gray-500">Hỗ trợ học tập thông minh với AI</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDeleteHistory}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Xóa lịch sử
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white mb-4">
                                    <MessageCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chào mừng bạn!</h3>
                                <p className="text-gray-500 max-w-md">
                                    Hãy bắt đầu cuộc trò chuyện bằng cách đặt câu hỏi. Tôi sẵn sàng giúp bạn học tập và giải đáp thắc mắc.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    <button
                                        onClick={() => setInput('Giải thích về trí tuệ nhân tạo')}
                                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-colors"
                                    >
                                        Trí tuệ nhân tạo là gì?
                                    </button>
                                    <button
                                        onClick={() => setInput('Hướng dẫn học lập trình')}
                                        className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-colors"
                                    >
                                        Học lập trình như thế nào?
                                    </button>
                                    <button
                                        onClick={() => setInput('Giải bài toán')}
                                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm transition-colors"
                                    >
                                        Giúp giải bài toán
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((message, idx) => (
                                    <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                            {/* Avatar */}
                                            <div className={`flex-shrink-0 p-2 rounded-full ${message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </div>
                                            {/* Message Content */}
                                            <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : message.error
                                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                                }`}>
                                                {message.loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-gray-500">Đang suy nghĩ...</span>
                                                    </div>
                                                ) : (
                                                    message.type === 'bot'
                                                        ? renderBotContent(message.content)
                                                        : <div className="whitespace-pre-line">{message.content}</div>
                                                )}
                                                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                                                    }`}>
                                                    {formatTime(message.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="border-t border-gray-200 bg-white px-4 py-4">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 text-center mt-2">
                            Nhấn Enter để gửi tin nhắn
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBotGemini; 