import React, { useState } from 'react';
import { User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { BiometricCapture } from './BiometricCapture';
import { authService } from '../services/authService';
import { BiometricData } from '../types';

interface AuthenticationFlowProps {
  onAuthSuccess: (sessionToken: string) => void;
  onSwitchToRegister: () => void;
}

export const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({ 
  onAuthSuccess, 
  onSwitchToRegister 
}) => {
  const [step, setStep] = useState<'login' | 'biometric' | 'success'>('login');
  const [nationalId, setNationalId] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.trim()) {
      setError('');
      setStep('biometric');
    }
  };

  const handleBiometricCapture = async (biometricData: BiometricData) => {
    setIsAuthenticating(true);
    setError('');

    try {
      const result = await authService.authenticateWithBiometrics(nationalId, biometricData);
      
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
  };

  const handleBiometricError = (error: string) => {
    setError(error);
  };

  const resetFlow = () => {
    setStep('login');
    setNationalId('');
    setError('');
    setIsAuthenticating(false);
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
          <p className="text-blue-300 font-mono">Neural authentication protocol required</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step === 'login' ? 'text-blue-400' : 'text-green-400'}`}>
            <div className={`w-8 h-8 bg-gradient-to-br rounded-full flex items-center justify-center relative ${
              step === 'login' ? 'from-blue-400 to-cyan-600 neon-glow' : 'from-green-400 to-emerald-600 neon-glow-green'
            }`}>
              {step === 'login' ? <span className="text-black font-bold">1</span> : <CheckCircle className="w-5 h-5 text-black" />}
              <div className="absolute inset-0 w-8 h-8 border border-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="ml-2 text-sm font-medium font-mono">ID.SCAN</span>
          </div>
          
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-4 animate-pulse"></div>
          
          <div className={`flex items-center ${
            step === 'biometric' ? 'text-blue-400' : 
            step === 'success' ? 'text-green-400' : 'text-gray-500'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${
              step === 'biometric' ? 'bg-gradient-to-br from-blue-400 to-cyan-600 neon-glow' :
              step === 'success' ? 'bg-gradient-to-br from-green-400 to-emerald-600 neon-glow-green' : 'bg-gray-600'
            }`}>
              {step === 'success' ? <CheckCircle className="w-5 h-5 text-black" /> : <span className="text-black font-bold">2</span>}
              {(step === 'biometric' || step === 'success') && (
                <div className="absolute inset-0 w-8 h-8 border border-blue-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="ml-2 text-sm font-medium font-mono">NEURAL.SCAN</span>
          </div>
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
              <User className="w-12 h-12 text-blue-400 mx-auto mb-3 neon-glow animate-pulse" />
              <h2 className="text-xl font-semibold text-blue-400 neon-text font-mono">NEURAL ID REQUIRED</h2>
              <p className="text-blue-300 text-sm mt-1 font-mono">Biometric verification will follow</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-6">
                <label htmlFor="nationalId" className="block text-sm font-medium text-blue-400 mb-2 font-mono">
                  NEURAL.ID.CODE
                </label>
                <input
                  type="text"
                  id="nationalId"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="cyber-input w-full px-4 py-3"
                  placeholder="Enter neural ID sequence"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full holo-button py-3 font-medium transition-all duration-300"
              >
                INITIATE NEURAL SCAN
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-300 font-mono">
                Neural profile not found?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-blue-400 hover:text-blue-200 font-medium neon-text"
                >
                  CREATE PROFILE
                </button>
              </p>
            </div>

            <div className="mt-6 text-xs text-blue-300 text-center font-mono">
              <p>• Neural patterns quantum encrypted</p>
              <p>• Single vote protocol enforced</p>
              <p>• Anonymous blockchain verification</p>
            </div>
          </div>
        )}

        {/* Biometric Step */}
        {step === 'biometric' && (
          <div>
            <BiometricCapture
              onCapture={handleBiometricCapture}
              onError={handleBiometricError}
            />
            
            {isAuthenticating && (
              <div className="mt-4 cyber-panel border-blue-400 neon-glow p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                <div className="cyber-loading mx-auto mb-2"></div>
                <p className="text-blue-400 text-sm font-mono">ANALYZING NEURAL PATTERNS...</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={resetFlow}
                className="text-blue-400 hover:text-blue-200 text-sm underline font-mono"
              >
                RETURN TO ID SCAN
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="cyber-panel neon-glow-green p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 neon-glow-green animate-pulse" />
            <h2 className="text-2xl font-semibold text-green-400 neon-text-green mb-2 font-mono">ACCESS GRANTED!</h2>
            <p className="text-green-300 mb-4 font-mono">Neural verification complete • Quantum portal initializing...</p>
            <div className="cyber-loading mx-auto" style={{borderTopColor: '#4ade80'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};