

import React, { useState } from 'react';
import type { Plan, User } from '../types';

// Declare Razorpay on the window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PlanCardProps {
  duration: string;
  callPlan: Plan;
  chatPlan: Plan;
  isPopular?: boolean;
  onPurchaseSuccess: (plan: Plan, type: 'call' | 'chat', planId?: 'daily_deal') => void;
  currentUser: User;
}


const PhoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const ChatIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
);

const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);


const PlanCard: React.FC<PlanCardProps> = ({ duration, callPlan, chatPlan, isPopular = false, onPurchaseSuccess, currentUser }) => {
  const [loadingType, setLoadingType] = useState<'call' | 'chat' | null>(null);

  const RAZORPAY_KEY_ID = 'rzp_test_gV1tLH2ZnCWti9';

  const handlePurchase = (plan: Plan, type: 'call' | 'chat') => {
    setLoadingType(type);

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Amount is in paise
        currency: "INR",
        name: "SakoonApp",
        description: `एक ${type === 'chat' ? 'चैट' : 'कॉल'} प्लान खरीदें - ${plan.duration}`,
        image: "https://cdn-icons-png.flaticon.com/512/2966/2966472.png",
        handler: function (response: any) {
            console.log("Payment successful:", response);
            alert(`आपका ${plan.duration} का ${type === 'call' ? 'कॉल' : 'चैट'} प्लान सफलतापूर्वक खरीद लिया गया है! आप इसे 'मेरे प्लान्स' सेक्शन में देख सकते हैं।`);
            setLoadingType(null);
            onPurchaseSuccess(plan, type);
        },
        prefill: {
            name: currentUser.name,
            contact: currentUser.mobile
        },
        notes: {
            plan_duration: plan.duration,
            plan_type: type
        },
        theme: {
            color: "#0891B2" // Cyan-600
        },
        modal: {
            ondismiss: function() {
                console.log('Payment modal was closed.');
                setLoadingType(null);
            }
        }
    };

    try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            console.error("Payment failed:", response);
            alert(`भुगतान विफल हो गया।\nत्रुटि: ${response.error.description}\nकृपया पुनः प्रयास करें।`);
            setLoadingType(null);
        });
        rzp.open();
    } catch(error) {
        console.error("Razorpay error:", error);
        alert("भुगतान प्रोसेस करने में एक त्रुटि हुई। कृपया बाद में प्रयास करें।");
        setLoadingType(null);
    }
  };

  const popularContainerStyles = isPopular 
    ? 'bg-gradient-to-br from-cyan-50 to-blue-200 border-cyan-400 scale-105 shadow-2xl shadow-cyan-500/30' 
    : 'bg-white border-slate-200 shadow-md';

  return (
    <div className={`relative ${popularContainerStyles} rounded-2xl p-6 flex flex-col text-center items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2`}>
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-lg animate-pulse">
          सबसे लोकप्रिय
        </div>
      )}
      <div className="mb-5 mt-4 w-full flex justify-center items-center gap-2">
        {isPopular && <StarIcon className="w-6 h-6 text-amber-400" />}
        <p className={`text-2xl font-bold ${isPopular ? 'text-blue-800' : 'text-slate-800'}`}>{duration}</p>
        {isPopular && <StarIcon className="w-6 h-6 text-amber-400" />}
      </div>
      
      <div className="w-full grid grid-cols-2 gap-4 divide-x divide-slate-200">
        {/* Call Option */}
        <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-2 mb-3">
                <PhoneIcon className="w-5 h-5 text-cyan-600" />
                <h4 className="text-lg font-semibold text-cyan-800">कॉलिंग</h4>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mb-4">
              ₹{callPlan.price}
            </p>
            <button
              onClick={() => handlePurchase(callPlan, 'call')}
              disabled={loadingType !== null}
              className="w-full mt-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loadingType === 'call' ? 'प्रोसेसिंग...' : 'खरीदें'}
            </button>
        </div>
        {/* Chat Option */}
        <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-2 mb-3">
                <ChatIcon className="w-5 h-5 text-teal-600" />
                <h4 className="text-lg font-semibold text-teal-800">चैट</h4>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mb-4">
              ₹{chatPlan.price}
            </p>
            <button
              onClick={() => handlePurchase(chatPlan, 'chat')}
              disabled={loadingType !== null}
              className="w-full mt-auto bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loadingType === 'chat' ? 'प्रोसेसिंग...' : 'खरीदें'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanCard);