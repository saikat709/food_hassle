'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Trash2, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
}

interface FloatingChatbotProps {
    userId: string;
}

export default function FloatingChatbot({ userId }: FloatingChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [showSessions, setShowSessions] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Load chat history when opened
    useEffect(() => {
        if (isOpen && sessions.length === 0) {
            loadChatHistory();
        }
    }, [isOpen]);

    const loadChatHistory = async () => {
        try {
            const response = await fetch(`/api/chatbot/history?userId=${userId}&limit=5`);
            const data = await response.json();

            if (data.success) {
                setSessions(data.data.map((session: any) => ({
                    id: session.id,
                    title: session.title,
                    messages: session.messages.map((msg: any) => ({
                        id: msg.id,
                        role: msg.role,
                        content: msg.content,
                        timestamp: new Date(msg.createdAt),
                    })),
                })));
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const loadSession = (session: ChatSession) => {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        setShowSessions(false);
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
        setShowSessions(false);
    };

    const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await fetch('/api/chatbot/history', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, userId }),
            });

            if (response.ok) {
                setSessions(sessions.filter(s => s.id !== sessionId));
                if (currentSessionId === sessionId) {
                    startNewChat();
                }
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputMessage,
                    userId,
                    sessionId: currentSessionId || undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.data.response,
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, assistantMessage]);
                setCurrentSessionId(data.data.sessionId);

                // Reload sessions to update titles
                if (!currentSessionId) {
                    loadChatHistory();
                }
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
                    aria-label="Open NourishBot"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 top-3 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">NourishBot</h3>
                                <p className="text-xs text-white/80">Your AI Food Assistant</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSessions(!showSessions)}
                                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                                title="Chat History"
                            >
                                <Plus className={`w-5 h-5 transition-transform ${showSessions ? 'rotate-45' : ''}`} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Sessions Sidebar */}
                    {showSessions && (
                        <div className="bg-gray-50 border-b border-gray-200 p-3 max-h-48 overflow-y-auto">
                            <button
                                onClick={startNewChat}
                                className="w-full bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors mb-2 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Chat
                            </button>
                            <div className="space-y-1">
                                {sessions.map(session => (
                                    <div
                                        key={session.id}
                                        onClick={() => loadSession(session)}
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${currentSessionId === session.id
                                            ? 'bg-green-100 border border-green-300'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-sm truncate flex-1">{session.title}</span>
                                        <button
                                            onClick={(e) => deleteSession(session.id, e)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="text-sm font-medium">Start a conversation!</p>
                                <p className="text-xs mt-1">Ask me about:</p>
                                <div className="mt-3 space-y-1 text-xs">
                                    <div className="bg-white px-3 py-2 rounded-lg">🗑️ Food waste reduction</div>
                                    <div className="bg-white px-3 py-2 rounded-lg">🥗 Nutrition advice</div>
                                    <div className="bg-white px-3 py-2 rounded-lg">💰 Budget meal planning</div>
                                    <div className="bg-white px-3 py-2 rounded-lg">♻️ Leftover ideas</div>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                        }`}
                                >
                                    <div className={`text-sm whitespace-pre-wrap prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-white' : 'dark:prose-invert'} [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4`}>
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                    <p
                                        className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
