import { Question } from './types';

export const QUESTIONS_LIST: Question[] = [
  {
    id: 'mobileLoadSpeed',
    stepType: 'practices',
    title: 'MOBILE PAGE SPEED',
    description: 'Is your mobile page load time under 3 seconds?',
    options: ['Yes', 'No', 'Not sure'],
    positiveOptions: ['Yes'],
  },
  {
    id: 'whatsappCapture',
    stepType: 'practices',
    title: 'WHATSAPP REVENUE LEAK',
    description: 'Do you capture WhatsApp numbers early in the customer journey (product page or cart)?',
    options: ['Yes - Early', 'Yes - Late', 'No'],
    positiveOptions: ['Yes - Early'],
    partialOptions: ['Yes - Late'],
  },
  {
    id: 'guestCheckout',
    stepType: 'practices',
    title: 'CHECKOUT FRICTION',
    description: 'Is guest checkout enabled with fewer than 4 steps?',
    options: ['Yes', 'No'],
    positiveOptions: ['Yes'],
  },
  {
    id: 'searchBar',
    stepType: 'practices',
    title: 'NAVIGATION & SEARCH',
    description: 'Is your search bar prominent and highly functional?',
    options: ['Yes', 'Somewhat', 'No'],
    positiveOptions: ['Yes'],
    partialOptions: ['Somewhat'],
  },
  {
    id: 'custom404',
    stepType: 'practices',
    title: 'TRAFFIC RECOVERY',
    description: 'Do you have a smart/custom 404 page that tries to recover traffic?',
    options: ['Yes', 'Basic "Page Not Found"', 'No'],
    positiveOptions: ['Yes'],
    partialOptions: ['Basic "Page Not Found"'],
  },
  {
    id: 'loyaltyVisible',
    stepType: 'practices',
    title: 'RETENTION & LOYALTY',
    description: 'Is your loyalty or repeat purchase program clearly visible at checkout?',
    options: ['Yes', 'No'],
    positiveOptions: ['Yes'],
  },
  {
    id: 'postPurchaseFlow',
    stepType: 'practices',
    title: 'AUTOMATIONS',
    description: 'Do you have automated post-purchase thank-you + reorder flows?',
    options: ['Yes', 'Partial', 'No'],
    positiveOptions: ['Yes'],
    partialOptions: ['Partial'],
  },
  {
    id: 'ga4Tracking',
    stepType: 'practices',
    title: 'TRACKING & ANALYTICS',
    description: 'Is your Google Analytics 4 + eCommerce tracking fully set up with proper UTMs?',
    options: ['Yes', 'Partial', 'No'],
    positiveOptions: ['Yes'],
    partialOptions: ['Partial'],
  },
  {
    id: 'heatmapsUsed',
    stepType: 'practices',
    title: 'USER EXPERIENCE AUDIT',
    description: 'Do you use heatmaps or session recordings to identify user friction?',
    options: ['Yes', 'No'],
    positiveOptions: ['Yes'],
  },
  {
    id: 'abTesting',
    stepType: 'practices',
    title: 'OPTIMIZATION ENGINE',
    description: 'Have you tested at least 2 different page variations in the last 90 days?',
    options: ['Yes', 'No'],
    positiveOptions: ['Yes'],
  },
  // Part 3 - Qualification Questions
  {
    id: 'currentSituation',
    stepType: 'qualification',
    title: 'BUSINESS PHASE',
    description: 'Which best describes your current situation?',
    options: [
      'Early stage / struggling (< ₦10M revenue)',
      'Stuck at 7 figures and frustrated with growth',
      'Scaling past ₦50M and want faster growth',
      'Already doing well but hitting a plateau'
    ],
    positiveOptions: ['Scaling past ₦50M and want faster growth', 'Already doing well but hitting a plateau']
  },
  {
    id: 'desiredOutcome',
    stepType: 'qualification',
    title: 'NEXT 90 DAYS TARGET',
    description: 'What’s your #1 desired outcome in the next 90 days?',
    options: [
      'Significantly increase conversion rate',
      'Boost repeat purchases & customer lifetime value',
      'Fix major revenue leaks and stabilize growth',
      'Scale consistently into 8-figure revenue'
    ],
    positiveOptions: ['Scale consistently into 8-figure revenue', 'Significantly increase conversion rate']
  },
  {
    id: 'biggestObstacle',
    stepType: 'qualification',
    title: 'GROWTH BARRIERS',
    description: 'What’s the biggest obstacle holding you back right now?',
    options: [
      'Don’t know exactly where the leaks are',
      'Technical limitations or lack of time',
      'High cart abandonment & low trust',
      'No proper systems or automations in place'
    ],
    positiveOptions: []
  },
  {
    id: 'preferredSolution',
    stepType: 'qualification',
    title: 'IDEAL PARTNERSHIP',
    description: 'Which type of solution would suit you best?',
    options: [
      'Free resources & checklists',
      'Templates + training (Done-With-You)',
      'Full done-for-you Growth Engine rebuild',
      'Ongoing managed optimization & retainer'
    ],
    positiveOptions: []
  }
];
