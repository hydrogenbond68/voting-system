import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Vote, TrendingUp, Download, RefreshCw, Eye, Calendar, MapPin } from 'lucide-react';
import { AdminStats } from '../types';
import { adminService } from '../services/adminService';

interface AdminDashboardProps {
  sessionToken: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessionToken, onLogout }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const adminStats = await adminService.getAdminStats();
      setStats(adminStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!selectedElection) return;
    
    try {
      const csvData = await adminService.exportElectionData(selectedElection);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `election_${selectedElection}_results.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="cyber-panel p-8 text-center">
          <div className="cyber-loading mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">LOADING ADMIN DASHBOARD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="cyber-panel border-b-2 border-red-400 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BarChart3 className="w-8 h-8 text-red-400 neon-glow animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 border border-red-400 rotate-45 animate-spin" style={{animationDuration: '3s'}}></div>
              </div>
              <h1 className="text-xl font-bold text-red-400 neon-text font-mono tracking-wider">
                ADMIN CONTROL CENTER
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow-green"></div>
                <span className="font-mono">SYSTEM ONLINE</span>
              </div>
              
              <button
                onClick={loadStats}
                className="holo-button px-3 py-2 flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400 text-blue-400"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-mono">REFRESH</span>
              </button>

              <button
                onClick={onLogout}
                className="holo-button px-3 py-2 flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-400 text-red-400"
              >
                <span className="font-mono">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-mono">REGISTERED VOTERS</p>
                <p className="text-3xl font-bold text-cyan-400 neon-text font-mono">
                  {stats?.totalRegisteredVoters.toLocaleString()}
                </p>
              </div>
              <Users className="w-12 h-12 text-cyan-400 neon-glow" />
            </div>
          </div>

          <div className="cyber-panel neon-glow-green p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-mono">VOTES CAST</p>
                <p className="text-3xl font-bold text-green-400 neon-text-green font-mono">
                  {stats?.totalVotesCast.toLocaleString()}
                </p>
              </div>
              <Vote className="w-12 h-12 text-green-400 neon-glow-green" />
            </div>
          </div>

          <div className="cyber-panel neon-glow-purple p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-mono">TURNOUT RATE</p>
                <p className="text-3xl font-bold text-purple-400 neon-text font-mono">
                  {stats?.turnoutPercentage.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-400 neon-glow-purple" />
            </div>
          </div>

          <div className="cyber-panel border-orange-400 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-mono">ACTIVE ELECTIONS</p>
                <p className="text-3xl font-bold text-orange-400 font-mono">
                  {stats?.electionsByStatus.active}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Elections Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <h3 className="text-xl font-semibold text-cyan-400 neon-text mb-6 font-mono">VOTES BY ELECTION</h3>
            <div className="space-y-4">
              {stats && Object.entries(stats.votesByElection).map(([electionId, votes]) => (
                <div key={electionId} className="flex items-center justify-between p-3 bg-gray-900/50 border border-cyan-400/30">
                  <span className="text-cyan-300 font-mono text-sm">
                    {electionId.replace('election_2027_', '').replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-cyan-400 font-mono font-bold">{votes.toLocaleString()}</span>
                    <button
                      onClick={() => setSelectedElection(electionId)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cyber-panel neon-glow-green p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <h3 className="text-xl font-semibold text-green-400 neon-text-green mb-6 font-mono">VOTES BY COUNTY</h3>
            <div className="space-y-4">
              {stats && Object.entries(stats.votesByCounty).map(([county, votes]) => (
                <div key={county} className="flex items-center justify-between p-3 bg-gray-900/50 border border-green-400/30">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-mono text-sm">{county.toUpperCase()}</span>
                  </div>
                  <span className="text-green-400 font-mono font-bold">{votes.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-cyan-400 neon-text font-mono">DATA EXPORT CENTER</h3>
            <div className="text-xs text-cyan-300 font-mono">
              Last Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="cyber-input flex-1 font-mono"
            >
              <option value="">Select Election to Export</option>
              {stats && Object.keys(stats.votesByElection).map(electionId => (
                <option key={electionId} value={electionId}>
                  {electionId.replace('election_2027_', '').replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleExportData}
              disabled={!selectedElection}
              className="holo-button px-6 py-3 flex items-center space-x-2 disabled:opacity-50 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 text-purple-400"
            >
              <Download className="w-5 h-5" />
              <span className="font-mono">EXPORT CSV</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-panel border-green-400 p-4 text-center">
            <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2 animate-pulse neon-glow-green"></div>
            <p className="text-green-400 font-mono text-sm">DATABASE ONLINE</p>
          </div>
          <div className="cyber-panel border-blue-400 p-4 text-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-blue-400 font-mono text-sm">e-CITIZEN CONNECTED</p>
          </div>
          <div className="cyber-panel border-purple-400 p-4 text-center">
            <div className="w-4 h-4 bg-purple-400 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-purple-400 font-mono text-sm">SECURITY ACTIVE</p>
          </div>
        </div>
      </main>
    </div>
  );
};