import React from 'react';

const SocialIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <a href="#" className="text-slate-500 hover:text-cyan-600 transition-colors">{children}</a>
);

interface FooterProps {
  onShowTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms }) => {
  
  const handleLinkClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    const targetId = href.startsWith('#') ? href.substring(1) : href;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-slate-800 text-slate-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SakoonApp</h3>
            <p className="text-slate-400">भावनात्मक सपोर्ट, जब भी आपको ज़रूरत हो।</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">क्विक लिंक्स</h3>
            <ul className="space-y-2">
              <li><a href="#services" onClick={(e) => handleLinkClick(e, '#services')} className="hover:text-white transition-colors">सेवाएं</a></li>
              <li><a href="#faq" onClick={(e) => handleLinkClick(e, '#faq')} className="hover:text-white transition-colors">सवाल-जवाब</a></li>
              <li><button onClick={(e) => handleLinkClick(e, '#contact')} className="bg-transparent border-none p-0 hover:text-white transition-colors">फीडबैक दें</button></li>
              <li><button onClick={onShowTerms} className="bg-transparent border-none p-0 hover:text-white transition-colors">नियम व शर्तें</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">जुड़ें</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <SocialIcon>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689-.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" /></svg>
              </SocialIcon>
              <SocialIcon>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.211 3.791 4.649-.69.188-1.432.233-2.18.086.623 1.942 2.41 3.32 4.545 3.359-1.771 1.39-4.012 2.213-6.444 2.213-.418 0-.83-.023-1.235-.073 2.289 1.465 5.013 2.31 7.942 2.31 9.493 0 14.73-7.854 14.498-14.807z" /></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SakoonApp. सर्वाधिकार सुरक्षित।</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;