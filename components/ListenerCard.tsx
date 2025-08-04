

import React from 'react';
import type { Listener } from '../types';

interface ListenerCardProps {
  listener: Listener;
  onSelectListener: (listener: Listener) => void;
}

const VerifiedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);


const ListenerCard: React.FC<ListenerCardProps> = ({ listener, onSelectListener }) => {

    const handleTalkNow = () => {
        onSelectListener(listener);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 text-center border border-slate-100 transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/20">
            <div className="relative">
                <img 
                    src={listener.image} 
                    alt={listener.name} 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-3 border-4 border-slate-100 object-cover" 
                />
                <div className="absolute top-0 right-1 md:right-3 bg-white rounded-full p-0.5">
                    <VerifiedIcon className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <h3 className="font-bold text-slate-800 text-lg md:text-xl truncate">{listener.name}</h3>
            <p className="text-slate-500 text-xs md:text-sm mb-3">{`(${listener.gender}, ${listener.age} yrs)`}</p>

            <div className="flex justify-around items-center text-xs md:text-sm text-center mb-4 text-slate-600 bg-slate-50 p-2 rounded-lg">
                <div>
                    <span className="font-bold text-slate-800">{listener.rating}★</span>
                    <span className="block text-slate-500 text-[10px] md:text-xs">({listener.reviewsCount})</span>
                </div>
                <div className="border-l h-6 border-slate-200"></div>
                <div>
                    <span className="font-bold text-slate-800">{listener.experienceHours}</span>
                    <span className="block text-slate-500 text-[10px] md:text-xs">घंटे अनुभव</span>
                </div>
            </div>

            <button 
                onClick={handleTalkNow}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-2.5 md:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
                TALK NOW
            </button>
        </div>
    );
};

export default React.memo(ListenerCard);
