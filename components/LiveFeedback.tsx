import React, { useState, useEffect } from 'react';

// Data for simulation
const feedbackNames = [
  'प्रिया', 'राहुल', 'अंजलि', 'विक्रम', 'पूजा', 'रोहन', 'स्नेहा', 'अमित', 'नेहा', 'आदित्य', 
  'कविता', 'मोहित', 'सोनिया', 'विशाल', 'दिव्या', 'करण', 'आरती', 'संदीप', 'मीना', 'पंकज', 
  'रश्मि', 'गौरव', 'सीमा', 'दीपक', 'सपना', 'सचिन', 'मनीषा', 'वरुण', 'निशा', 'अजय'
];

const positiveMessages = [
  "यहाँ बात करके बहुत शांति मिली।",
  "लगता है जैसे मन का बोझ उतर गया। धन्यवाद!",
  "सुनने वाले बहुत समझदार और धैर्यवान हैं।",
  "मैं अब बहुत बेहतर महसूस कर रहा हूँ।",
  "यह एक अद्भुत और सुरक्षित प्लेटफॉर्म है।",
  "SakoonApp ने वाकई में सकून दिया।",
  "अकेलेपन में एक सच्चा साथी मिला।",
  "मेरी सारी चिंताएं कुछ ही मिनटों में कम हो गईं।",
  "बहुत ही सकारात्मक और मददगार अनुभव रहा।",
  "मैं इसकी सिफारिश अपने दोस्तों को जरूर करूंगा/करूंगी।",
  "गुमनाम रहना बहुत बड़ी सुविधा है।",
  "तुरंत किसी से बात कर पाना बहुत अच्छा लगा।",
  "एकदम प्रोफेशनल और सहायक लोग।",
  "मेरा दिन बन गया, धन्यवाद SakoonApp!",
  "तनाव से बाहर निकलने में बहुत मदद मिली।"
];

const obscureName = (name: string): string => {
  if (name.length <= 2) {
    return `${name.charAt(0)}***`;
  }
  return `${name.charAt(0)}***${name.charAt(name.length - 1)}`;
};

interface CurrentFeedback {
    id: number;
    name: string;
    quote: string;
}

const LiveFeedback: React.FC = () => {
  const [currentFeedback, setCurrentFeedback] = useState<CurrentFeedback | null>(null);

  useEffect(() => {
    const showRandomFeedback = () => {
      const randomName = feedbackNames[Math.floor(Math.random() * feedbackNames.length)];
      const randomQuote = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      setCurrentFeedback({
        id: Date.now(),
        name: obscureName(randomName),
        quote: randomQuote
      });
    };

    // Reduced frequency to improve performance
    const intervalId = setInterval(showRandomFeedback, 15000); 
    const timeoutId = setTimeout(showRandomFeedback, 5000);

    return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="py-2 bg-gradient-to-b from-cyan-50 to-blue-100">
        <div className="container mx-auto px-6 h-24 flex items-center justify-center">
            {currentFeedback && (
            <div 
                key={currentFeedback.id} 
                className="animate-live-feedback w-full max-w-xl bg-white p-4 rounded-xl shadow-md border border-slate-200 mx-auto"
            >
                <p className="text-center text-slate-700 text-md italic">"{currentFeedback.quote}"</p>
                <p className="text-right text-cyan-700 font-semibold mt-2">- {currentFeedback.name}</p>
            </div>
            )}
        </div>
    </section>
  );
};

export default React.memo(LiveFeedback);
