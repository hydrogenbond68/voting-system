import { Election, Vote, Candidate } from '../types';
//import { authService } from './authService';

class VotingService {
  private elections = new Map<string, Election>();
  private votes = new Map<string, Vote>();
  private userVotes = new Map<string, Set<string>>(); // userId -> Set of electionIds

  constructor() {
    this.initializeMockElections();
  }

  private initializeMockElections(): void {
    // Presidential Election
    const presidentialElection: Election = {
      id: 'election_2027_presidential',
      title: '2027 Presidential Election',
      description: 'National Presidential Election for the term 2027-2032',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'candidate_1',
          name: 'Dr. William Ruto',
          party: 'United Democratic Alliance (UDA)',
          position: 'President',
          biography: 'Current Deputy President with extensive experience in economic policy and agricultural development.',
          imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Bottom-up economic transformation focusing on hustler economy and agricultural modernization.'
        },
        {
          id: 'candidate_2',
          name: 'Raila Odinga',
          party: 'Azimio la Umoja Coalition',
          position: 'President',
          biography: 'Former Prime Minister and veteran opposition leader with decades of political experience.',
          imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Social democratic agenda focusing on universal healthcare, education, and social protection.'
        },
        {
          id: 'candidate_3',
          name: 'George Wajackoyah',
          party: 'Roots Party',
          position: 'President',
          biography: 'Legal scholar and environmental advocate with focus on alternative economic models.',
          imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Revolutionary economic transformation through cannabis legalization and debt forgiveness.'
        }
      ]
    };

    // Governor Election - Nairobi County
    const governorElection: Election = {
      id: 'election_2027_governor_nairobi',
      title: '2027 Nairobi County Governor Election',
      description: 'Election for Nairobi County Governor for the term 2027-2032',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'gov_candidate_1',
          name: 'Johnson Sakaja',
          party: 'United Democratic Alliance (UDA)',
          position: 'Governor - Nairobi County',
          biography: 'Current Nairobi Governor with background in business and youth leadership.',
          imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Urban transformation through digital governance, infrastructure development, and youth empowerment.'
        },
        {
          id: 'gov_candidate_2',
          name: 'Polycarp Igathe',
          party: 'Azimio la Umoja Coalition',
          position: 'Governor - Nairobi County',
          biography: 'Former Deputy Governor and corporate executive with extensive private sector experience.',
          imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Professional management of county resources with focus on service delivery and transparency.'
        }
      ]
    };

    // Senator Election - Nairobi County
    const senatorElection: Election = {
      id: 'election_2027_senator_nairobi',
      title: '2027 Nairobi County Senator Election',
      description: 'Election for Nairobi County Senator for the term 2027-2032',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'sen_candidate_1',
          name: 'Edwin Sifuna',
          party: 'Orange Democratic Movement (ODM)',
          position: 'Senator - Nairobi County',
          biography: 'Current Nairobi Senator and ODM Secretary General with strong legislative record.',
          imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Strengthening devolution and protecting county interests at the national level.'
        },
        {
          id: 'sen_candidate_2',
          name: 'Margaret Wanjiru',
          party: 'United Democratic Alliance (UDA)',
          position: 'Senator - Nairobi County',
          biography: 'Former MP and religious leader with focus on social justice and women empowerment.',
          imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Championing women and youth rights while promoting economic empowerment programs.'
        }
      ]
    };

    // MP Election - Westlands Constituency
    const mpElection: Election = {
      id: 'election_2027_mp_westlands',
      title: '2027 Westlands Constituency MP Election',
      description: 'Election for Member of Parliament - Westlands Constituency for the term 2027-2032',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'mp_candidate_1',
          name: 'Tim Wanyonyi',
          party: 'Orange Democratic Movement (ODM)',
          position: 'Member of Parliament - Westlands',
          biography: 'Current Westlands MP with strong track record in constituency development.',
          imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Continued infrastructure development and improved healthcare services for Westlands residents.'
        },
        {
          id: 'mp_candidate_2',
          name: 'Nelson Havi',
          party: 'United Democratic Alliance (UDA)',
          position: 'Member of Parliament - Westlands',
          biography: 'Former Law Society of Kenya President and constitutional lawyer.',
          imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Legal reforms and enhanced business environment for economic growth in Westlands.'
        }
      ]
    };

    // Woman Representative Election - Nairobi County
    const womanRepElection: Election = {
      id: 'election_2027_woman_rep_nairobi',
      title: '2027 Nairobi County Woman Representative Election',
      description: 'Election for Woman Representative - Nairobi County for the term 2027-2032',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'wr_candidate_1',
          name: 'Esther Passaris',
          party: 'Orange Democratic Movement (ODM)',
          position: 'Woman Representative - Nairobi County',
          biography: 'Current Nairobi Woman Rep with focus on women and youth empowerment programs.',
          imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Advancing gender equality and economic empowerment for women and youth in Nairobi.'
        },
        {
          id: 'wr_candidate_2',
          name: 'Millicent Omanga',
          party: 'United Democratic Alliance (UDA)',
          position: 'Woman Representative - Nairobi County',
          biography: 'Former Senator with extensive experience in women affairs and community development.',
          imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Strengthening women cooperatives and promoting small business development.'
        }
      ]
    };

    // MCA Election - Kilimani Ward
    const mcaElection: Election = {
      id: 'election_2027_mca_kilimani',
      title: '2027 Kilimani Ward MCA Election',
      description: 'Election for Member of County Assembly - Kilimani Ward for the term 2027-2032',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      totalVotes: 0,
      candidates: [
        {
          id: 'mca_candidate_1',
          name: 'Moses Ogeto',
          party: 'Orange Democratic Movement (ODM)',
          position: 'MCA - Kilimani Ward',
          biography: 'Current Kilimani Ward MCA with focus on urban planning and infrastructure development.',
          imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Improved waste management, better roads, and enhanced security for Kilimani residents.'
        },
        {
          id: 'mca_candidate_2',
          name: 'Grace Wanjiku',
          party: 'United Democratic Alliance (UDA)',
          position: 'MCA - Kilimani Ward',
          biography: 'Community leader and businesswoman with strong grassroots connections.',
          imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          manifesto: 'Youth empowerment programs and improved access to county services for all residents.'
        }
      ]
    };

    // Store all elections
    this.elections.set(presidentialElection.id, presidentialElection);
    this.elections.set(governorElection.id, governorElection);
    this.elections.set(senatorElection.id, senatorElection);
    this.elections.set(mpElection.id, mpElection);
    this.elections.set(womanRepElection.id, womanRepElection);
    this.elections.set(mcaElection.id, mcaElection);
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

  getAllElections(): Election[] {
    return Array.from(this.elections.values());
  }

  getAllVotes(): Vote[] {
    return Array.from(this.votes.values());
  }

  getVotesByElection(electionId: string): Vote[] {
    return Array.from(this.votes.values()).filter(vote => vote.electionId === electionId);
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