import { Election, Vote, Candidate } from '../types';
import { authService } from './authService';

class VotingService {
  private elections = new Map<string, Election>();
  private votes = new Map<string, Vote>();
  private userVotes = new Map<string, Set<string>>(); // userId -> Set of electionIds

  constructor() {
    this.initializeMockElections();
  }

  private initializeMockElections(): void {
    const mockElection: Election = {
      id: 'election_2024_presidential',
      title: '2024 Presidential Election',
      description: 'National Presidential Election for the term 2024-2028',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'candidate_1',
          name: 'Sarah Johnson',
          party: 'Progressive Party',
          position: 'President',
          biography: 'Former Governor with 15 years of public service experience.',
          imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Building a sustainable future through innovation and inclusive policies.'
        },
        {
          id: 'candidate_2',
          name: 'Michael Chen',
          party: 'Unity Alliance',
          position: 'President',
          biography: 'Business leader and former diplomat with international experience.',
          imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Strengthening democracy through transparency and economic growth.'
        },
        {
          id: 'candidate_3',
          name: 'Dr. Elena Rodriguez',
          party: 'Green Future',
          position: 'President',
          biography: 'Environmental scientist and policy expert.',
          imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Climate action and social justice for all citizens.'
        }
      ]
    };

    this.elections.set(mockElection.id, mockElection);
  }

  async castVote(
    sessionToken: string,
    electionId: string,
    candidateId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify session
      const sessionVerification = await authService.verifySession(sessionToken);
      if (!sessionVerification.valid || !sessionVerification.userId) {
        return { success: false, error: 'Invalid session' };
      }

      const userId = sessionVerification.userId;
      const election = this.elections.get(electionId);

      if (!election) {
        return { success: false, error: 'Election not found' };
      }

      if (election.status !== 'active') {
        return { success: false, error: 'Election is not active' };
      }

      // Check if user already voted in this election
      const userElectionVotes = this.userVotes.get(userId) || new Set();
      if (userElectionVotes.has(electionId)) {
        return { success: false, error: 'You have already voted in this election' };
      }

      // Verify candidate exists
      const candidate = election.candidates.find(c => c.id === candidateId);
      if (!candidate) {
        return { success: false, error: 'Invalid candidate' };
      }

      // Create vote record
      const voteId = this.generateVoteId();
      const vote: Vote = {
        id: voteId,
        electionId,
        voterId: userId,
        candidateId,
        timestamp: new Date().toISOString(),
        biometricVerified: true,
        faceVerified: true,
        ipAddress: '127.0.0.1', // In production, get real IP
        deviceFingerprint: this.generateDeviceFingerprint()
      };

      // Store vote
      this.votes.set(voteId, vote);
      
      // Update user votes tracking
      userElectionVotes.add(electionId);
      this.userVotes.set(userId, userElectionVotes);

      // Update election total votes
      election.totalVotes++;
      this.elections.set(electionId, election);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cast vote' };
    }
  }

  getActiveElections(): Election[] {
    return Array.from(this.elections.values()).filter(e => e.status === 'active');
  }

  getElectionById(electionId: string): Election | undefined {
    return this.elections.get(electionId);
  }

  async getElectionResults(electionId: string): Promise<{ candidateId: string; votes: number; percentage: number }[]> {
    const election = this.elections.get(electionId);
    if (!election) return [];

    const voteCounts = new Map<string, number>();
    
    // Count votes for each candidate
    Array.from(this.votes.values())
      .filter(vote => vote.electionId === electionId)
      .forEach(vote => {
        const currentCount = voteCounts.get(vote.candidateId) || 0;
        voteCounts.set(vote.candidateId, currentCount + 1);
      });

    const totalVotes = election.totalVotes;
    
    return election.candidates.map(candidate => ({
      candidateId: candidate.id,
      votes: voteCounts.get(candidate.id) || 0,
      percentage: totalVotes > 0 ? ((voteCounts.get(candidate.id) || 0) / totalVotes) * 100 : 0
    }));
  }

  async hasUserVoted(sessionToken: string, electionId: string): Promise<boolean> {
    const sessionVerification = await authService.verifySession(sessionToken);
    if (!sessionVerification.valid || !sessionVerification.userId) {
      return false;
    }

    const userElectionVotes = this.userVotes.get(sessionVerification.userId) || new Set();
    return userElectionVotes.has(electionId);
  }

  private generateVoteId(): string {
    return 'vote_' + Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
  }

  private generateDeviceFingerprint(): string {
    // In production, this would generate a proper device fingerprint
    return 'device_' + Math.random().toString(36).substr(2, 16);
  }
}

export const votingService = new VotingService();