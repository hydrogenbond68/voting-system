import { User, AuthSession, BiometricData } from '../types';

class AuthService {
  private sessions = new Map<string, AuthSession>();
  private users = new Map<string, User>();
  private userCredentials = new Map<string, { nationalId: string; password: string }>();

  constructor() {
    this.initializeTestUsers();
  }

  private initializeTestUsers(): void {
    // Create test users with credentials
    const testUsers = [
      {
        id: 'user_001',
        nationalId: '12345678',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+254712345678',
        dateOfBirth: '1990-01-15',
        address: '123 Nairobi Street, Nairobi',
        isVerified: true,
        biometricHash: 'hash_001',
        faceEmbedding: Array.from({ length: 128 }, () => Math.random() * 2 - 1),
        registrationDate: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'user_002',
        nationalId: '87654321',
        password: 'mypassword',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+254787654321',
        dateOfBirth: '1985-05-20',
        address: '456 Mombasa Road, Nairobi',
        isVerified: true,
        biometricHash: 'hash_002',
        faceEmbedding: Array.from({ length: 128 }, () => Math.random() * 2 - 1),
        registrationDate: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 'user_003',
        nationalId: '11223344',
        password: 'secure123',
        firstName: 'Peter',
        lastName: 'Kamau',
        email: 'peter.kamau@example.com',
        phoneNumber: '+254711223344',
        dateOfBirth: '1992-08-10',
        address: '789 Uhuru Highway, Nairobi',
        isVerified: true,
        biometricHash: 'hash_003',
        faceEmbedding: Array.from({ length: 128 }, () => Math.random() * 2 - 1),
        registrationDate: '2024-01-03T00:00:00.000Z'
      },
      {
        id: 'user_004',
        nationalId: '99887766',
        password: 'vote2027',
        firstName: 'Mary',
        lastName: 'Wanjiku',
        email: 'mary.wanjiku@example.com',
        phoneNumber: '+254799887766',
        dateOfBirth: '1988-12-03',
        address: '321 Kenyatta Avenue, Nairobi',
        isVerified: true,
        biometricHash: 'hash_004',
        faceEmbedding: Array.from({ length: 128 }, () => Math.random() * 2 - 1),
        registrationDate: '2024-01-04T00:00:00.000Z'
      },
      {
        id: 'user_005',
        nationalId: '55443322',
        password: 'kenya2027',
        firstName: 'David',
        lastName: 'Ochieng',
        email: 'david.ochieng@example.com',
        phoneNumber: '+254755443322',
        dateOfBirth: '1995-03-25',
        address: '654 Tom Mboya Street, Nairobi',
        isVerified: true,
        biometricHash: 'hash_005',
        faceEmbedding: Array.from({ length: 128 }, () => Math.random() * 2 - 1),
        registrationDate: '2024-01-05T00:00:00.000Z'
      }
    ];

    // Store users and credentials
    testUsers.forEach(userData => {
      const { password, ...userInfo } = userData;
      this.users.set(userData.id, userInfo as User);
      this.userCredentials.set(userData.id, {
        nationalId: userData.nationalId,
        password: password
      });
    });
  }

  async registerUser(userData: Omit<User, 'id' | 'isVerified' | 'registrationDate'>): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = Array.from(this.users.values()).find(
        user => user.nationalId === userData.nationalId || user.email === userData.email
      );

      if (existingUser) {
        return { success: false, error: 'User already registered' };
      }

      const userId = this.generateId();
      const user: User = {
        ...userData,
        id: userId,
        isVerified: false,
        registrationDate: new Date().toISOString()
      };

      this.users.set(userId, user);
      
      return { success: true, userId };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  async authenticateWithCredentials(
    nationalId: string,
    password: string
  ): Promise<{ success: boolean; sessionToken?: string; error?: string }> {
    try {
      // Find user by national ID
      const userEntry = Array.from(this.userCredentials.entries()).find(
        ([_, creds]) => creds.nationalId === nationalId
      );
      
      if (!userEntry) {
        return { success: false, error: 'User not found' };
      }

      const [userId, credentials] = userEntry;
      const user = this.users.get(userId);

      if (!user) {
        return { success: false, error: 'User data not found' };
      }

      if (!user.isVerified) {
        return { success: false, error: 'User not verified' };
      }

      // Verify password
      if (credentials.password !== password) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Create session
      const sessionToken = this.generateSessionToken();
      const session: AuthSession = {
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        biometricVerified: false,
        faceVerified: false
      };

      this.sessions.set(sessionToken, session);

      // Update last login
      user.lastLogin = new Date().toISOString();
      this.users.set(user.id, user);

      return { success: true, sessionToken };
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  async verifySession(sessionToken: string): Promise<{ valid: boolean; userId?: string }> {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return { valid: false };
    }

    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(sessionToken);
      return { valid: false };
    }

    return { valid: true, userId: session.userId };
  }

  async logout(sessionToken: string): Promise<void> {
    this.sessions.delete(sessionToken);
  }

  getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  async verifyUser(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (user) {
      user.isVerified = true;
      this.users.set(userId, user);
      return true;
    }
    return false;
  }

  getTestCredentials(): Array<{ nationalId: string; password: string; name: string }> {
    return [
      { nationalId: '12345678', password: 'password123', name: 'John Doe' },
      { nationalId: '87654321', password: 'mypassword', name: 'Jane Smith' },
      { nationalId: '11223344', password: 'secure123', name: 'Peter Kamau' },
      { nationalId: '99887766', password: 'vote2027', name: 'Mary Wanjiku' },
      { nationalId: '55443322', password: 'kenya2027', name: 'David Ochieng' }
    ];
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateSessionToken(): string {
    return 'session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }
}

export const authService = new AuthService();