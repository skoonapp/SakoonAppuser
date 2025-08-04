

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MyPlans from './components/MyPlans';
import LiveFeedback from './components/LiveFeedback';
import LiveActivity from './components/LiveActivity';
import Listeners from './components/Listeners';
import Services from './components/Services';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CallUI from './components/CallUI';
import ChatUI from './components/ChatUI';
import LoginScreen from './components/LoginScreen';
import TermsAndConditions from './components/TermsAndConditions';
import { LISTENERS_DATA, CHAT_PLANS } from './constants';
import type { User, CallSession, ChatSession, Plan, Listener, PurchasedPlan } from './types';


const parseDurationToMinutes = (duration: string): number => {
  if (duration.includes('घंटा') || duration.includes('hour')) {
    const hours = parseInt(duration, 10);
    return isNaN(hours) ? 0 : hours * 60;
  }
  if (duration.includes('मिनट') || duration.includes('minute')) {
    const minutes = parseInt(duration, 10);
    return isNaN(minutes) ? 0 : minutes;
  }
  return 0;
};

const getDurationInMs = (duration: string): number => {
    const minutes = parseDurationToMinutes(duration);
    if (minutes <= 0) {
        console.error("Could not parse duration:", duration);
        return 0;
    }
    return minutes * 60 * 1000;
};


const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // No longer loading from Firebase
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  
  const [purchasedPlans, setPurchasedPlans] = useState<PurchasedPlan[]>([]);
  const [activatingCallPlan, setActivatingCallPlan] = useState<PurchasedPlan | null>(null);
  const [activatingChatPlan, setActivatingChatPlan] = useState<PurchasedPlan | null>(null);

  const handleLogin = useCallback((mobile: string) => {
      const newUser: User = {
          uid: `user-${Date.now()}`,
          name: 'यूज़र',
          mobile: mobile,
      };
      setCurrentUser(newUser);

      // Grant the free 5-minute chat plan
      const freePlan = CHAT_PLANS.find(p => p.duration === '5 मिनट');
      if (freePlan) {
          const now = Date.now();
          const freePlanData: PurchasedPlan = {
              id: `plan-${now}`,
              type: 'chat' as const,
              plan: freePlan,
              purchaseTimestamp: now,
              expiryTimestamp: now + 7 * 24 * 60 * 60 * 1000, // 7-day validity
          };
          setPurchasedPlans([freePlanData]);
      }
      setLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setPurchasedPlans([]);
  }, []);

  const handlePurchaseSuccess = useCallback(async (plan: Plan, type: 'call' | 'chat', planId?: 'daily_deal') => {
    if (!currentUser) return;
    const now = new Date();
    
    let expiryTimestamp: number;
    let validFromTimestamp: number | undefined = undefined;

    if (planId === 'daily_deal') {
        const validFrom = new Date(now);
        validFrom.setHours(23, 0, 0, 0); // 11 PM today

        const expiry = new Date(validFrom);
        // The duration of the plan is 55 minutes, starting from 11 PM
        expiry.setMinutes(expiry.getMinutes() + 55); 
        
        validFromTimestamp = validFrom.getTime();
        expiryTimestamp = expiry.getTime();

    } else {
        // Regular 7-day validity
        expiryTimestamp = now.getTime() + 7 * 24 * 60 * 60 * 1000;
    }

    const newPlan: PurchasedPlan = {
      id: `plan-${type}-${now.getTime()}`,
      type,
      plan,
      purchaseTimestamp: now.getTime(),
      expiryTimestamp,
      planId,
      validFromTimestamp,
    };
    setPurchasedPlans(prevPlans => [...prevPlans, newPlan]);
  }, [currentUser]);
  
  const handleStartCall = useCallback((purchasedPlan: PurchasedPlan, listener: Listener) => {
    if (currentUser) {
      const roomId = `sakoon-call-${currentUser.uid}-${Date.now()}`;
      const newSession: CallSession = {
        roomId,
        userName: currentUser.name,
        plan: purchasedPlan.plan,
        listener: listener,
        purchasedPlanId: purchasedPlan.id,
      };
      setCallSession(newSession);
    }
  }, [currentUser]);

  const handleStartChat = useCallback((purchasedPlan: PurchasedPlan, listener: Listener) => {
    if (currentUser) {
      const newSession: ChatSession = {
        id: `chat-${currentUser.uid}-${Date.now()}`,
        plan: purchasedPlan.plan,
        isActive: false,
        listener: listener,
        purchasedPlanId: purchasedPlan.id,
      };
      setChatSession(newSession);
    }
  }, [currentUser]);

  const handleActivatePlan = useCallback((planId: string) => {
    const planToActivate = purchasedPlans.find(p => p.id === planId);
    if (!planToActivate) {
        alert("प्लान नहीं मिला। कृपया पुनः प्रयास करें।");
        return;
    }
    
    // New check for activation time
    if (planToActivate.validFromTimestamp && Date.now() < planToActivate.validFromTimestamp) {
        const activationTime = new Date(planToActivate.validFromTimestamp).toLocaleTimeString('hi-IN', { hour: 'numeric', minute: '2-digit' });
        alert(`यह प्लान अभी सक्रिय नहीं है। यह आज ${activationTime} के बाद उपयोग के लिए उपलब्ध होगा।`);
        return;
    }

    if (planToActivate.listenerId) {
        const listener = LISTENERS_DATA.find(l => l.id === planToActivate.listenerId);
        if (listener) {
            if (planToActivate.type === 'call') {
                handleStartCall(planToActivate, listener);
            } else {
                handleStartChat(planToActivate, listener);
            }
        } else {
            alert("जिस श्रोता से आपकी बात हो रही थी, वह अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।");
        }
        return; 
    }
    
    const listenersSection = document.getElementById('listeners');
    
    if (planToActivate.type === 'chat') {
        setActivatingChatPlan(planToActivate);
    } else {
        setActivatingCallPlan(planToActivate);
    }

    if (listenersSection) {
        listenersSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [purchasedPlans, handleStartCall, handleStartChat]);

  const handleSelectListener = useCallback((listener: Listener) => {
    if (activatingCallPlan) {
        handleStartCall(activatingCallPlan, listener);
        setActivatingCallPlan(null);
    } else if (activatingChatPlan) {
        handleStartChat(activatingChatPlan, listener);
        setActivatingChatPlan(null);
    } else {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }, [activatingCallPlan, activatingChatPlan, handleStartCall, handleStartChat]);

  const handleSessionActive = useCallback((type: 'call' | 'chat') => {
    let sessionToActivate: CallSession | ChatSession | null = null;
    if (type === 'call') {
      sessionToActivate = callSession;
    } else {
      sessionToActivate = chatSession;
    }

    if (!sessionToActivate || !sessionToActivate.purchasedPlanId || !currentUser) return;

    // Remove the used plan from local state
    setPurchasedPlans(prevPlans => prevPlans.filter(p => p.id !== sessionToActivate!.purchasedPlanId));
    
    const durationMs = getDurationInMs(sessionToActivate.plan.duration);
    const expiryTimestamp = Date.now() + durationMs;

    if (type === 'call') {
      const activeSession = { ...sessionToActivate, expiryTimestamp };
      setCallSession(activeSession as CallSession);
    } else {
      const activeSession = { ...sessionToActivate, isActive: true, expiryTimestamp };
      setChatSession(activeSession as ChatSession);
    }
  }, [callSession, chatSession, currentUser]);

  const handleEndCall = useCallback(async () => {
    const sessionToEnd = { ...callSession };
    
    setCallSession(null);
    setActivatingCallPlan(null);

    if (!sessionToEnd.expiryTimestamp || !currentUser) {
        return;
    }

    const remainingMs = sessionToEnd.expiryTimestamp - Date.now();
    
    if (remainingMs > 60000) {
        const remainingMinutes = Math.round(remainingMs / 60000);
        const now = Date.now();
        const refundedPlanData: PurchasedPlan = {
            id: `plan-refund-call-${now}`,
            type: 'call' as const,
            plan: {
                duration: `${remainingMinutes} मिनट`,
                price: 0, 
            },
            purchaseTimestamp: now,
            expiryTimestamp: now + 7 * 24 * 60 * 60 * 1000,
            listenerId: sessionToEnd.listener?.id,
        };
        
        setPurchasedPlans(prevPlans => [...prevPlans, refundedPlanData]);
        alert(`कॉल अप्रत्याशित रूप से समाप्त हो गई। आपके बचे हुए ${remainingMinutes} मिनट ${sessionToEnd.listener ? sessionToEnd.listener.name + ' के साथ बात करने के लिए' : ''} आपके प्लान्स में वापस जोड़ दिए गए हैं।`);
    }
  }, [callSession, currentUser]);
  
  const handleEndChat = useCallback(async () => {
    const sessionToEnd = { ...chatSession }; 

    setChatSession(null);
    setActivatingChatPlan(null);

    if (!sessionToEnd.expiryTimestamp || !sessionToEnd.isActive || !currentUser) {
      return;
    }

    const remainingMs = sessionToEnd.expiryTimestamp - Date.now();
    
    if (remainingMs > 60000) {
        const remainingMinutes = Math.round(remainingMs / 60000);
        const now = Date.now();
        const refundedPlanData: PurchasedPlan = {
            id: `plan-refund-chat-${now}`,
            type: 'chat' as const,
            plan: {
                duration: `${remainingMinutes} मिनट`,
                price: 0,
            },
            purchaseTimestamp: now,
            expiryTimestamp: now + 7 * 24 * 60 * 60 * 1000,
            listenerId: sessionToEnd.listener?.id, 
        };
        
        setPurchasedPlans(prevPlans => [...prevPlans, refundedPlanData]);
        alert(`चैट अप्रत्याशित रूप से समाप्त हो गया। आपके बचे हुए ${remainingMinutes} मिनट ${sessionToEnd.listener ? sessionToEnd.listener.name + ' के साथ बात करने के लिए' : ''} आपके प्लान्स में वापस जोड़ दिए गए हैं।`);
    }
  }, [chatSession, currentUser]);
  
  const handleShowTerms = useCallback(() => setShowTerms(true), []);
  const handleCloseTerms = useCallback(() => setShowTerms(false), []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-cyan-700 mb-4 animate-pulse">SakoonApp</h1>
          <p className="text-slate-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (callSession) {
    return <CallUI session={callSession} user={currentUser} onLeave={handleEndCall} onSessionActive={() => handleSessionActive('call')} />;
  }
  
  if (chatSession) {
    return <ChatUI session={chatSession} user={currentUser} onLeave={handleEndChat} onSessionActive={() => handleSessionActive('chat')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100 relative overflow-x-hidden">
      <Header 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main>
        <Hero />
        <MyPlans plans={purchasedPlans} onActivatePlan={handleActivatePlan} />
        <LiveFeedback />
        <LiveActivity />
        <Listeners 
            onSelectListener={handleSelectListener} 
            isActivationMode={!!activatingCallPlan || !!activatingChatPlan}
        />
        <Services 
          onPurchaseSuccess={handlePurchaseSuccess}
          currentUser={currentUser} 
        />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer onShowTerms={handleShowTerms} />
      {showTerms && <TermsAndConditions onClose={handleCloseTerms} />}
    </div>
  );
};

export default App;