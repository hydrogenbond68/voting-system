import React, { useState } from 'react';
import '../styles/cyberpunk.css';

const EnhancedAuthenticationFlow: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    biometric: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-dark">
      <div className="glass-card rounded-lg p-8 w-full max-w-md hover-lift">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-2 neon-flicker">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h1>
          <p className="text-gray-400 font-rajdhani text-lg">
            {isLogin ? 'Welcome back, agent' : 'Join the cyber network'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="cyber-form-group">
            <label className="cyber-form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="cyber-form-input rounded-md"
              placeholder="agent@cyber.net"
              required
            />
          </div>

          <div className="cyber-form-group">
            <label className="cyber-form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="cyber-form-input rounded-md"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="cyber-form-group">
              <label className="cyber-form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="cyber-form-input rounded-md"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="biometric"
                checked={formData.biometric}
                onChange={handleInputChange}
                className="w-4 h-4 text-neon-blue bg-cyber-gray border-neon-blue rounded focus:ring-neon-blue"
              />
              <span className="text-sm text-gray-300 font-rajdhani">
                Enable biometric authentication
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full cyber-button-3d rounded-md py-3 px-4 font-orbitron font-semibold text-neon-blue hover:text-neon-green transition-all duration-300 energy-pulse"
          >
            {isLogin ? 'ACCESS GRANTED' : 'INITIATE PROTOCOL'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-neon-blue hover:text-neon-green transition-colors duration-300 font-rajdhani hover-lift"
          >
            {isLogin 
              ? 'Need an account? Register here' 
              : 'Already have an account? Login here'
            }
          </button>
        </div>

        <div className="mt-4 flex justify-center items-center space-x-2">
          <div className="status-indicator status-online"></div>
          <span className="text-xs text-gray-400 font-rajdhani">System Online</span>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-blue"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon-blue"></div>
      </div>
    </div>
  );
};

export default EnhancedAuthenticationFlow;
