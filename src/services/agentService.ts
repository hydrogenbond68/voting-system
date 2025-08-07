import { AgentActivity } from '../types';

class AgentService {
  private activities: AgentActivity[] = [];

  constructor() {
    this.initializeMockActivities();
  }

  private initializeMockActivities(): void {
    const mockActivities: AgentActivity[] = [
      {
        id: 'act_001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'ec_001',
        userRole: 'voter',
        action: 'LOGIN',
        details: 'User logged in via e-Citizen',
        ipAddress: '192.168.1.100',
        location: 'Nairobi, Kenya'
      },
      {
        id: 'act_002',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        userId: 'ec_001',
        userRole: 'voter',
        action: 'VOTE_CAST',
        details: 'Vote cast for Presidential Election',
        ipAddress: '192.168.1.100',
        location: 'Nairobi, Kenya',
        electionId: 'election_2027_presidential',
        candidateId: 'candidate_1'
      },
      {
        id: 'act_003',
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        userId: 'admin_001',
        userRole: 'admin',
        action: 'ADMIN_ACCESS',
        details: 'Admin accessed dashboard',
        ipAddress: '10.0.0.50',
        location: 'IEBC Headquarters'
      },
      {
        id: 'act_004',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: 'ec_002',
        userRole: 'voter',
        action: 'LOGIN_FAILED',
        details: 'Failed login attempt - invalid credentials',
        ipAddress: '192.168.1.200',
        location: 'Mombasa, Kenya'
      },
      {
        id: 'act_005',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        userId: 'agent_001',
        userRole: 'agent',
        action: 'MONITORING',
        details: 'Agent accessed monitoring dashboard',
        ipAddress: '10.0.0.75',
        location: 'IEBC Regional Office'
      }
    ];

    this.activities = mockActivities;
  }

  logActivity(activity: Omit<AgentActivity, 'id' | 'timestamp'>): void {
    const newActivity: AgentActivity = {
      ...activity,
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString()
    };
    
    this.activities.unshift(newActivity);
    
    // Keep only last 1000 activities
    if (this.activities.length > 1000) {
      this.activities = this.activities.slice(0, 1000);
    }
  }

  getRecentActivities(limit: number = 50): AgentActivity[] {
    return this.activities.slice(0, limit);
  }

  getActivitiesByUser(userId: string, limit: number = 20): AgentActivity[] {
    return this.activities
      .filter(activity => activity.userId === userId)
      .slice(0, limit);
  }

  getActivitiesByAction(action: string, limit: number = 20): AgentActivity[] {
    return this.activities
      .filter(activity => activity.action === action)
      .slice(0, limit);
  }

  getActivitiesInTimeRange(startTime: string, endTime: string): AgentActivity[] {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    return this.activities.filter(activity => {
      const activityTime = new Date(activity.timestamp);
      return activityTime >= start && activityTime <= end;
    });
  }

  getActivityStats() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const recent24h = this.activities.filter(a => new Date(a.timestamp) >= last24Hours);
    const recentHour = this.activities.filter(a => new Date(a.timestamp) >= lastHour);

    const actionCounts: { [action: string]: number } = {};
    recent24h.forEach(activity => {
      actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
    });

    return {
      totalActivities: this.activities.length,
      activitiesLast24h: recent24h.length,
      activitiesLastHour: recentHour.length,
      actionBreakdown: actionCounts,
      uniqueUsers: new Set(recent24h.map(a => a.userId)).size
    };
  }
}

export const agentService = new AgentService();