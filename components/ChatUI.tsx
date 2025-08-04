

import React, { useState, useEffect, useRef } from 'react';
import type { ChatSession, Message, User } from '../types';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini AI model.
// The API key is sourced from the `process.env.API_KEY` environment variable as per the coding guidelines.
let ai: GoogleGenAI | null = null;
try {
  // The execution environment is expected to provide process.env.API_KEY.
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.error("API_KEY environment variable not set. Gemini chat will be disabled.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI.", e);
}


interface ChatUIProps {
  session: ChatSession;
  user: User;
  onLeave: () => void;
  onSessionActive: () => void;
}

const formatTime = (ms: number): string => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);


const ChatUI: React.FC<ChatUIProps> = ({ session, user, onLeave, onSessionActive }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(!session.isActive);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionActiveHandled = useRef(session.isActive);

  const listener = session.listener;
  const defaultListenerImage = "https://cdn-icons-png.flaticon.com/512/2966/2966472.png";


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, streamingResponse]);

  // Timer effect
  useEffect(() => {
    if (!session.expiryTimestamp) return;

    const updateTimer = () => {
        const remaining = session.expiryTimestamp! - Date.now();
        if (remaining <= 0) {
            setTimeLeft(0);
            alert("आपका चैट का समय समाप्त हो गया है।");
            onLeave();
        } else {
            setTimeLeft(remaining);
        }
    };

    updateTimer(); // Initial call
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [session.expiryTimestamp, onLeave]);

  // Connection and welcome message effect
  useEffect(() => {
    if (isConnecting && !sessionActiveHandled.current) {
        const connectChat = () => {
            setIsConnecting(false);
            onSessionActive();
            sessionActiveHandled.current = true;
            
            // Add welcome message to local state
            const welcomeMessageText = `नमस्ते, मैं ${listener ? listener.name : 'SakoonApp श्रोता'} हूँ, आपकी मदद के लिए यहाँ हूँ। बताएं, आपके मन में क्या है?`;
            const welcomeMessage: Message = { 
              id: `msg-${Date.now()}`,
              sender: 'bot' as const, 
              text: welcomeMessageText,
              photo: listener?.image || defaultListenerImage,
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        };

      // Simulate connection delay
      const connectionTimer = setTimeout(connectChat, 2500);
      return () => clearTimeout(connectionTimer);
    }
  }, [isConnecting, onSessionActive, listener, session.id, user, onLeave]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping || isConnecting || !ai) return;

    const currentInput = inputMessage;
    setInputMessage('');

    // Add user message to local state
    const newUserMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'user' as const,
        text: currentInput,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    try {
        setIsTyping(true);
        setStreamingResponse(""); // Initialize streaming state

        // Get chat history from local state
        const chatHistory = messages
            .filter(m => m.text) // Ensure message text exists
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));
        
        // Combine history with the new message to create the `contents` for the API call
        const contents = [
            ...chatHistory,
            { role: 'user', parts: [{ text: currentInput }] }
        ];
        
        const systemInstruction = `You are a compassionate listener for an app called SakoonApp. Your name is ${listener?.name || 'Sakoon Listener'}. Your age is ${listener?.age || 22}.
        Your persona is empathetic, kind, understanding, and supportive. You are not a medical professional or therapist. Do not provide medical advice.
        Your goal is to make the user feel heard, understood, and less alone. Keep your responses concise, warm, and in HINDI.
        The user's name is ${user.name}. 
        Always respond in Hindi.`;

        // Get AI response via stateless streaming
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents,
            config: { systemInstruction },
        });
        
        let finalResponseText = "";
        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            finalResponseText += chunkText;
            setStreamingResponse(prev => (prev ?? "") + chunkText);
        }
        
        // After stream is complete, add the final message to local state
        if (finalResponseText) {
             const botResponse: Message = {
                id: `msg-${Date.now()}-bot`,
                sender: 'bot' as const,
                text: finalResponseText,
                photo: listener?.image || defaultListenerImage,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }

    } catch (error) {
        console.error("Error sending message or getting AI response:", error);
        // Restore message on error
        setInputMessage(currentInput); 
        // Also add an error message to the chat
        const errorResponse: Message = {
            id: `msg-${Date.now()}-error`,
            sender: 'bot' as const,
            text: "माफ़ कीजिए, मुझे जवाब देने में कुछ तकनीकी समस्या आ रही है। कृपया थोड़ी देर बाद फिर प्रयास करें।",
            photo: listener?.image || defaultListenerImage,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsTyping(false);
        setStreamingResponse(null); // Reset streaming state
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className="relative">
                 <img src={listener?.image || defaultListenerImage} alt={listener?.name || 'SakoonApp श्रोता'} className="flex-shrink-0 h-12 w-12 rounded-full object-cover bg-cyan-100" />
                {!isConnecting && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>}
            </div>
            <div>
                <h1 className="font-bold text-slate-800 text-lg">{listener?.name || 'SakoonApp श्रोता'}</h1>
                {isConnecting ? (
                    <p className="text-sm text-slate-500 animate-pulse flex items-center gap-2">
                       <span className="block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                       कनेक्ट हो रहा है...
                    </p>
                ) : (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>ऑनलाइन</span>
                    </div>
                )}
            </div>
        </div>
        <div className="flex items-center gap-4">
            {session.expiryTimestamp && (
                <div className="text-right">
                    <span className="font-bold text-red-600 text-xl">{formatTime(timeLeft)}</span>
                    <p className="text-xs text-slate-500 -mt-1">समय शेष</p>
                </div>
            )}
            <button
              onClick={onLeave}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              समाप्त करें
            </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                 <img src={msg.photo} alt="Listener" className="flex-shrink-0 h-10 w-10 rounded-full object-cover" />
              )}
              <div className={`p-3 rounded-lg shadow max-w-lg ${msg.sender === 'user' ? 'bg-cyan-500 text-white rounded-l-lg rounded-tr-lg' : 'bg-white text-slate-800 rounded-r-lg rounded-tl-lg'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">{user.name.charAt(0)}</div>
              )}
            </div>
          ))}

          {streamingResponse !== null && (
             <div className="flex items-end gap-3">
                <img src={listener?.image || defaultListenerImage} alt="Typing" className="flex-shrink-0 h-10 w-10 rounded-full object-cover" />
                <div className="p-3 rounded-lg shadow max-w-lg bg-white text-slate-800 rounded-r-lg rounded-tl-lg">
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                      {streamingResponse}
                      <span className="inline-block align-bottom w-0.5 h-4 bg-slate-800 animate-pulse ml-1" aria-hidden="true" />
                  </p>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="bg-white p-4 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={!ai ? "AI चैट सेवा उपलब्ध नहीं है" : (isConnecting ? "कनेक्ट हो रहा है..." : (isTyping ? "श्रोता टाइप कर रहे हैं..." : "संदेश टाइप करें..."))}
            disabled={isTyping || isConnecting || !ai}
            className="w-full p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={isTyping || isConnecting || !inputMessage.trim() || !ai}
            className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            aria-label="संदेश भेजें"
          >
           <SendIcon className="w-6 h-6" />
          </button>
        </form>
         {!ai && <p className="text-xs text-red-500 text-center mt-2">AI चैट सेवा उपलब्ध नहीं है। कृपया सुनिश्चित करें कि API कुंजी कॉन्फ़िगर है।</p>}
      </footer>
    </div>
  );
};

export default React.memo(ChatUI);