import type { NavLink, Plan, FaqItem, Testimonial, Listener } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'होम', href: '#home' },
  { label: 'सेवाएं', href: '#services' },
  { label: 'हमारे बारे में', href: '#about' },
  { label: 'सवाल-जवाब', href: '#faq' },
  { label: 'संपर्क', href: '#contact' },
];

export const CALL_PLANS: Plan[] = [
  { duration: '5 मिनट', price: 30 },
  { duration: '10 मिनट', price: 50 },
  { duration: '15 मिनट', price: 70 },
  { duration: '30 मिनट', price: 130 },
  { duration: '1 घंटा', price: 200 },
];

export const CHAT_PLANS: Plan[] = [
  { duration: '5 मिनट', price: 5 },
  { duration: '10 मिनट', price: 10 },
  { duration: '15 मिनट', price: 15 },
  { duration: '30 मिनट', price: 30 },
  { duration: '1 घंटा', price: 50 },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'क्या मेरी पहचान गोपनीय रहेगी?',
    answer: 'हां, आपकी पहचान पूरी तरह सुरक्षित और गुप्त रखी जाएगी।',
    isPositive: true,
  },
  {
    question: 'क्या मैं कभी भी कॉल कर सकता/सकती हूं?',
    answer: 'हां, SakoonApp 24x7 सेवा देता है।',
    isPositive: true,
  },
  {
    question: 'क्या ये थेरेपी है?',
    answer: 'नहीं, यह प्रोफेशनल थेरेपी नहीं है, यह सिर्फ सुनने और भावनात्मक सपोर्ट देने वाला ऐप है।',
    isPositive: false,
  },
  {
    question: 'क्या एक बार में कई बार सेवा ले सकता हूं?',
    answer: 'हां, आप जितनी बार चाहें प्लान खरीद सकते हैं।',
    isPositive: true,
  },
];

export const LISTENERS_DATA: Listener[] = [
  {
    id: 1,
    name: 'रिया',
    gender: 'F',
    age: 22,
    image: 'https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    rating: 4.9,
    reviewsCount: '1.1K+',
    experienceHours: '1.2K+',
  },
  {
    id: 2,
    name: 'स्नेहा',
    gender: 'F',
    age: 19,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    rating: 4.8,
    reviewsCount: '900+',
    experienceHours: '1K+',
  },
  {
    id: 3,
    name: 'मीरा',
    gender: 'F',
    age: 21,
    image: 'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    rating: 4.9,
    reviewsCount: '1.5K+',
    experienceHours: '1.8K+',
  },
  {
    id: 4,
    name: 'कविता',
    gender: 'F',
    age: 24,
    image: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    rating: 4.9,
    reviewsCount: '2.2K+',
    experienceHours: '2.4K+',
  },
  {
    id: 5,
    name: 'पूजा',
    gender: 'F',
    age: 23,
    image: 'https://images.pexels.com/photos/3875217/pexels-photo-3875217.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    rating: 4.8,
    reviewsCount: '700+',
    experienceHours: '850+',
  },
  {
    id: 6,
    name: 'आराध्या',
    gender: 'F',
    age: 25,
    image: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    rating: 4.9,
    reviewsCount: '980+',
    experienceHours: '1.3K+',
  },
];


export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: 'प्रिया',
    quote: 'जब लगा कि कोई नहीं है, तब SakoonApp ने सहारा दिया। यहाँ बात करके बहुत हल्का महसूस हुआ। मैं अब अकेला महसूस नहीं करती।',
    image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  },
  {
    name: 'पूजा',
    quote: 'गुमनाम रहकर अपनी बात कह पाना मेरे लिए बहुत बड़ी राहत थी। सुनने वाले बहुत धैर्यवान और समझदार थे। धन्यवाद SakoonApp!',
    image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  },
  {
    name: 'सनी',
    quote: 'मैं अक्सर काम के तनाव के कारण अकेला महसूस करता था। इस ऐप के जरिए किसी से बात करके मुझे नई उम्मीद और हिम्मत मिली है।',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop',
  },
];