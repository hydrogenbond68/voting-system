import React, { useState } from 'react';
import { User, Shield, CheckCircle, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthenticationFlowProps {
  onAuthSuccess: (sessionToken: string) => void;
  onSwitchToRegister: () => void;
}

export const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({ 
  onAuthSuccess, 
  onSwitchToRegister 
}) => {
  const [step, setStep] = useState<'login' | 'success'>('login');
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.trim() && password.trim()) {
      setError('');
      setIsAuthenticating(true);

      try {
        const result = await authService.authenticateWithCredentials(nationalId, password);
        
        if (result.success && result.sessionToken) {
          setStep('success');
          setTimeout(() => {
            onAuthSuccess(result.sessionToken);
          }, 2000);
        } else {
          setError(result.error || 'Authentication failed');
        }
      } catch (error) {
        setError('Authentication process failed');
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      setError('Please enter both ID and password');
    }
  };

  const handleTestAccountSelect = (testAccount: { nationalId: string; password: string; name: string }) => {
    setNationalId(testAccount.nationalId);
    setPassword(testAccount.password);
    setShowTestAccounts(false);
  };

  const resetFlow = () => {
    setStep('login');
    setNationalId('');
    setPassword('');
    setError('');
    setIsAuthenticating(false);
    setShowTestAccounts(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-10 w-48 h-48 border border-blue-400 rotate-45 animate-spin" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 border border-purple-400 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-cyan-400 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center neon-glow animate-pulse">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-blue-400 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
          </div>
          <h1 className="text-3xl font-bold text-blue-400 neon-text mb-2 font-mono tracking-wider">QUANTUM ACCESS PORTAL</h1>
          <p className="text-blue-300 font-mono">Secure credential authentication required</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="cyber-panel border-red-400 neon-glow-purple p-4 mb-6 flex items-center space-x-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse"></div>
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-red-400 text-sm font-mono">ACCESS DENIED: {error}</p>
              <button
                onClick={resetFlow}
                className="text-red-300 hover:text-red-100 text-sm underline mt-1 font-mono"
              >
                RETRY ACCESS
              </button>
            </div>
          </div>
        )}

        {/* Login Step */}
        {step === 'login' && (
          <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-blue-400 mx-auto mb-3 neon-glow animate-pulse" />
              <h2 className="text-xl font-semibold text-blue-400 neon-text font-mono">SECURE ACCESS PORTAL</h2>
              <p className="text-blue-300 text-sm mt-1 font-mono">Enter your credentials to access the voting system</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label htmlFor="nationalId" className="block text-sm font-medium text-blue-400 mb-2 font-mono">
                  NATIONAL ID
                </label>
                <input
                  type="text"
                  id="nationalId"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="cyber-input w-full px-4 py-3"
                  placeholder="Enter your National ID"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-blue-400 mb-2 font-mono">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-input w-full px-4 py-3 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full holo-button py-3 font-medium transition-all duration-300 disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="cyber-loading"></div>
                    <span>AUTHENTICATING...</span>
                  </div>
                ) : (
                  'ACCESS VOTING SYSTEM'
                )}
              </button>
            </form>

            {/* Test Accounts Section */}
            <div className="mt-6">
              <button
                onClick={() => setShowTestAccounts(!showTestAccounts)}
                className="w-full text-sm text-blue-400 hover:text-blue-300 font-mono border border-blue-400/30 py-2 px-4 hover:bg-blue-900/20 transition-all"
              >
                {showTestAccounts ? 'HIDE TEST ACCOUNTS' : 'SHOW TEST ACCOUNTS'}
              </button>
              
              {showTestAccounts && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-blue-300 font-mono mb-3">Click any account to auto-fill credentials:</p>
                  {authService.getTestCredentials().map((account, index) => (
                    <button
                      key={index}
                      onClick={() => handleTestAccountSelect(account)}
                      className="w-full text-left p-3 border border-blue-400/30 hover:border-blue-400 hover:bg-blue-900/20 transition-all text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-blue-400 font-mono font-semibold">{account.name}</div>
                          <div className="text-blue-300 font-mono text-xs">ID: {account.nationalId}</div>
                        </div>
                        <div className="text-blue-300 font-mono text-xs">
                          Pass: {account.password}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-300 font-mono">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-blue-400 hover:text-blue-200 font-medium neon-text"
                >
                  REGISTER HERE
                </button>
              </p>
            </div>

            <div className="mt-6 text-xs text-blue-300 text-center font-mono">
              <p>• Credentials securely encrypted</p>
              <p>• Single vote protocol enforced</p>
              <p>• Session timeout: 24 hours</p>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="cyber-panel neon-glow-green p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 neon-glow-green animate-pulse" />
            <h2 className="text-2xl font-semibold text-green-400 neon-text-green mb-2 font-mono">ACCESS GRANTED!</h2>
            <p className="text-green-300 mb-4 font-mono">Authentication successful • Initializing voting system...</p>
            <div className="cyber-loading mx-auto" style={{borderTopColor: '#4ade80'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};