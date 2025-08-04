

export interface NavLink {
  label: string;
  href: string;
}

export interface Plan {
  duration: string;
  price: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  isPositive: boolean;
}

export interface Testimonial {
  name: string;
  quote: string;
  image: string;
}

export interface User {
  uid: string;
  name: string; // Can be 'यूज़र' or 'गुमनाम यूज़र'
  mobile: string;
}

export interface Listener {
  id: number;
  name: string;
  gender: 'F' | 'M';
  age: number;
  image: string;
  rating: number;
  reviewsCount: string;
  experienceHours: string;
}

export interface CallSession {
  roomId: string;
  userName:string;
  plan: Plan;
  expiryTimestamp?: number; 
  listener?: Listener;
  purchasedPlanId?: string; // Links session to the purchased plan for refund logic
}

export interface ChatSession {
  id: string; // Unique ID for each chat (Firestore doc ID)
  plan: Plan;
  isActive: boolean; // To track if connection is established
  expiryTimestamp?: number; 
  listener?: Listener;
  purchasedPlanId?: string; // Links session to the purchased plan for refund logic
}

export interface PurchasedPlan {
  id: string;
  type: 'call' | 'chat';
  plan: Plan;
  purchaseTimestamp: number;
  expiryTimestamp: number;
  listenerId?: number; // Links refunded plan to a specific listener
  planId?: 'daily_deal'; // To identify special plans
  validFromTimestamp?: number; // For plans that activate at a later time
}