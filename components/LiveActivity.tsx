import React, { useState, useEffect } from 'react';

// Data for simulation
const indianNames = ['प्रिया', 'राहुल', 'अंजलि', 'विक्रम', 'पूजा', 'रोहन', 'स्नेहा', 'अमित', 'नेहा', 'आदित्य', 'कविता', 'मोहित', 'सोनिया', 'विशाल', 'दिव्या', 'करण', 'आरती', 'संदीप', 'मीना', 'पंकज', 'रश्मि', 'गौरव', 'सीमा', 'दीपक', 'सपना', 'सचिन', 'मनीषा', 'वरुण', 'निशा', 'अजय', 'किरण', 'विजय', 'अनीता', 'विकास', 'स्वाति', 'सुमित', 'ज्योति', 'अनिल', 'प्रीति', 'मनोज', 'संगीता', 'राजेश', 'पूनम', 'राकेश', 'रिंकी', 'संजय', 'सुनीता', 'अशोक', 'उर्मिला', 'सुनील', 'बबीता', 'मुकेश', 'रीना', 'रवि', 'पिंकी', 'सुरेश', 'काजल', 'अरुण', 'मधु', 'आनंद', 'शिल्पा', 'आलोक', 'नीलम', 'प्रवीण', 'मोनिका', 'नवीन', 'दीप्ति', 'विनोद', 'टीना', 'हरीश', 'एकता', 'हेमंत', 'राधा', 'धीरज', 'शिखा', 'कमल', 'चारु', 'गिरीश', 'लता', 'नरेन', 'मीनाक्षी', 'पार्थ', 'प्रियंका', 'ऋषभ', 'सारिका', 'सौरभ', 'शिवानी', 'तरुण', 'वैशाली', 'विवेक', 'यश', 'ज़ोया', 'अभिनव', 'भावना', 'चंदन', 'ईशा', 'हर्ष', 'जागृति', 'लोकेश', 'महिमा'];
const callPlans = ['5 मिनट', '15 मिनट', '30 मिनट', '1 घंटा'];
const chatPlans = ['10 मिनट', '30 मिनट', '1 घंटा'];

interface RecentPurchase {
  name: string;
  plan: string;
}

const LiveActivity: React.FC = () => {
  const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const [callUsers, setCallUsers] = useState(getRandomNumber(56, 259));
  const [chatUsers, setChatUsers] = useState(getRandomNumber(67, 149));
  const [recentActivity, setRecentActivity] = useState<{ type: 'call' | 'chat'; purchase: RecentPurchase; id: number } | null>(null);

  useEffect(() => {
    const countInterval = setInterval(() => {
      setCallUsers(getRandomNumber(56, 259));
      setChatUsers(getRandomNumber(67, 149));
    }, 60000);

    const activityInterval = setInterval(() => {
      const type = Math.random() > 0.5 ? 'call' : 'chat';
      const name = indianNames[Math.floor(Math.random() * indianNames.length)];
      const plan = type === 'call'
        ? callPlans[Math.floor(Math.random() * callPlans.length)]
        : chatPlans[Math.floor(Math.random() * chatPlans.length)];
      
      setRecentActivity({ type, purchase: { name, plan }, id: Date.now() });

    }, getRandomNumber(12000, 17000)); // New activity every 12-17 seconds (Increased interval for performance)

    return () => {
      clearInterval(countInterval);
      clearInterval(activityInterval);
    };
  }, []);
  
  const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
  );
  
  const LiveDot: React.FC<{className?: string}> = ({className}) => (
      <span className={`relative flex h-3 w-3 ${className}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
  );


  return (
    <section id="live-activity" className="py-12 bg-slate-800 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <LiveDot />
            <h2 className="text-3xl md:text-4xl font-bold">अभी लाइव</h2>
          </div>
          <p className="text-lg text-slate-400">देखें कितने लोग अभी SakoonApp पर जुड़े हुए हैं!</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-700/50 p-6 rounded-xl shadow-lg border border-cyan-500/30 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-600/50">
            {/* Live Call Section */}
            <div className="relative flex items-center justify-center space-x-4 py-4 md:py-0 md:pr-4">
              <div className="bg-cyan-900/50 p-4 rounded-full">
                <PhoneIcon />
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-extrabold text-cyan-300 tracking-tighter">{callUsers}</p>
                <p className="text-lg text-slate-300 font-medium">लोग कॉल पर जुड़े हैं</p>
              </div>
              {recentActivity?.type === 'call' && (
                <div key={recentActivity.id} className="animate-fade-in-out absolute -bottom-5 w-full flex justify-center px-2">
                  <p className="text-xs bg-cyan-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-center truncate">
                      {recentActivity.purchase.name} ने अभी {recentActivity.purchase.plan} का कॉल प्लान खरीदा।
                  </p>
                </div>
              )}
            </div>
            
            {/* Live Chat Section */}
            <div className="relative flex items-center justify-center space-x-4 py-4 md:py-0 md:pl-4">
              <div className="bg-teal-900/50 p-4 rounded-full">
                <ChatIcon />
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-extrabold text-teal-300 tracking-tighter">{chatUsers}</p>
                <p className="text-lg text-slate-300 font-medium">लोग चैट पर जुड़े हैं</p>
              </div>
               {recentActivity?.type === 'chat' && (
                <div key={recentActivity.id} className="animate-fade-in-out absolute -bottom-5 w-full flex justify-center px-2">
                  <p className="text-xs bg-teal-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-center truncate">
                      {recentActivity.purchase.name} ने अभी {recentActivity.purchase.plan} का चैट प्लान खरीदा।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LiveActivity);
