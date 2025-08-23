import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthHeader from './components/AuthHeader';
import AuthForm from './components/AuthForm';
import AuthBenefits from './components/AuthBenefits';
import Icon from '../../components/AppIcon';


const UserAuthentication = () => {
  const [mode, setMode] = useState('signup');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a specific mode in URL params or state
    const urlParams = new URLSearchParams(location.search);
    const urlMode = urlParams.get('mode');
    const stateMode = location.state?.mode;
    
    if (urlMode === 'login' || stateMode === 'login') {
      setMode('login');
    } else if (urlMode === 'signup' || stateMode === 'signup') {
      setMode('signup');
    }
  }, [location]);

  const handleModeSwitch = () => {
    setMode(mode === 'signup' ? 'login' : 'signup');
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`${mode} successful:`, formData);
      
      // Simulate successful authentication
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: formData.name || 'Quiz Learner',
        email: formData.email,
        joinDate: new Date().toISOString(),
        quizzesTaken: 0,
        totalScore: 0
      }));

      // Redirect to intended destination or home
      const redirectTo = location.state?.from || '/home-quiz-generation';
      navigate(redirectTo, { 
        replace: true,
        state: { 
          message: mode === 'signup' ? 'Welcome to Think Stack!' : 'Welcome back!',
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`${provider} authentication successful`);
      
      // Simulate successful social auth
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        joinDate: new Date().toISOString(),
        quizzesTaken: 0,
        totalScore: 0,
        provider: provider
      }));

      // Redirect to intended destination or home
      const redirectTo = location.state?.from || '/home-quiz-generation';
      navigate(redirectTo, { 
        replace: true,
        state: { 
          message: `Welcome! Signed in with ${provider}`,
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      
      <div className="pt-16 min-h-screen flex">
        {/* Left Side - Benefits (Desktop Only) */}
        <AuthBenefits mode={mode} />
        
        {/* Right Side - Authentication Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            <AuthForm
              mode={mode}
              onModeSwitch={handleModeSwitch}
              onSubmit={handleSubmit}
              onSocialAuth={handleSocialAuth}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Mobile Benefits Section */}
      <div className="lg:hidden bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-foreground font-inter text-center mb-6">
            Why Choose Think Stack?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-background/80 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="BookOpen" size={16} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Personalized Learning</h3>
                <p className="text-xs text-muted-foreground">Tailored to your level</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-background/80 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="TrendingUp" size={16} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Track Progress</h3>
                <p className="text-xs text-muted-foreground">Monitor improvement</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-background/80 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Trophy" size={16} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Earn Achievements</h3>
                <p className="text-xs text-muted-foreground">Unlock badges</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-background/80 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Users" size={16} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">Join Community</h3>
                <p className="text-xs text-muted-foreground">Connect with learners</p>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-primary font-mono">50K+</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary font-mono">1M+</div>
              <div className="text-xs text-muted-foreground">Quizzes</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary font-mono">95%</div>
              <div className="text-xs text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthentication;