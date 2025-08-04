import React, { useState, useEffect, useRef } from 'react';
import { LISTENERS_DATA } from '../constants';
import ListenerCard from './ListenerCard';
import type { Listener } from '../types';

// Icons for navigation
const ChevronLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

interface ListenersProps {
  onSelectListener: (listener: Listener) => void;
  isActivationMode: boolean;
}

const Listeners: React.FC<ListenersProps> = ({ onSelectListener, isActivationMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === LISTENERS_DATA.length - 1 ? 0 : prevIndex + 1
        ),
      20000 // 20 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);
  
  const numListeners = LISTENERS_DATA.length;

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? numListeners - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === numListeners - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <section id="listeners" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            {isActivationMode ? (
                <>
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-3">
                        किससे बात करना चाहेंगे?
                    </h2>
                    <p className="text-lg text-slate-600">अपने खरीदे हुए प्लान को शुरू करने के लिए एक श्रोता चुनें।</p>
                </>
            ) : (
                <>
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-3">
                        मुझसे बात करो
                    </h2>
                    <p className="text-lg text-slate-600">किसी ऐसे व्यक्ति से जुड़ें जो आपको समझे। आज ही बात करें।</p>
                </>
            )}
        </div>
        
        <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform ease-in-out duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {LISTENERS_DATA.map(listener => (
                <div key={listener.id} className="w-full flex-shrink-0 px-2">
                  <ListenerCard listener={listener} onSelectListener={onSelectListener} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 p-2 bg-white/70 hover:bg-white rounded-full shadow-lg transition-all focus:outline-none z-10"
            aria-label="Previous Listener"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 p-2 bg-white/70 hover:bg-white rounded-full shadow-lg transition-all focus:outline-none z-10"
            aria-label="Next Listener"
          >
            <ChevronRightIcon />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {LISTENERS_DATA.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-cyan-600' : 'bg-slate-300'}`}
                aria-label={`Go to listener ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listeners;