import { User, AuthSession, BiometricData } from '../types';
import { biometricService } from './biometricService';

class AuthService {
  private sessions = new Map<string, AuthSession>();
  private users = new Map<string, User>();

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

  async authenticateWithBiometrics(
    nationalId: string,
    biometricData: BiometricData
  ): Promise<{ success: boolean; sessionToken?: string; error?: string }> {
    try {
      // Find user by national ID
      const user = Array.from(this.users.values()).find(u => u.nationalId === nationalId);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!user.isVerified) {
        return { success: false, error: 'User not verified' };
      }

      // Verify face match
      const faceVerification = await biometricService.verifyFaceMatch(
        biometricData.faceEmbedding,
        user.faceEmbedding
      );

      if (!faceVerification.match) {
        return { success: false, error: 'Biometric verification failed' };
      }

      if (!biometricData.liveness) {
        return { success: false, error: 'Liveness check failed' };
      }

      // Create session
      const sessionToken = this.generateSessionToken();
      const session: AuthSession = {
        userId: user.id,
        sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        biometricVerified: true,
        faceVerified: true
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

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateSessionToken(): string {
    return 'session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }
}

export const authService = new AuthService();