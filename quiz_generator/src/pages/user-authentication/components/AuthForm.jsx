import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuthForm = ({ 
  mode, 
  onModeSwitch, 
  onSubmit, 
  isLoading,
  onSocialAuth 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Sign up specific validations
    if (mode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock credentials validation for login
    if (mode === 'login') {
      const validCredentials = [
        { email: 'student@quizgen.com', password: 'student123' },
        { email: 'teacher@quizgen.com', password: 'teacher456' },
        { email: 'admin@quizgen.com', password: 'admin789' }
      ];

      const isValid = validCredentials.some(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (!isValid) {
        setErrors({
          email: 'Invalid email or password. Try: student@quizgen.com / student123'
        });
        return;
      }
    }

    onSubmit(formData);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: 'Very Weak', color: 'bg-error' },
      { label: 'Weak', color: 'bg-error' },
      { label: 'Fair', color: 'bg-warning' },
      { label: 'Good', color: 'bg-warning' },
      { label: 'Strong', color: 'bg-success' }
    ];

    return { strength, ...levels[Math.min(strength, 4)] };
  };

  const passwordStrength = mode === 'signup' ? getPasswordStrength(formData.password) : null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground font-inter mb-2">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'signup' ?'Join thousands of learners and start your quiz journey today' :'Sign in to continue your learning adventure'
          }
        </p>
      </div>

      {/* Social Authentication */}
      <div className="space-y-3 mb-6">
        <Button
          variant="outline"
          fullWidth
          onClick={() => onSocialAuth('Google')}
          disabled={isLoading}
          iconName="Chrome"
          iconPosition="left"
          className="quiz-scale-hover"
        >
          Continue with Google
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={() => onSocialAuth('GitHub')}
          disabled={isLoading}
          iconName="Github"
          iconPosition="left"
          className="quiz-scale-hover"
        >
          Continue with GitHub
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'signup' && (
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            error={errors.name}
            required
            disabled={isLoading}
          />
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          error={errors.email}
          required
          disabled={isLoading}
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200 quiz-focus-ring rounded"
              disabled={isLoading}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          {/* Password Strength Meter */}
          {mode === 'signup' && formData.password && passwordStrength && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength.strength >= 3 ? 'text-success' : 
                  passwordStrength.strength >= 2 ? 'text-warning' : 'text-error'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < passwordStrength.strength ? passwordStrength.color : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {mode === 'signup' && (
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200 quiz-focus-ring rounded"
              disabled={isLoading}
            >
              <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0 quiz-focus-ring"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 quiz-focus-ring rounded px-1 py-1"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          className="quiz-scale-hover"
        >
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      {/* Mode Switch */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={onModeSwitch}
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 quiz-focus-ring rounded px-1 py-1"
            disabled={isLoading}
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      {/* Trust Signals */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={14} />
            <span>Privacy Protected</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          By continuing, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;