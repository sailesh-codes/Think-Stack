import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import FAQItem from './components/FAQItem';
import ContactSupport from './components/ContactSupport';
import QuickLinks from './components/QuickLinks';
import Icon from '../../components/AppIcon';

const FAQSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredFAQs, setFilteredFAQs] = useState([]);

  const categories = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'quiz-generation', name: 'Quiz Generation' },
    { id: 'scoring', name: 'Scoring & Results' },
    { id: 'account', name: 'Account Management' },
    { id: 'technical', name: 'Technical Issues' }
  ];

  const faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: "How do I create my first quiz?",
      answer: `Creating your first quiz is simple and takes just a few steps:
        <br><br>
        <strong>Step 1:</strong> Navigate to the Home page and click "Generate Quiz"
        <br><br>
        <strong>Step 2:</strong> Enter your desired topic (e.g., "World History", "Science", "Mathematics")
        <br><br>
        <strong>Step 3:</strong> Select your preferred difficulty level (Easy, Medium, Hard, or Expert)
        <br><br>
        <strong>Step 4:</strong> Click "Generate Questions" and wait for the AI to create your personalized quiz
        <br><br>
        <strong>Step 5:</strong> Start taking your quiz and track your progress!
        <br><br>
        <em>Tip: Try starting with "Easy" difficulty to get familiar with the interface.</em>`,
      isPopular: true
    },
    {
      id: 2,
      category: 'quiz-generation',
      question: "What topics can I create quizzes about?",
      answer: `Our AI-powered quiz generator supports virtually any topic you can think of:
        <br><br>
        <strong>Academic Subjects:</strong> Mathematics, Science, History, Literature, Geography, Languages
        <br><br>
        <strong>Professional Skills:</strong> Programming, Marketing, Finance, Project Management, Design
        <br><br>
        <strong>General Knowledge:</strong> Sports, Entertainment, Current Events, Pop Culture
        <br><br>
        <strong>Specialized Topics:</strong> Medical terminology, Legal concepts, Technical certifications
        <br><br>
        Simply type your topic in the search box and our AI will generate relevant questions based on your chosen difficulty level.`,
      isPopular: true
    },
    {
      id: 3,
      category: 'quiz-generation',
      question: "How many questions are generated per quiz?",
      answer: `The number of questions varies based on your selected difficulty level:
        <br><br>
        <strong>Easy:</strong> 5-8 questions (perfect for quick practice)
        <br><br>
        <strong>Medium:</strong> 8-12 questions (balanced learning experience)
        <br><br>
        <strong>Hard:</strong> 12-15 questions (comprehensive assessment)
        <br><br>
        <strong>Expert:</strong> 15-20 questions (in-depth knowledge testing)
        <br><br>
        Each quiz is designed to provide an optimal learning experience without being overwhelming.`,
      isPopular: false
    },
    {
      id: 4,
      category: 'scoring',
      question: "How is my quiz score calculated?",
      answer: `Your quiz score is calculated using a straightforward percentage system:
        <br><br>
        <strong>Score = (Correct Answers ÷ Total Questions) × 100</strong>
        <br><br>
        <strong>Grade Levels:</strong>
        <br>• A+ (90-100%): Outstanding performance
        <br>• A (80-89%): Excellent work
        <br>• B (70-79%): Good understanding
        <br>• C (60-69%): Satisfactory progress
        <br>• D (Below 60%): Needs improvement
        <br><br>
        Your results are automatically saved to your quiz history for future reference.`,
      isPopular: true
    },
    {
      id: 5,
      category: 'scoring',
      question: "Can I retake a quiz to improve my score?",
      answer: `Absolutely! You can retake any quiz as many times as you'd like:
        <br><br>
        <strong>From Results Page:</strong> Click "Retake Quiz" after completing a quiz
        <br><br>
        <strong>From History:</strong> Navigate to your quiz history and select any previous quiz
        <br><br>
        <strong>New Questions:</strong> Each retake generates fresh questions on the same topic and difficulty
        <br><br>
        <strong>Score Tracking:</strong> We save your best score for each topic-difficulty combination
        <br><br>
        <em>Pro tip: Use retakes as a learning tool to master challenging topics!</em>`,
      isPopular: false
    },
    {
      id: 6,
      category: 'account',
      question: "Do I need to create an account to use Quiz Generator?",
      answer: `While you can try our quiz generator without an account, creating one unlocks powerful features:
        <br><br>
        <strong>Without Account:</strong> Basic quiz generation and taking
        <br><br>
        <strong>With Account:</strong>
        <br>• Save quiz history and track progress
        <br>• Bookmark favorite topics
        <br>• Access detailed performance analytics
        <br>• Sync across multiple devices
        <br>• Receive personalized quiz recommendations
        <br><br>
        Creating an account is free and takes less than 30 seconds!`,
      isPopular: true
    },
    {
      id: 7,
      category: 'account',
      question: "How do I reset my password?",
      answer: `Resetting your password is quick and secure:
        <br><br>
        <strong>Step 1:</strong> Go to the login page and click "Forgot Password?"
        <br><br>
        <strong>Step 2:</strong> Enter your registered email address
        <br><br>
        <strong>Step 3:</strong> Check your email for a password reset link
        <br><br>
        <strong>Step 4:</strong> Click the link and create a new password
        <br><br>
        <strong>Step 5:</strong> Log in with your new password
        <br><br>
        <em>Note: Reset links expire after 24 hours for security purposes.</em>`,
      isPopular: false
    },
    {
      id: 8,
      category: 'technical',question: "The quiz isn't loading. What should I do?",
      answer: `If you're experiencing loading issues, try these troubleshooting steps:
        <br><br>
        <strong>Quick Fixes:</strong>
        <br>• Refresh the page (Ctrl+F5 or Cmd+Shift+R)
        <br>• Clear your browser cache and cookies
        <br>• Try a different browser (Chrome, Firefox, Safari)
        <br>• Check your internet connection
        <br><br>
        <strong>Still Having Issues?</strong>
        <br>• Disable browser extensions temporarily
        <br>• Try incognito/private browsing mode
        <br>• Contact our support team with your browser details
        <br><br>
        <em>Most loading issues are resolved with a simple page refresh!</em>`,
      isPopular: false
    },
    {
      id: 9,
      category: 'technical',
      question: "Is Quiz Generator mobile-friendly?",
      answer: `Yes! Quiz Generator is fully optimized for all devices:
        <br><br>
        <strong>Mobile Features:</strong>
        <br>• Responsive design that adapts to your screen
        <br>• Touch-friendly interface for easy navigation
        <br>• Optimized loading for slower connections
        <br>• Full functionality on smartphones and tablets
        <br><br>
        <strong>Supported Devices:</strong>
        <br>• iOS (iPhone, iPad)
        <br>• Android phones and tablets
        <br>• Desktop computers
        <br>• Laptops and Chromebooks
        <br><br>
        Take quizzes anywhere, anytime!`,
      isPopular: false
    },
    {
      id: 10,
      category: 'getting-started',
      question: "What makes Quiz Generator different from other quiz platforms?",
      answer: `Quiz Generator stands out with several unique features:
        <br><br>
        <strong>AI-Powered Generation:</strong> Create unlimited quizzes on any topic instantly
        <br><br>
        <strong>Adaptive Difficulty:</strong> Four difficulty levels that truly challenge you
        <br><br>
        <strong>Personalized Learning:</strong> Track progress and get topic recommendations
        <br><br>
        <strong>No Limits:</strong> Generate as many quizzes as you want, completely free
        <br><br>
        <strong>Clean Interface:</strong> Distraction-free design focused on learning
        <br><br>
        <strong>Instant Results:</strong> Get detailed feedback immediately after each quiz
        <br><br>
        Experience the future of personalized learning today!`,
      isPopular: true
    }
  ];

  useEffect(() => {
    let filtered = faqData;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFAQs(filtered);
  }, [searchTerm, activeCategory]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleHelpfulVote = (isHelpful) => {
    console.log('FAQ helpful vote:', isHelpful);
  };

  return (
    <>
      <Helmet>
        <title>FAQ & Support - Quiz Generator</title>
        <meta name="description" content="Find answers to frequently asked questions about Quiz Generator. Get help with quiz creation, scoring, account management, and technical issues." />
        <meta name="keywords" content="FAQ, support, help, quiz generator, questions, answers, troubleshooting" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Icon name="HelpCircle" size={32} className="text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-inter">
                  Frequently Asked Questions
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Find quick answers to common questions about Quiz Generator. 
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-8">
                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} />

                {/* Category Filter */}
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />

                {/* Results Count */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? (
                      <>Showing {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchTerm}"</>
                    ) : (
                      <>Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} {activeCategory !== 'all' ? `in ${categories.find(cat => cat.id === activeCategory)?.name}` : ''}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Content */}
          <section className="pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ List */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                      <div
                        key={faq.id}
                        className="quiz-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <FAQItem
                          question={faq.question}
                          answer={faq.answer}
                          isPopular={faq.isPopular}
                          onHelpful={handleHelpfulVote}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No results found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search terms or browse different categories.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 quiz-focus-ring rounded"
                        >
                          Clear search
                        </button>
                        <button
                          onClick={() => setActiveCategory('all')}
                          className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 quiz-focus-ring rounded"
                        >
                          View all questions
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  <QuickLinks />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support Section */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <ContactSupport />
            </div>
          </section>

          {/* Additional Resources */}
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground font-inter mb-4">
                  Additional Resources
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore more ways to get the most out of Quiz Generator
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full">
                    <Icon name="BookOpen" size={24} className="text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">User Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive tutorials and best practices for creating effective quizzes
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full">
                    <Icon name="Video" size={24} className="text-warning" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step video guides to help you master all features
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full">
                    <Icon name="Users" size={24} className="text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Community Forum</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with other users and share quiz creation tips
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Think Stack. All rights reserved.</p>
              <p className="mt-2">
                Need more help? Contact us at{' '}
                <a href="mailto:support@quizgenerator.com" className="text-primary hover:text-primary/80 transition-colors duration-200">
                  support@quizgenerator.com
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FAQSupport;