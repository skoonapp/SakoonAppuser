

import React from 'react';
import FAQItem from './FAQItem';
import { FAQ_DATA } from '../constants';

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            अक्सर पूछे जाने वाले सवाल
          </h2>
          <p className="text-lg text-slate-600">आपके सवालों के जवाब।</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} isPositive={faq.isPositive} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
