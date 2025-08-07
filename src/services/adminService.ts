import { AdminStats, Election, Vote } from '../types';
import { votingService } from './votingService';
import { eCitizenService } from './eCitizenService';

class AdminService {
  async getAdminStats(): Promise<AdminStats> {
    const elections = votingService.getAllElections();
    const allVotes = votingService.getAllVotes();
    
    const totalRegisteredVoters = 2500000; // Simulated total registered voters
    const totalVotesCast = allVotes.length;
    const turnoutPercentage = (totalVotesCast / totalRegisteredVoters) * 100;

    const electionsByStatus = {
      active: elections.filter(e => e.status === 'active').length,
      completed: elections.filter(e => e.status === 'completed').length,
      upcoming: elections.filter(e => e.status === 'upcoming').length
    };

    const votesByElection: { [electionId: string]: number } = {};
    elections.forEach(election => {
      votesByElection[election.id] = allVotes.filter(vote => vote.electionId === election.id).length;
    });

    const votesByCounty: { [county: string]: number } = {
      'Nairobi': Math.floor(totalVotesCast * 0.4),
      'Mombasa': Math.floor(totalVotesCast * 0.15),
      'Kisumu': Math.floor(totalVotesCast * 0.12),
      'Nakuru': Math.floor(totalVotesCast * 0.10),
      'Eldoret': Math.floor(totalVotesCast * 0.08),
      'Others': Math.floor(totalVotesCast * 0.15)
    };

    return {
      totalRegisteredVoters,
      totalVotesCast,
      turnoutPercentage,
      electionsByStatus,
      votesByElection,
      votesByCounty
    };
  }

  async getElectionDetails(electionId: string) {
    const election = votingService.getElectionById(electionId);
    if (!election) return null;

    const results = await votingService.getElectionResults(electionId);
    const votes = votingService.getVotesByElection(electionId);
    
    return {
      election,
      results,
      votes,
      totalVotes: votes.length,
      hourlyVoting: this.generateHourlyVotingData(votes)
    };
  }

  private generateHourlyVotingData(votes: Vote[]) {
    const hourlyData: { [hour: string]: number } = {};
    
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      hourlyData[hour] = Math.floor(Math.random() * 50) + 10;
    }
    
    return hourlyData;
  }

  async exportElectionData(electionId: string): Promise<string> {
    const details = await this.getElectionDetails(electionId);
    if (!details) return '';

    // Generate CSV data
    let csv = 'Candidate,Party,Votes,Percentage\n';
    details.results.forEach(result => {
      const candidate = details.election.candidates.find(c => c.id === result.candidateId);
      if (candidate) {
        csv += `${candidate.name},${candidate.party},${result.votes},${result.percentage.toFixed(2)}%\n`;
      }
    });

    return csv;
  }
}

export const adminService = new AdminService();