import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle, Clock, Users, Award } from 'lucide-react';
import { Election, Candidate } from '../types';
import { votingService } from '../services/votingService';

interface VotingInterfaceProps {
  sessionToken: string;
  onVoteComplete: () => void;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({ sessionToken, onVoteComplete }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      checkVotingStatus(selectedElection.id);
      loadResults(selectedElection.id);
    }
  }, [selectedElection]);

  const loadElections = async () => {
    const activeElections = votingService.getActiveElections();
    setElections(activeElections);
    if (activeElections.length > 0) {
      setSelectedElection(activeElections[0]);
    }
  };

  const checkVotingStatus = async (electionId: string) => {
    const voted = await votingService.hasUserVoted(sessionToken, electionId);
    setHasVoted(prev => ({ ...prev, [electionId]: voted }));
  };

  const loadResults = async (electionId: string) => {
    const electionResults = await votingService.getElectionResults(electionId);
    setResults(prev => ({ ...prev, [electionId]: electionResults }));
  };

  const handleVote = async () => {
    if (!selectedElection || !selectedCandidate) return;

    setIsVoting(true);
    try {
      const result = await votingService.castVote(sessionToken, selectedElection.id, selectedCandidate);
      
      if (result.success) {
        setHasVoted(prev => ({ ...prev, [selectedElection.id]: true }));
        await loadResults(selectedElection.id);
        onVoteComplete();
      } else {
        alert(result.error || 'Failed to cast vote');
      }
    } catch (error) {
      alert('An error occurred while voting');
    } finally {
      setIsVoting(false);
      setSelectedCandidate(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (elections.length === 0) {
    return (
      <div className="cyber-panel neon-glow p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <Clock className="w-16 h-16 text-cyan-400 mx-auto mb-4 neon-glow animate-pulse" />
        <h3 className="text-xl font-semibold text-cyan-400 neon-text mb-2 font-mono">NO ACTIVE PROTOCOLS</h3>
        <p className="text-cyan-300 font-mono">Quantum voting chambers currently offline</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Election Selection */}
      {elections.length > 1 && (
        <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <h3 className="text-lg font-semibold text-cyan-400 neon-text mb-4 font-mono">SELECT VOTING PROTOCOL</h3>
          <div className="grid gap-3">
            {elections.map((election) => (
              <button
                key={election.id}
                onClick={() => setSelectedElection(election)}
                className={`p-4 border-2 text-left transition-all duration-300 relative overflow-hidden ${
                  selectedElection?.id === election.id
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 neon-glow'
                    : 'border-gray-600 hover:border-cyan-400 bg-gray-900/50'
                }`}
              >
                {selectedElection?.id === election.id && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                )}
                <h4 className="font-medium text-cyan-400 font-mono">{election.title}</h4>
                <p className="text-sm text-cyan-300 mt-1 font-mono">{election.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-cyan-300 font-mono">
                  <span>ENDS: {formatDate(election.endDate)}</span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {election.totalVotes} VOTES
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedElection && (
        <>
          {/* Election Info */}
          <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 neon-text font-mono">{selectedElection.title}</h2>
                <p className="text-cyan-300 mt-2 font-mono">{selectedElection.description}</p>
              </div>
              {hasVoted[selectedElection.id] && (
                <div className="flex items-center space-x-2 bg-green-900/30 border border-green-400 text-green-400 px-3 py-1 neon-glow-green">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium font-mono">VOTED</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Clock className="w-4 h-4" />
                <span>ENDS: {formatDate(selectedElection.endDate)}</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <Users className="w-4 h-4" />
                <span>{selectedElection.totalVotes} TOTAL VOTES</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <Award className="w-4 h-4" />
                <span>{selectedElection.candidates.length} CANDIDATES</span>
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <h3 className="text-xl font-semibold text-cyan-400 neon-text mb-6 font-mono">CANDIDATE MATRIX</h3>
            
            <div className="grid gap-6">
              {selectedElection.candidates.map((candidate) => {
                const candidateResults = results[selectedElection.id]?.find(r => r.candidateId === candidate.id);
                
                return (
                  <div
                    key={candidate.id}
                    className={`border-2 p-6 transition-all cursor-pointer relative overflow-hidden ${
                      selectedCandidate === candidate.id
                        ? 'border-cyan-400 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 neon-glow'
                        : 'border-gray-600 hover:border-cyan-400 bg-gray-900/30'
                    } ${hasVoted[selectedElection.id] ? 'cursor-not-allowed opacity-75' : ''}`}
                    onClick={() => !hasVoted[selectedElection.id] && setSelectedCandidate(candidate.id)}
                  >
                    {selectedCandidate === candidate.id && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <img
                        src={candidate.imageUrl}
                        alt={candidate.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400 neon-glow"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-cyan-400 font-mono">{candidate.name}</h4>
                            <p className="text-blue-400 font-medium font-mono">{candidate.party}</p>
                            <p className="text-cyan-300 text-sm mt-1 font-mono">{candidate.position}</p>
                          </div>
                          
                          {candidateResults && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-cyan-400 neon-text font-mono">
                                {candidateResults.percentage.toFixed(1)}%
                              </div>
                              <div className="text-sm text-cyan-300 font-mono">
                                {candidateResults.votes} VOTES
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-cyan-300 mt-3 text-sm leading-relaxed font-mono">{candidate.biography}</p>
                        
                        <div className="mt-4 p-3 bg-gray-900/50 border border-cyan-400/30">
                          <h5 className="font-medium text-cyan-400 mb-1 font-mono">CORE PROTOCOL</h5>
                          <p className="text-sm text-cyan-300 font-mono">{candidate.manifesto}</p>
                        </div>

                        {candidateResults && (
                          <div className="mt-4">
                            <div className="w-full bg-gray-800 h-2 relative overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2 transition-all duration-500 neon-glow"
                                style={{ width: `${candidateResults.percentage}%` }}
                              ></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!hasVoted[selectedElection.id] && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleVote}
                  disabled={!selectedCandidate || isVoting}
                  className="holo-button px-8 py-3 font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400 text-green-400 neon-glow-green"
                >
                  <Vote className="w-5 h-5" />
                  <span className="font-mono">{isVoting ? 'TRANSMITTING...' : 'EXECUTE VOTE'}</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};