/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContactInfo {
  fullName: string;
  email: string;
  whatsapp: string;
  monthlyRevenue: string;
}

export interface QuizAnswers extends ContactInfo {
  // Part 1 is ContactInfo directly
  
  // Part 2 Best Practices
  mobileLoadSpeed: string; // Q5
  whatsappCapture: string; // Q6
  guestCheckout: string; // Q7
  searchBar: string; // Q8
  custom404: string; // Q9
  loyaltyVisible: string; // Q10
  postPurchaseFlow: string; // Q11
  ga4Tracking: string; // Q12
  heatmapsUsed: string; // Q13
  abTesting: string; // Q14

  // Part 3 Qualification
  currentSituation: string; // Q15
  desiredOutcome: string; // Q16
  biggestObstacle: string; // Q17
  preferredSolution: string; // Q18
  additionalNotes?: string; // Q19
}

export type QuizStepType = 'discovery' | 'practices' | 'qualification';

export interface Question {
  id: keyof QuizAnswers;
  stepType: QuizStepType;
  title: string;
  description: string;
  options: string[];
  positiveOptions: string[]; // Options that score full points
  partialOptions?: string[]; // Options that score half/partial points
}
