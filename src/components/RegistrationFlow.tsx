import React, { useState } from 'react';
import { User, Shield, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { BiometricCapture } from './BiometricCapture';
import { authService } from '../services/authService';
import { BiometricData } from '../types';

interface RegistrationFlowProps {
  onRegistrationSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ 
  onRegistrationSuccess, 
  onSwitchToLogin 
}) => {
  const [step, setStep] = useState<'form' | 'biometric' | 'success'>('form');
  const [formData, setFormData] = useState({
    nationalId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(value => value.trim())) {
      setError('');
      setStep('biometric');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBiometricCapture = async (biometricData: BiometricData) => {
    setIsRegistering(true);
    setError('');

    try {
      const userData = {
        ...formData,
        biometricHash: 'hash_' + Date.now(), // In production, this would be a proper hash
        faceEmbedding: biometricData.faceEmbedding
      };

      const result = await authService.registerUser(userData);
      
      if (result.success && result.userId) {
        // Auto-verify the user for demo purposes
        await authService.verifyUser(result.userId);
        setStep('success');
        setTimeout(() => {
          onRegistrationSuccess();
        }, 3000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration process failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleBiometricError = (error: string) => {
    setError(error);
  };

  const resetFlow = () => {
    setStep('form');
    setError('');
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-400 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-purple-400 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-green-400 animate-bounce"></div>
      </div>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center neon-glow animate-pulse">
              <UserPlus className="w-8 h-8 text-black" />
            </div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-400 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
          </div>
          <h1 className="text-3xl font-bold text-cyan-400 neon-text mb-2 font-mono tracking-wider">NEURAL REGISTRATION</h1>
          <p className="text-cyan-300 font-mono">Initialize biometric profile for quantum voting access</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step === 'form' ? 'text-cyan-400' : 'text-cyan-400'}`}>
            <div className={`w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center relative ${
              step === 'form' ? 'neon-glow' : 'neon-glow'
            }`}>
              {step === 'form' ? <span className="text-black font-bold">1</span> : <CheckCircle className="w-5 h-5 text-black" />}
              <div className="absolute inset-0 w-8 h-8 border border-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <span className="ml-2 text-sm font-medium font-mono">DATA INPUT</span>
          </div>
          
          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 mx-4 animate-pulse"></div>
          
          <div className={`flex items-center ${
            step === 'biometric' ? 'text-cyan-400' : 
            step === 'success' ? 'text-green-400' : 'text-gray-500'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${
              step === 'biometric' ? 'bg-gradient-to-br from-cyan-400 to-blue-600 neon-glow' :
              step === 'success' ? 'bg-gradient-to-br from-green-400 to-emerald-600 neon-glow-green' : 'bg-gray-600'
            }`}>
              {step === 'success' ? <CheckCircle className="w-5 h-5 text-black" /> : <span className="text-black font-bold">2</span>}
              {(step === 'biometric' || step === 'success') && (
                <div className="absolute inset-0 w-8 h-8 border border-cyan-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="ml-2 text-sm font-medium font-mono">NEURAL SCAN</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="cyber-panel border-red-400 neon-glow-purple p-4 mb-6 flex items-center space-x-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse"></div>
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-red-400 text-sm font-mono">ERROR: {error}</p>
              <button
                onClick={resetFlow}
                className="text-red-300 hover:text-red-100 text-sm underline mt-1 font-mono"
              >
                RETRY SEQUENCE
              </button>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {step === 'form' && (
          <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-cyan-400 mx-auto mb-3 neon-glow animate-pulse" />
              <h2 className="text-xl font-semibold text-cyan-400 neon-text font-mono">IDENTITY MATRIX</h2>
              <p className="text-cyan-300 text-sm mt-1 font-mono">All parameters required for neural mapping</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                    FIRST.NAME
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="cyber-input w-full"
                    placeholder="JOHN"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                    LAST.NAME
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="cyber-input w-full"
                    placeholder="DOE"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                  NEURAL.ID
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange('nationalId', e.target.value)}
                  className="cyber-input w-full"
                  placeholder="ID123456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                  COMM.LINK
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="cyber-input w-full"
                  placeholder="john.doe@neural.net"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                  SIGNAL.CODE
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="cyber-input w-full"
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                  BIRTH.DATE
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="cyber-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-1 font-mono">
                  LOCATION.DATA
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="cyber-input w-full"
                  placeholder="123 CYBER ST, NEO CITY, SECTOR 7"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full holo-button py-3 font-medium transition-all duration-300 relative overflow-hidden"
              >
                INITIATE NEURAL SCAN
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-cyan-300 font-mono">
                Neural profile exists?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-cyan-400 hover:text-cyan-200 font-medium neon-text"
                >
                  ACCESS SYSTEM
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Biometric Registration */}
        {step === 'biometric' && (
          <div>
            <BiometricCapture
              onCapture={handleBiometricCapture}
              onError={handleBiometricError}
            />
            
            {isRegistering && (
              <div className="mt-4 cyber-panel border-green-400 neon-glow-green p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
                <div className="cyber-loading mx-auto mb-2"></div>
                <p className="text-green-400 text-sm font-mono">ENCODING NEURAL PATTERNS...</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={resetFlow}
                className="text-cyan-400 hover:text-cyan-200 text-sm underline font-mono"
              >
                RETURN TO DATA INPUT
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="cyber-panel neon-glow-green p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 neon-glow-green animate-pulse" />
            <h2 className="text-2xl font-semibold text-green-400 neon-text-green mb-2 font-mono">NEURAL PROFILE CREATED!</h2>
            <p className="text-green-300 mb-4 font-mono">
              Biometric matrix encoded • Quantum verification complete • System access granted
            </p>
            <div className="cyber-loading mx-auto" style={{borderTopColor: '#4ade80'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};