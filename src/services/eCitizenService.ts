import { ECitizenUser, AuthSession } from '../types';

class ECitizenService {
  private eCitizenUsers = new Map<string, ECitizenUser>();
  private sessions = new Map<string, AuthSession>();

  constructor() {
    this.initializeECitizenUsers();
  }

  private initializeECitizenUsers(): void {
    const testUsers: ECitizenUser[] = [
      {
        id: 'ec_001',
        nationalId: '12345678',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ecitizen.go.ke',
        phoneNumber: '+254712345678',
        dateOfBirth: '1990-01-15',
        county: 'Nairobi',
        constituency: 'Westlands',
        ward: 'Kilimani',
        isActive: true,
        registrationDate: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'ec_002',
        nationalId: '87654321',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@ecitizen.go.ke',
        phoneNumber: '+254787654321',
        dateOfBirth: '1985-05-20',
        county: 'Nairobi',
        constituency: 'Westlands',
        ward: 'Parklands',
        isActive: true,
        registrationDate: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 'admin_001',
        nationalId: '11111111',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@iebc.go.ke',
        phoneNumber: '+254700000001',
        dateOfBirth: '1980-01-01',
        county: 'Nairobi',
        constituency: 'Nairobi Central',
        ward: 'Central',
        isActive: true,
        registrationDate: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'agent_001',
        nationalId: '22222222',
        firstName: 'Agent',
        lastName: 'Monitor',
        email: 'agent@iebc.go.ke',
        phoneNumber: '+254700000002',
        dateOfBirth: '1985-01-01',
        county: 'Nairobi',
        constituency: 'Nairobi Central',
        ward: 'Central',
        isActive: true,
        registrationDate: '2024-01-01T00:00:00.000Z'
      }
    ];

    testUsers.forEach(user => {
      this.eCitizenUsers.set(user.nationalId, user);
    });
  }

  async authenticateECitizen(
    nationalId: string,
    password: string
  ): Promise<{ success: boolean; sessionToken?: string; userRole?: string; error?: string }> {
    try {
      // Simulate e-Citizen authentication
      const user = this.eCitizenUsers.get(nationalId);
      
      if (!user) {
        return { success: false, error: 'e-Citizen account not found' };
      }

      if (!user.isActive) {
        return { success: false, error: 'e-Citizen account is inactive' };
      }

      // Simple password validation for demo
      const validPasswords: { [key: string]: string } = {
        '12345678': 'voter123',
        '87654321': 'voter456',
        '11111111': 'admin123',
        '22222222': 'agent123'
      };

      if (validPasswords[nationalId] !== password) {
        return { success: false, error: 'Invalid e-Citizen credentials' };
      }

      // Determine user role
      let userRole: 'voter' | 'admin' | 'agent' = 'voter';
      if (nationalId === '11111111') userRole = 'admin';
      else if (nationalId === '22222222') userRole = 'agent';

      // Create session
      const sessionToken = this.generateSessionToken();
      const session: AuthSession = {
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        biometricVerified: true,
        faceVerified: true,
        userRole
      };

      this.sessions.set(sessionToken, session);

      return { success: true, sessionToken, userRole };
    } catch (error) {
      return { success: false, error: 'e-Citizen authentication failed' };
    }
  }

  async verifySession(sessionToken: string): Promise<{ valid: boolean; userId?: string; userRole?: string }> {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return { valid: false };
    }

    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(sessionToken);
      return { valid: false };
    }

    return { valid: true, userId: session.userId, userRole: session.userRole };
  }

  getUserByNationalId(nationalId: string): ECitizenUser | undefined {
    return this.eCitizenUsers.get(nationalId);
  }

  getUserById(userId: string): ECitizenUser | undefined {
    return Array.from(this.eCitizenUsers.values()).find(user => user.id === userId);
  }

  getTestCredentials(): Array<{ nationalId: string; password: string; name: string; role: string }> {
    return [
      { nationalId: '12345678', password: 'voter123', name: 'John Doe', role: 'Voter' },
      { nationalId: '87654321', password: 'voter456', name: 'Jane Smith', role: 'Voter' },
      { nationalId: '11111111', password: 'admin123', name: 'Admin User', role: 'Admin' },
      { nationalId: '22222222', password: 'agent123', name: 'Agent Monitor', role: 'Agent' }
    ];
  }

  private generateSessionToken(): string {
    return 'ec_session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }
}

export const eCitizenService = new ECitizenService();