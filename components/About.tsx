import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          हमारे बारे में
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            SakoonApp एक मानसिक शांति और भावनात्मक सपोर्ट ऐप है, जहाँ आप सुनने वाले लोगों से बात कर सकते हैं, गुमनाम रूप से। हमारा लक्ष्य अकेलेपन को कम करना और लोगों को एक सुरक्षित स्थान प्रदान करना है जहाँ वे बिना किसी झिझक के अपनी भावनाओं को साझा कर सकें।
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;