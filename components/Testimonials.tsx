

import React, { useState, useEffect } from 'react';
import { TESTIMONIALS_DATA } from '../constants';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS_DATA.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-16 text-center bg-white py-12 rounded-2xl shadow-lg">
        <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">हमारे उपयोगकर्ताओं के अनुभव</h3>
        <div className="relative max-w-2xl mx-auto h-64 overflow-hidden px-4">
            {TESTIMONIALS_DATA.map((testimonial, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center p-4 ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white mb-4"
                    />
                    <p className="text-lg text-slate-600 italic mb-2">"{testimonial.quote}"</p>
                    <p className="font-bold text-cyan-700 text-xl">- {testimonial.name}</p>
                </div>
            ))}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
            {TESTIMONIALS_DATA.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-cyan-600' : 'bg-slate-300'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
  );
};

export default Testimonials;