import React, { useState } from 'react';
import { Shield, Eye, EyeOff, User, Lock, Info, Globe } from 'lucide-react';
import { eCitizenService } from '../services/eCitizenService';

interface ECitizenLoginProps {
  onAuthSuccess: (token: string, userRole: string) => void;
}

export const ECitizenLogin: React.FC<ECitizenLoginProps> = ({ onAuthSuccess }) => {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const testAccounts = eCitizenService.getTestCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await eCitizenService.authenticateECitizen(nationalId, password);
      if (result.success && result.sessionToken && result.userRole) {
        onAuthSuccess(result.sessionToken, result.userRole);
      } else {
        setError(result.error || 'e-Citizen authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestAccount = (account: typeof testAccounts[0]) => {
    setNationalId(account.nationalId);
    setPassword(account.password);
    setShowTestAccounts(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-purple-400 rotate-12 animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 border border-green-400 rotate-45 animate-spin" style={{animationDuration: '10s'}}></div>
      </div>

      <div className="cyber-panel p-8 max-w-md mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center neon-glow">
              <Globe className="w-8 h-8 text-black" />
            </div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-green-400 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
          </div>
          <h2 className="text-3xl font-bold text-cyan-400 neon-text font-mono tracking-wider mb-2">
            e-CITIZEN PORTAL
          </h2>
          <p className="text-cyan-300 text-sm font-mono">
            SECURE GOVERNMENT AUTHENTICATION • QUANTUM ENCRYPTED
          </p>
          <div className="mt-2 flex justify-center items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow-green"></div>
            <span className="text-green-400 font-mono">CONNECTED TO GOK SERVERS</span>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500/10 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 font-mono text-sm"
          >
            <Info className="w-4 h-4" />
            <span>{showTestAccounts ? 'Hide' : 'Show'} Demo Accounts</span>
          </button>
          
          {showTestAccounts && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {testAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillTestAccount(account)}
                  className="w-full text-left p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-cyan-400 hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-cyan-400 font-mono text-sm font-semibold">{account.name}</div>
                      <div className="text-gray-400 font-mono text-xs">ID: {account.nationalId}</div>
                      <div className="text-gray-400 font-mono text-xs">Password: {account.password}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-mono border rounded ${
                      account.role === 'Admin' ? 'border-red-400 text-red-400 bg-red-900/20' :
                      account.role === 'Agent' ? 'border-orange-400 text-orange-400 bg-orange-900/20' :
                      'border-green-400 text-green-400 bg-green-900/20'
                    }`}>
                      {account.role.toUpperCase()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* National ID Input */}
          <div className="space-y-2">
            <label className="block text-cyan-400 text-sm font-mono tracking-wide">
              NATIONAL ID NUMBER
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-cyan-400 rounded-lg text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all duration-300"
                placeholder="Enter your National ID"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-cyan-400 text-sm font-mono tracking-wide">
              e-CITIZEN PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-black/50 border border-cyan-400 rounded-lg text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all duration-300"
                placeholder="Enter your e-Citizen password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-400 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full holo-button py-3 px-6 font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-gradient-to-r from-green-600/30 to-blue-600/30 border-green-400 text-green-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                <span>AUTHENTICATING WITH e-CITIZEN...</span>
              </div>
            ) : (
              'LOGIN VIA e-CITIZEN'
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center space-x-4 text-xs font-mono">
            <span className="text-green-400">● SECURE SSL</span>
            <span className="text-blue-400">● GOK VERIFIED</span>
            <span className="text-purple-400">● ENCRYPTED</span>
          </div>
          <p className="text-cyan-300 text-xs font-mono">
            Powered by Government of Kenya e-Citizen Platform
          </p>
        </div>
      </div>
    </div>
  );
};