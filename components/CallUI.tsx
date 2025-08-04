

import React, { useEffect, useRef, useState } from 'react';
import type { CallSession, User } from '../types';
import { fetchZegoToken } from '../utils/zego';

// ZegoUIKitPrebuilt is loaded from a script tag in index.html
declare global {
  interface Window {
    ZegoUIKitPrebuilt: any;
  }
}

interface CallUIProps {
  session: CallSession;
  user: User;
  onLeave: () => void;
  onSessionActive: () => void;
}

const EndCallIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.298-.083.465a7.48 7.48 0 003.429 3.429c.167.081.364.052.465-.083l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C6.542 22.5 1.5 17.458 1.5 9.75V4.5z" clipRule="evenodd" />
    </svg>
);

const RetryCallIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-1.353.589a11.042 11.042 0 005.152 5.152l.59-1.353a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-2.148a13.5 13.5 0 01-11.352-11.352V3.5z" />
    </svg>
);

const CallUI: React.FC<CallUIProps> = ({ session, user, onLeave, onSessionActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zpInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState<'connecting' | 'error' | 'connected'>('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0); // For retry logic
  const sessionActiveHandled = useRef(false);

  // Auto-leave timer based on plan duration
  useEffect(() => {
    // Only start the timer if the session has an expiryTimestamp (i.e., is active)
    if (!session.expiryTimestamp) {
      return;
    }

    const remainingTime = session.expiryTimestamp - Date.now();
    if (remainingTime <= 0) {
      onLeave();
      return;
    }
    const timer = setTimeout(() => {
      alert("आपका समय समाप्त हो गया है। कॉल अपने आप कट जाएगी।");
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
      }
      onLeave();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [session.expiryTimestamp, onLeave]);

  // Zego initialization effect
  useEffect(() => {
    setStatus('connecting'); // Reset status on retry
    setErrorMessage('');
    
    let checkInterval: number;
    let failTimeout: number;

    const initZego = async () => {
      if (!containerRef.current || !user) return;
      
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
        zpInstanceRef.current = null;
      }
      
      try {
        const kitToken = await fetchZegoToken(session.roomId, user.uid, user.name);
        
        const zp = window.ZegoUIKitPrebuilt.create(kitToken);
        zpInstanceRef.current = zp;

        zp.joinRoom({
          container: containerRef.current,
          scenario: { mode: window.ZegoUIKitPrebuilt.VoiceCall },
          showScreenSharingButton: false,
          showPinButton: false,
          showCameraToggleButton: false,
          showCallTimer: true,
          turnOnMicrophoneWhenJoining: true,
          showPreJoinView: false, // Don't show Zego's pre-join UI
          onLeaveRoom: onLeave,
          onUserJoin: (users: any[]) => {
            console.log('A user joined the call:', users);
            setStatus('connected');
            if (!sessionActiveHandled.current) {
              onSessionActive();
              sessionActiveHandled.current = true;
            }
          },
          onUserLeave: (users: any[]) => {
            console.log('A user left the call:', users);
            if (zp.getAllUsers().length <= 1) onLeave();
          },
          onJoinRoom: () => {
             if (zp.getAllUsers().length > 1) {
                setStatus('connected');
                if (!sessionActiveHandled.current) {
                  onSessionActive();
                  sessionActiveHandled.current = true;
                }
             }
          },
        });

      } catch (err: any) {
         console.error("Error initializing Zego UI Kit:", err);
         setErrorMessage(`कॉल शुरू करने में एक तकनीकी त्रुटि हुई। सुनिश्चित करें कि आपका सर्वर टोकन जेनरेट कर रहा है। (${err.message})`);
         setStatus('error');
      }
    };
    
    const attemptToInitZego = async () => {
      if (typeof window.ZegoUIKitPrebuilt !== 'undefined') {
        clearInterval(checkInterval);
        clearTimeout(failTimeout);
        await initZego();
      }
    };
    
    checkInterval = window.setInterval(attemptToInitZego, 300);
    failTimeout = window.setTimeout(() => {
      clearInterval(checkInterval);
      if (zpInstanceRef.current === null) {
        console.error("ZegoUIKitPrebuilt library did not load or init failed.");
        setErrorMessage("कॉलिंग सेवा से कनेक्ट नहीं हो सका। कृपया अपना नेटवर्क जांचें।");
        setStatus('error');
      }
    }, 15000); // 15 second timeout

    return () => {
      clearInterval(checkInterval);
      clearTimeout(failTimeout);
    };
  }, [session.roomId, user.uid, user.name, onLeave, onSessionActive, retryCount]);

   // Cleanup on component unmount
   useEffect(() => {
    return () => {
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
        zpInstanceRef.current = null;
      }
    }
  }, []);

  const listener = session.listener;
  const defaultListenerImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center p-4 transition-all duration-300">
        
        {/* Zego Container (visually hidden until connected) */}
        <div 
            ref={containerRef}
            className={`w-full h-full absolute inset-0 z-10 transition-opacity duration-500 ${status === 'connected' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        />
        
        {/* Custom UI Overlay */}
        <div className={`z-20 w-full h-full flex flex-col items-center justify-center text-center transition-opacity duration-500 ${status === 'connected' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

          {status === 'connecting' && (
            <>
              <img 
                src={listener?.image || defaultListenerImage} 
                alt={listener?.name || 'Listener'}
                className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-white/20 mb-6 animate-pulse"
              />
              <h2 className="text-3xl font-bold text-white mb-2">
                {listener ? `${listener.name} से कनेक्ट हो रहा है...` : 'श्रोता से कनेक्ट हो रहा है...'}
              </h2>
              <p className="text-slate-300 mb-8">आपका समय तभी शुरू होगा जब वे जुड़ेंगे।</p>
            </>
          )}

          {status === 'error' && (
            <div className="p-8 bg-red-800/50 rounded-lg max-w-md">
                <h2 className="text-2xl font-bold text-red-300 mb-4">कनेक्शन में त्रुटि</h2>
                <p className="text-red-200 mb-6">{errorMessage}</p>
                <div className="flex space-x-4 justify-center">
                    <button
                        onClick={() => setRetryCount(c => c + 1)}
                        className="flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <RetryCallIcon className="w-5 h-5"/>
                        <span>फिर से प्रयास करें</span>
                    </button>
                    <button
                        onClick={onLeave}
                        className="flex items-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <EndCallIcon className="w-5 h-5"/>
                        <span>रद्द करें</span>
                    </button>
                </div>
            </div>
          )}

          {/* End Call Button (visible during connecting) */}
          {status === 'connecting' && (
            <div className="absolute bottom-16">
              <button 
                onClick={onLeave}
                className="w-20 h-20 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
                aria-label="कॉल समाप्त करें"
              >
                <EndCallIcon className="w-10 h-10" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
};

export default React.memo(CallUI);