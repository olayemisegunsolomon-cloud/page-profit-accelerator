/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import QuizFlow from './components/QuizFlow';
import ResultsPage from './components/ResultsPage';
import BookingModal from './components/BookingModal';
import { QuizAnswers } from './types';

type ScreenView = 'landing' | 'quiz' | 'results';

export default function App() {
  const [view, setView] = useState<ScreenView>('landing');
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [score, setScore] = useState<number>(68); // fallback benchmark score is 68 as shown in results html, but dynamic calculation takes priority!
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  // Transition handlers
  const handleStartQuiz = () => {
    setView('quiz');
  };

  const handleFinishQuiz = (quizAnswers: QuizAnswers, finalScore: number) => {
    setAnswers(quizAnswers);
    setScore(finalScore);
    setView('results');
  };

  const handleRestart = () => {
    setAnswers(null);
    setScore(68);
    setView('landing'); 
  };

  return (
    <div className="bg-dark-bg min-h-screen text-on-surface select-none">
      {/* Route Views switcher */}
      {view === 'landing' && (
        <LandingPage onStartQuiz={handleStartQuiz} />
      )}
      
      {view === 'quiz' && (
        <QuizFlow 
          onFinishQuiz={handleFinishQuiz} 
          onBackToHome={() => setView('landing')} 
        />
      )}
      
      {view === 'results' && answers && (
        <ResultsPage 
          answers={answers} 
          score={score} 
          onOpenBooking={() => setIsBookingOpen(true)}
          onRestart={handleRestart}
        />
      )}

      {/* Booking Modal render overlay on results screen */}
      {isBookingOpen && answers && (
        <BookingModal 
          answers={answers} 
          onClose={() => setIsBookingOpen(false)} 
        />
      )}
    </div>
  );
}

