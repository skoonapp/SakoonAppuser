

import React from 'react';
import type { PurchasedPlan } from '../types';
import { LISTENERS_DATA } from '../constants';

interface MyPlansProps {
  plans: PurchasedPlan[];
  onActivatePlan: (planId: string) => void;
}

const formatValidity = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const formatActivationTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('hi-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const CallIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const ChatIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
);

const MyPlans: React.FC<MyPlansProps> = ({ plans, onActivatePlan }) => {
  if (plans.length === 0) {
    return (
        <section id="my-plans" className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-2xl font-bold text-slate-800 mb-3">मेरे खरीदे हुए प्लान्स</h2>
                 <div className="max-w-xl mx-auto bg-slate-100 p-8 rounded-lg shadow-inner text-slate-500">
                    <p>आपके पास अभी कोई खरीदा हुआ प्लान नहीं है।</p>
                    <p className="mt-2">नीचे 'सेवाएं' सेक्शन से एक प्लान खरीदें।</p>
                 </div>
            </div>
        </section>
    );
  }

  return (
    <section id="my-plans" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">मेरे खरीदे हुए प्लान्स</h2>
          <p className="text-lg text-slate-600">आपके खरीदे गए प्लान्स यहाँ हैं। आप इन्हें वैधता समाप्त होने से पहले कभी भी उपयोग कर सकते हैं।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => {
            const lockedListener = p.listenerId ? LISTENERS_DATA.find(l => l.id === p.listenerId) : null;
            const isDailyDeal = p.planId === 'daily_deal';
            const isLockedForActivation = isDailyDeal && p.validFromTimestamp && Date.now() < p.validFromTimestamp;

            const cardBg = isDailyDeal 
              ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300' 
              : 'bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200';
              
            return (
              <div key={p.id} className={`${cardBg} p-5 rounded-xl shadow-lg border flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-center mb-3">
                      <span className={`flex items-center gap-2 font-bold text-lg ${p.type === 'call' ? (isDailyDeal ? 'text-orange-800' : 'text-cyan-800') : (isDailyDeal ? 'text-amber-800' : 'text-teal-800')}`}>
                          {p.type === 'call' ? <CallIcon className="w-5 h-5"/> : <ChatIcon className="w-5 h-5"/>}
                          {isDailyDeal ? `स्पेशल ${p.type === 'call' ? 'कॉल' : 'चैट'}` : (p.type === 'call' ? 'कॉलिंग प्लान' : 'चैट प्लान')}
                      </span>
                      <span className="bg-white text-slate-700 font-bold px-3 py-1 rounded-full text-xl">{p.plan.duration}</span>
                  </div>
                   <p className="text-sm text-slate-600 mb-4 text-center">
                        {isDailyDeal && p.validFromTimestamp
                            ? <>वैधता: <span className="font-semibold">आज रात {formatActivationTime(p.validFromTimestamp)} से 55 मिनट के लिए</span></>
                            : <>वैधता: <span className="font-semibold">{formatValidity(p.expiryTimestamp)}</span> तक</>
                        }
                    </p>
                  {lockedListener && (
                    <p className="text-sm text-center text-teal-700 font-semibold mb-3 border border-dashed border-teal-400 bg-teal-100/50 py-1.5 px-2 rounded-md">
                        यह प्लान केवल {lockedListener.name} के साथ जारी रखने के लिए है।
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => onActivatePlan(p.id)}
                  disabled={isLockedForActivation}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:bg-gradient-to-r disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLockedForActivation
                    ? `रात ${formatActivationTime(p.validFromTimestamp!)} पर सक्रिय होगा`
                    : (lockedListener ? (p.type === 'call' ? "कॉल जारी रखें" : "बातचीत जारी रखें") : "अभी उपयोग करें")
                  }
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(MyPlans);