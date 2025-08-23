import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import HomeQuizGeneration from "pages/home-quiz-generation";
import UserAuthentication from "pages/user-authentication";
import FaqSupport from "pages/faq-support";
import FeaturesOverview from "pages/features-overview";
import QuizTakingInterface from "pages/quiz-taking-interface";
import QuizResultsScoring from "pages/quiz-results-scoring";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<HomeQuizGeneration />} />
        <Route path="/home-quiz-generation" element={<HomeQuizGeneration />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/faq-support" element={<FaqSupport />} />
        <Route path="/features-overview" element={<FeaturesOverview />} />
        <Route path="/quiz-taking-interface" element={<QuizTakingInterface />} />
        <Route path="/quiz-results-scoring" element={<QuizResultsScoring />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;