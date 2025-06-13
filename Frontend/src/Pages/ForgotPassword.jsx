import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual password reset logic
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2074")',
        }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          {/* <button 
            onClick={() => navigate('/login')}
            className="mb-6 text-white hover:text-amber-300 transition-colors flex items-center gap-2"
          >
            ← Back to Login
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Reset Password
          </h1>
          <p className="text-xl text-white/90">
            We'll help you get back to your account
          </p> */}
        </div>
      </div>

      <main className="max-w-md mx-auto -mt-20 relative z-20 pb-12 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <KeyRound className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Send Reset Instructions
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                <p className="font-medium">Reset instructions sent!</p>
                <p className="text-sm mt-1">Please check your email for further instructions.</p>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Return to Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="font-medium cursor-pointer text-amber-600 hover:text-amber-500"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center">
              Need help?{' '}
              <button className="font-medium cursor-pointer text-amber-600 hover:text-amber-500">
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;