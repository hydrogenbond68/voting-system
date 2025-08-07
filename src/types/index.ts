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
  userRole: 'voter' | 'admin' | 'agent';
}

export interface ECitizenUser {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  county: string;
  constituency: string;
  ward: string;
  isActive: boolean;
  registrationDate: string;
}

export interface AdminStats {
  totalRegisteredVoters: number;
  totalVotesCast: number;
  turnoutPercentage: number;
  electionsByStatus: {
    active: number;
    completed: number;
    upcoming: number;
  };
  votesByElection: { [electionId: string]: number };
  votesByCounty: { [county: string]: number };
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  location?: string;
  electionId?: string;
  candidateId?: string;
}