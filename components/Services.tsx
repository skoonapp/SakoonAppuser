

import React, { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import Testimonials from './Testimonials';
import { CALL_PLANS, CHAT_PLANS } from '../constants';
import type { Plan, User } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ServicesProps {
  onPurchaseSuccess: (plan: Plan, type: 'call' | 'chat', planId?: 'daily_deal') => void;
  currentUser: User;
}

const DailyDealTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const deadline = new Date(now);
            deadline.setHours(11, 0, 0, 0); // 11:00:00 AM

            if (now > deadline) {
                setTimeLeft('समाप्त हो गया');
                return;
            }

            const diff = deadline.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            setTimeLeft(`${hours} घंटे ${minutes} मिनट`);
        };
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return <span className="font-bold text-orange-600">{timeLeft}</span>;
};

const Services: React.FC<ServicesProps> = ({ onPurchaseSuccess, currentUser }) => {
  const [now, setNow] = useState(new Date());
  const [loadingType, setLoadingType] = useState<'call' | 'chat' | null>(null);

  useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
      return () => clearInterval(timer);
  }, []);

  const isDealActive = now.getHours() < 11;

  const handleDailyDealPurchase = (type: 'call' | 'chat') => {
      setLoadingType(type);
      const plan: Plan = {
          duration: '55 मिनट',
          price: type === 'call' ? 399 : 199,
      };

      const RAZORPAY_KEY_ID = 'rzp_test_gV1tLH2ZnCWti9';
      const options = {
          key: RAZORPAY_KEY_ID,
          amount: plan.price * 100,
          currency: "INR",
          name: "SakoonApp - आज का स्पेशल",
          description: `एक ${type === 'chat' ? 'चैट' : 'कॉल'} प्लान खरीदें - ${plan.duration}`,
          image: "https://cdn-icons-png.flaticon.com/512/2966/2966472.png",
          handler: (response: any) => {
              console.log("Payment successful:", response);
              alert(`आपका 'आज का स्पेशल' ${type === 'call' ? 'कॉल' : 'चैट'} प्लान सफलतापूर्वक खरीद लिया गया है!`);
              setLoadingType(null);
              onPurchaseSuccess(plan, type, 'daily_deal');
          },
          prefill: {
              name: currentUser.name,
              contact: currentUser.mobile
          },
          notes: {
              plan_duration: plan.duration,
              plan_type: type,
              plan_id: 'daily_deal'
          },
          theme: {
              color: "#F97316" // Orange-500
          },
          modal: {
              ondismiss: () => {
                  setLoadingType(null);
              }
          }
      };
      
      try {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (response: any) => {
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

  const combinedPlans = CALL_PLANS.map((callPlan, index) => ({
    duration: callPlan.duration,
    callPlan: callPlan,
    chatPlan: CHAT_PLANS[index],
    isPopular: callPlan.duration === '30 मिनट'
  })).sort((a, b) => {
      if (a.isPopular) return -1;
      if (b.isPopular) return 1;
      return 0;
  });

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

const LightningBoltIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
);


  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">हमारी सेवाएं</h2>
          <p className="text-lg text-slate-600">अपनी सुविधा के अनुसार प्लान चुनें। आपके खरीदे गए प्लान 'मेरे प्लान्स' सेक्शन में जुड़ जाएंगे।</p>
        </div>
        
        {/* Daily Deal Card */}
        <div className="max-w-4xl mx-auto mb-16">
            <div className="relative bg-gradient-to-tr from-orange-100 via-amber-100 to-yellow-100 rounded-2xl shadow-xl border-2 border-amber-400 p-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-md font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <LightningBoltIcon className="w-5 h-5"/>
                    आज का स्पेशल
                </div>
                <div className="text-center mt-6">
                    <p className="text-slate-700 text-md max-w-2xl mx-auto">यह प्लान रोज़ सुबह 11 बजे से पहले उपलब्ध होता है और उसी दिन रात 11:00 बजे से 11:55 बजे तक वैध रहता है।</p>
                    {isDealActive && (
                        <p className="mt-2 text-sm text-slate-600">
                            ऑफर समाप्त होने में: <DailyDealTimer />
                        </p>
                    )}
                </div>
                
                <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Call Option */}
                    <div className={`flex flex-col items-center p-4 rounded-lg transition-all ${isDealActive ? 'bg-orange-50' : 'bg-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <PhoneIcon className="w-5 h-5 text-orange-600" />
                            <h4 className="text-lg font-semibold text-orange-800">कॉलिंग प्लान</h4>
                        </div>
                        <p className="text-2xl font-bold text-slate-600 mb-1">55 मिनट</p>
                        <p className="text-4xl font-extrabold text-slate-800 mb-3">₹399</p>
                        <button
                          onClick={() => handleDailyDealPurchase('call')}
                          disabled={!isDealActive || loadingType !== null}
                          className="w-full mt-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                          {loadingType === 'call' ? 'प्रोसेसिंग...' : 'अभी खरीदें'}
                        </button>
                    </div>
                    {/* Chat Option */}
                    <div className={`flex flex-col items-center p-4 rounded-lg transition-all ${isDealActive ? 'bg-yellow-50' : 'bg-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <ChatIcon className="w-5 h-5 text-amber-600" />
                            <h4 className="text-lg font-semibold text-amber-800">चैट प्लान</h4>
                        </div>
                         <p className="text-2xl font-bold text-slate-600 mb-1">55 मिनट</p>
                        <p className="text-4xl font-extrabold text-slate-800 mb-3">₹199</p>
                        <button
                          onClick={() => handleDailyDealPurchase('chat')}
                          disabled={!isDealActive || loadingType !== null}
                          className="w-full mt-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                          {loadingType === 'chat' ? 'प्रोसेसिंग...' : 'अभी खरीदें'}
                        </button>
                    </div>
                </div>

                 {!isDealActive && (
                    <p className="text-center text-red-600 font-semibold mt-6 bg-red-100 p-2 rounded-md">यह ऑफर आज के लिए समाप्त हो गया है। कल सुबह 11 बजे से पहले फिर से प्रयास करें।</p>
                )}
            </div>
        </div>

        {/* Regular Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {combinedPlans.map((p, index) => (
            <PlanCard 
              key={index}
              duration={p.duration}
              callPlan={p.callPlan}
              chatPlan={p.chatPlan}
              isPopular={p.isPopular}
              onPurchaseSuccess={onPurchaseSuccess}
              currentUser={currentUser}
            />
          ))}
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Payment Gateway Info */}
        <div className="mt-20 text-center p-8 bg-white rounded-xl shadow-lg">
           <h3 className="text-2xl font-bold text-slate-700 mb-4">सुरक्षित पेमेंट</h3>
           <div className="flex justify-center items-center space-x-8 mb-4">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhVsdJq4qB2BFf2u0YFpG_iyGkKxrydK_s3w&s" alt="Razorpay" className="h-10" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR23iWkY41gYyBYDIqCRf5w5H7qsd8j4lI_GQ&s" alt="Paytm" className="h-12" />
           </div>
           <p className="text-md text-green-700 font-semibold mb-2">सभी लेन-देन 100% सुरक्षित और गोपनीय हैं।</p>
           <p className="text-sm text-slate-500">यदि किसी कारण से आपका भुगतान असफल हो जाता है, तो रिफंड की राशि 24 घंटे के भीतर आपके मूल खाते में वापस जमा कर दी जाएगी।</p>
        </div>

      </div>
    </section>
  );
};

export default React.memo(Services);