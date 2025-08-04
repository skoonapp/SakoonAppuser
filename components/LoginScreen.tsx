

import React, { useState } from 'react';

const LockIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface LoginScreenProps {
    onLogin: (mobile: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handleLoginClick = () => {
        if (!/^\d{10}$/.test(mobile)) {
            setError('कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।');
            return;
        }
        setError('');
        setLoading(true);
        // Simulate a network request
        setTimeout(() => {
            onLogin(mobile);
            // Loading state will be managed by App component's re-render
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">SakoonApp</h1>
                    <p className="text-cyan-300 text-lg">बात करने से मन हल्का होता है।</p>
                </div>
                
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 mb-8">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">
                        अभी लॉगिन करें मोबाइल नंबर से
                    </h2>
                    
                    <div className="space-y-4">
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ''); // Allow only digits
                              if (value.length <= 10) {
                                  setMobile(value);
                              }
                          }}
                          placeholder="10-अंकीय मोबाइल नंबर"
                          className="w-full bg-white/20 text-white placeholder-cyan-200/80 p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center text-lg tracking-wider"
                        />
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button
                            onClick={handleLoginClick}
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 shadow-xl disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {loading ? 'लॉग इन हो रहा है...' : 'लॉग इन करें'}
                        </button>
                    </div>

                    <div className="flex items-center justify-center text-cyan-200 mt-6 text-sm">
                        <LockIcon className="w-5 h-5 mr-2" />
                        <span>आपकी पहचान और बातचीत 100% गोपनीय है।</span>
                    </div>
                </div>

                <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">क्यों जुड़ें?</h2>
                        <ul className="space-y-3 text-cyan-200">
                            <li className="flex items-start">
                                <CheckIcon className="w-6 h-6 mr-3 text-cyan-400 flex-shrink-0 mt-0.5"/>
                                <span>गुमनाम रहकर अनुभवी श्रोताओं से बात करें।</span>
                            </li>
                            <li className="flex items-start">
                                <CheckIcon className="w-6 h-6 mr-3 text-cyan-400 flex-shrink-0 mt-0.5"/>
                                <span>24x7 मदद, जब भी आपको ज़रूरत हो।</span>
                            </li>
                            <li className="flex items-start">
                                <CheckIcon className="w-6 h-6 mr-3 text-cyan-400 flex-shrink-0 mt-0.5"/>
                                <span>अपनी मर्ज़ी और बजट के अनुसार प्लान चुनें।</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-cyan-500/20 border border-cyan-400 rounded-xl p-6 text-center flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white">🎁 पहले 5 मिनट मुफ़्त!</h3>
                        <p className="text-cyan-100 mt-2">हर नए यूज़र को मिलता है 5 मिनट का चैट ट्रायल, बिल्कुल मुफ़्त। आज ही आजमाएं!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;