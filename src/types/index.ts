export interface User {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  isVerified: boolean;
  biometricHash: string;
  faceEmbedding: number[];
  registrationDate: string;
  lastLogin?: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  biography: string;
  imageUrl: string;
  manifesto: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
  totalVotes: number;
}

export interface Vote {
  id: string;
  electionId: string;
  voterId: string;
  candidateId: string;
  timestamp: string;
  biometricVerified: boolean;
  faceVerified: boolean;
  ipAddress: string;
  deviceFingerprint: string;
}

export interface BiometricData {
  faceEmbedding: number[];
  confidence: number;
  liveness: boolean;
}

export interface AuthSession {
  userId: string;
  sessionToken: string;
  expiresAt: string;
  biometricVerified: boolean;
  faceVerified: boolean;
}        