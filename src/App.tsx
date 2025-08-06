import React from 'react';
import { useState } from 'react';
import { AuthenticationFlow } from './components/AuthenticationFlow';
import { RegistrationFlow } from './components/RegistrationFlow';
import { VotingInterface } from './components/VotingInterface';
import { Shield, LogOut, User } from 'lucide-react';

function App() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'register' | 'login'>('register');
  const [showResults, setShowResults] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = (token: string) => {
    setSessionToken(token);
    setShowAuthModal(false);
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('login');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    setSessionToken(null);
    setShowResults(false);
    setCurrentView('register');
    setShowAuthModal(false);
  };

  const handleVoteComplete = () => {
    setShowResults(true);
  };

  const handleVoteAttempt = () => {
    if (!sessionToken) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Authentication Modal
  const AuthModal = () => {
    if (currentView === 'register') {
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full">
            <button
              onClick={handleCloseAuthModal}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/20 border border-red-400 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors z-10"
            >
              ×
            </button>
            <RegistrationFlow 
              onRegistrationSuccess={handleRegistrationSuccess}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full">
            <button
              onClick={handleCloseAuthModal}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/20 border border-red-400 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors z-10"
            >
              ×
            </button>
            <AuthenticationFlow 
              onAuthSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Animated Circuit Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-purple-400 rotate-12 animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 border border-green-400 rotate-45 animate-spin" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 border border-orange-400 rotate-12 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="cyber-panel border-b-2 border-cyan-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-cyan-400 neon-glow animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 border border-cyan-400 rotate-45 animate-spin" style={{animationDuration: '3s'}}></div>
              </div>
              <h1 className="text-xl font-bold text-cyan-400 neon-text font-mono tracking-wider">
                QUANTUM VOTING SYSTEM
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {sessionToken ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow-green"></div>
                    <span className="font-mono">AUTHENTICATED</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="holo-button px-3 py-2 flex items-center space-x-2 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-mono">LOGOUT</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="holo-button px-3 py-2 flex items-center space-x-2 transition-all duration-300 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400 text-blue-400"
                >
                  <User className="w-4 h-4" />
                  <span className="font-mono">SIGN IN</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {showResults && (
          <div className="mb-6 cyber-panel neon-glow-green p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center neon-glow-green animate-pulse">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-green-400 neon-text-green font-mono tracking-wide">VOTE SUCCESSFULLY CAST!</h3>
                <p className="text-green-300 text-sm font-mono">Vote recorded • Blockchain verified • Identity secured</p>
              </div>
            </div>
          </div>
        )}
        
        <VotingInterface 
          sessionToken={sessionToken} 
          onVoteComplete={handleVoteComplete}
          onVoteAttempt={handleVoteAttempt}
        />
      </main>

      {/* Footer */}
      <footer className="cyber-panel border-t-2 border-cyan-400 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-cyan-400 font-mono">
            <p className="neon-text">SECURE DIGITAL VOTING SYSTEM • CAPACITY: 3M+ USERS</p>
            <p className="mt-1 text-cyan-300">ENCRYPTED AUTHENTICATION • ONE VOTE PER USER • BLOCKCHAIN SECURED</p>
            <div className="mt-2 flex justify-center space-x-4 text-xs">
              <span className="text-green-400">● SYSTEM ONLINE</span>
              <span className="text-blue-400">● SECURE LOGIN</span>
              <span className="text-purple-400">● VOTE VERIFIED</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && <AuthModal />}
    </div>
  );
}

export default App;
