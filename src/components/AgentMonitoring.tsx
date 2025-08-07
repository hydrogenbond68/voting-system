import React, { useState, useEffect } from 'react';
import { Eye, Activity, Users, AlertTriangle, Filter, Search, Clock, MapPin, User } from 'lucide-react';
import { AgentActivity } from '../types';
import { agentService } from '../services/agentService';

interface AgentMonitoringProps {
  sessionToken: string;
  onLogout: () => void;
}

export const AgentMonitoring: React.FC<AgentMonitoringProps> = ({ sessionToken, onLogout }) => {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AgentActivity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filterAction, setFilterAction] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, filterAction, searchTerm]);

  const loadData = async () => {
    try {
      const recentActivities = agentService.getRecentActivities(100);
      const activityStats = agentService.getActivityStats();
      
      setActivities(recentActivities);
      setStats(activityStats);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (filterAction) {
      filtered = filtered.filter(activity => activity.action === filterAction);
    }

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.ipAddress.includes(searchTerm)
      );
    }

    setFilteredActivities(filtered);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'text-green-400 border-green-400 bg-green-900/20';
      case 'VOTE_CAST': return 'text-blue-400 border-blue-400 bg-blue-900/20';
      case 'LOGIN_FAILED': return 'text-red-400 border-red-400 bg-red-900/20';
      case 'ADMIN_ACCESS': return 'text-purple-400 border-purple-400 bg-purple-900/20';
      case 'MONITORING': return 'text-orange-400 border-orange-400 bg-orange-900/20';
      default: return 'text-cyan-400 border-cyan-400 bg-cyan-900/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="cyber-panel p-8 text-center">
          <div className="cyber-loading mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">INITIALIZING MONITORING SYSTEMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="cyber-panel border-b-2 border-orange-400 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Eye className="w-8 h-8 text-orange-400 neon-glow animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 border border-orange-400 rotate-45 animate-spin" style={{animationDuration: '3s'}}></div>
              </div>
              <h1 className="text-xl font-bold text-orange-400 neon-text font-mono tracking-wider">
                AGENT MONITORING CENTER
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow-green"></div>
                <span className="font-mono">SURVEILLANCE ACTIVE</span>
              </div>
              
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
                <p className="text-cyan-400 text-sm font-mono">TOTAL ACTIVITIES</p>
                <p className="text-3xl font-bold text-cyan-400 neon-text font-mono">
                  {stats?.totalActivities.toLocaleString()}
                </p>
              </div>
              <Activity className="w-12 h-12 text-cyan-400 neon-glow" />
            </div>
          </div>

          <div className="cyber-panel neon-glow-green p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-mono">LAST 24 HOURS</p>
                <p className="text-3xl font-bold text-green-400 neon-text-green font-mono">
                  {stats?.activitiesLast24h}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-400 neon-glow-green" />
            </div>
          </div>

          <div className="cyber-panel neon-glow-purple p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-mono">LAST HOUR</p>
                <p className="text-3xl font-bold text-purple-400 neon-text font-mono">
                  {stats?.activitiesLastHour}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-purple-400 neon-glow-purple" />
            </div>
          </div>

          <div className="cyber-panel border-orange-400 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-mono">UNIQUE USERS</p>
                <p className="text-3xl font-bold text-orange-400 font-mono">
                  {stats?.uniqueUsers}
                </p>
              </div>
              <Users className="w-12 h-12 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="cyber-panel neon-glow p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <h3 className="text-xl font-semibold text-cyan-400 neon-text mb-6 font-mono">SURVEILLANCE FILTERS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-cyan-400 text-sm font-mono">FILTER BY ACTION</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="cyber-input w-full pl-12"
                >
                  <option value="">All Actions</option>
                  <option value="LOGIN">Login</option>
                  <option value="VOTE_CAST">Vote Cast</option>
                  <option value="LOGIN_FAILED">Login Failed</option>
                  <option value="ADMIN_ACCESS">Admin Access</option>
                  <option value="MONITORING">Monitoring</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-cyan-400 text-sm font-mono">SEARCH ACTIVITIES</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="cyber-input w-full pl-12"
                  placeholder="Search by user, details, or IP..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-cyan-400 neon-text font-mono">REAL-TIME ACTIVITY FEED</h3>
            <div className="text-sm text-cyan-300 font-mono">
              Showing {filteredActivities.length} of {activities.length} activities
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-gray-900/50 border border-gray-600 hover:border-cyan-400 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-2 py-1 text-xs font-mono border rounded ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-cyan-300 font-mono">
                        <User className="w-4 h-4" />
                        <span>{activity.userId}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-purple-400">{activity.userRole.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <p className="text-cyan-300 font-mono text-sm mb-2">{activity.details}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location || 'Unknown'}</span>
                      </div>
                      <span>IP: {activity.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Breakdown */}
        <div className="mt-8 cyber-panel neon-glow-green p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
          <h3 className="text-xl font-semibold text-green-400 neon-text-green mb-6 font-mono">ACTION BREAKDOWN (24H)</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats && Object.entries(stats.actionBreakdown).map(([action, count]) => (
              <div key={action} className="cyber-panel border-green-400/50 p-4 text-center">
                <div className={`text-2xl font-bold font-mono ${getActionColor(action).split(' ')[0]}`}>
                  {count as number}
                </div>
                <div className="text-green-300 text-sm font-mono mt-1">{action}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};