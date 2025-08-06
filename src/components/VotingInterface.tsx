import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle, Clock, Users, Award } from 'lucide-react';
import { Election, Candidate } from '../types';
import { votingService } from '../services/votingService';

interface VotingInterfaceProps {
  sessionToken: string;
  onVoteComplete: () => void;
  onVoteAttempt: () => boolean;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({ sessionToken, onVoteComplete, onVoteAttempt }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: any[] }>({});
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

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
    if (!sessionToken) {
      setHasVoted(prev => ({ ...prev, [electionId]: false }));
      return;
    }
    const voted = await votingService.hasUserVoted(sessionToken, electionId);
    setHasVoted(prev => ({ ...prev, [electionId]: voted }));
  };

  const loadResults = async (electionId: string) => {
    const electionResults = await votingService.getElectionResults(electionId);
    setResults(prev => ({ ...prev, [electionId]: electionResults }));
  };

  const handleVote = async () => {
    if (!selectedElection || !selectedCandidate) return;

    // Check if user is authenticated before voting
    if (!onVoteAttempt()) {
      setShowSignInPrompt(true);
      setTimeout(() => setShowSignInPrompt(false), 3000);
      return;
    }

    setIsVoting(true);
    try {
      const result = await votingService.castVote(sessionToken!, selectedElection.id, selectedCandidate);
      
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
        <div className="cyber-panel neon-glow p-6 relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <h3 className="text-xl font-semibold text-cyan-400 neon-text mb-6 font-mono tracking-wider">ELECTORAL MATRIX SELECTION</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {elections.map((election) => (
              <button
                key={election.id}
                onClick={() => setSelectedElection(election)}
                className={`p-5 border-2 text-left transition-all duration-300 relative overflow-hidden group hover:scale-105 ${
                  selectedElection?.id === election.id
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 neon-glow transform scale-105'
                    : 'border-gray-600 hover:border-cyan-400 bg-gray-900/50 hover:bg-gray-800/60'
                }`}
              >
                {selectedElection?.id === election.id && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse neon-glow"></div>
                  </>
                )}
                
                {/* Election Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`px-2 py-1 text-xs font-mono border rounded ${
                    election.title.includes('Presidential') ? 'border-purple-400 text-purple-400 bg-purple-900/20' :
                    election.title.includes('Governor') ? 'border-orange-400 text-orange-400 bg-orange-900/20' :
                    election.title.includes('Senator') ? 'border-blue-400 text-blue-400 bg-blue-900/20' :
                    election.title.includes('MP') ? 'border-green-400 text-green-400 bg-green-900/20' :
                    election.title.includes('Woman') ? 'border-pink-400 text-pink-400 bg-pink-900/20' :
                    'border-cyan-400 text-cyan-400 bg-cyan-900/20'
                  }`}>
                    {election.title.includes('Presidential') ? 'NATIONAL' :
                     election.title.includes('Governor') ? 'COUNTY EXEC' :
                     election.title.includes('Senator') ? 'SENATE' :
                     election.title.includes('MP') && election.title.includes('Woman') ? 'NATIONAL ASSEMBLY' :
                     election.title.includes('MP') ? 'CONSTITUENCY' :
                     'WARD'}
                  </div>
                  {selectedElection?.id === election.id && (
                    <div className="text-cyan-400 text-xs font-mono animate-pulse">● ACTIVE</div>
                  )}
                </div>
                
                <h4 className="font-semibold text-cyan-400 font-mono text-sm leading-tight mb-2 group-hover:neon-text transition-all">
                  {election.title.replace('2027 ', '').replace(' Election', '')}
                </h4>
                <p className="text-xs text-cyan-300 mt-1 font-mono leading-relaxed opacity-80">
                  {election.description.replace('Election for ', '').replace(' for the term 2027-2032', '')}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs text-cyan-300 font-mono">
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1 opacity-60" />
                    {election.totalVotes}
                  </span>
                  <span className="flex items-center opacity-60">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.ceil((new Date(election.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}D
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
          <div className="cyber-panel neon-glow p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`px-3 py-1 text-sm font-mono border rounded ${
                    selectedElection.title.includes('Presidential') ? 'border-purple-400 text-purple-400 bg-purple-900/20 neon-glow-purple' :
                    selectedElection.title.includes('Governor') ? 'border-orange-400 text-orange-400 bg-orange-900/20' :
                    selectedElection.title.includes('Senator') ? 'border-blue-400 text-blue-400 bg-blue-900/20' :
                    selectedElection.title.includes('MP') ? 'border-green-400 text-green-400 bg-green-900/20 neon-glow-green' :
                    selectedElection.title.includes('Woman') ? 'border-pink-400 text-pink-400 bg-pink-900/20' :
                    'border-cyan-400 text-cyan-400 bg-cyan-900/20'
                  }`}>
                    {selectedElection.title.includes('Presidential') ? 'PRESIDENTIAL PROTOCOL' :
                     selectedElection.title.includes('Governor') ? 'COUNTY EXECUTIVE' :
                     selectedElection.title.includes('Senator') ? 'SENATE CHAMBER' :
                     selectedElection.title.includes('MP') && selectedElection.title.includes('Woman') ? 'WOMEN REPRESENTATIVE' :
                     selectedElection.title.includes('MP') ? 'NATIONAL ASSEMBLY' :
                     'COUNTY ASSEMBLY'}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-cyan-400 neon-text font-mono tracking-wide">{selectedElection.title}</h2>
                <p className="text-cyan-300 mt-3 font-mono text-lg">{selectedElection.description}</p>
              </div>
              {hasVoted[selectedElection.id] && (
                <div className="flex items-center space-x-2 bg-green-900/40 border-2 border-green-400 text-green-400 px-4 py-2 neon-glow-green animate-pulse">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium font-mono">VOTE CAST</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm font-mono">
              <div className="cyber-panel border-cyan-400/50 p-4 text-center">
                <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2 neon-glow animate-pulse" />
                <div className="text-cyan-400 font-semibold">PROTOCOL ENDS</div>
                <div className="text-cyan-300 text-xs mt-1">{formatDate(selectedElection.endDate)}</div>
              </div>
              <div className="cyber-panel border-green-400/50 p-4 text-center">
                <Users className="w-6 h-6 text-green-400 mx-auto mb-2 neon-glow-green animate-pulse" />
                <div className="text-green-400 font-semibold">TOTAL VOTES</div>
                <div className="text-green-300 text-lg font-bold">{selectedElection.totalVotes.toLocaleString()}</div>
              </div>
              <div className="cyber-panel border-purple-400/50 p-4 text-center">
                <Award className="w-6 h-6 text-purple-400 mx-auto mb-2 neon-glow-purple animate-pulse" />
                <div className="text-purple-400 font-semibold">CANDIDATES</div>
                <div className="text-purple-300 text-lg font-bold">{selectedElection.candidates.length}</div>
              </div>
              <div className="cyber-panel border-orange-400/50 p-4 text-center">
                <div className="w-6 h-6 bg-orange-400 rounded-full mx-auto mb-2 neon-glow animate-pulse flex items-center justify-center">
                  <span className="text-black font-bold text-xs">%</span>
                </div>
                <div className="text-orange-400 font-semibold">TURNOUT</div>
                <div className="text-orange-300 text-lg font-bold">
                  {selectedElection.totalVotes > 0 ? '67.3%' : '0%'}
                </div>
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="cyber-panel neon-glow p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <h3 className="text-2xl font-semibold text-cyan-400 neon-text mb-8 font-mono tracking-wider">CANDIDATE NEURAL PROFILES</h3>
            
            <div className="grid gap-8">
              {selectedElection.candidates.map((candidate) => {
                const candidateResults = results[selectedElection.id]?.find(r => r.candidateId === candidate.id);
                
                return (
                  <div
                    key={candidate.id}
                    className={`border-2 p-8 transition-all cursor-pointer relative overflow-hidden group hover:scale-[1.02] ${
                      selectedCandidate === candidate.id
                        ? 'border-cyan-400 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 neon-glow transform scale-[1.02]'
                        : 'border-gray-600 hover:border-cyan-400 bg-gray-900/30 hover:bg-gray-800/50'
                    }`}
                    onClick={() => {
                      if (sessionToken && hasVoted[selectedElection.id]) return;
                      setSelectedCandidate(candidate.id);
                    }}
                  >
                    {selectedCandidate === candidate.id && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    )}
                    <div className="flex items-start space-x-6">
                      <img
                        src={candidate.imageUrl}
                        alt={candidate.name}
                        className="w-24 h-24 rounded-full object-cover border-3 border-cyan-400 neon-glow group-hover:neon-glow-green transition-all"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-cyan-400 font-mono group-hover:neon-text transition-all">{candidate.name}</h4>
                            <p className="text-blue-400 font-semibold font-mono text-lg mt-1">{candidate.party}</p>
                            <p className="text-cyan-300 mt-2 font-mono bg-cyan-900/20 px-3 py-1 inline-block border border-cyan-400/30">{candidate.position}</p>
                          </div>
                          
                          {candidateResults && (
                            <div className="text-right cyber-panel border-cyan-400/50 p-4 min-w-[120px]">
                              <div className="text-3xl font-bold text-cyan-400 neon-text font-mono">
                                {candidateResults.percentage.toFixed(1)}%
                              </div>
                              <div className="text-cyan-300 font-mono mt-1">
                                {candidateResults.votes.toLocaleString()} VOTES
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-cyan-300 mt-4 leading-relaxed font-mono">{candidate.biography}</p>
                        
                        <div className="mt-6 p-4 bg-gray-900/70 border-2 border-cyan-400/50 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                          <h5 className="font-semibold text-cyan-400 mb-3 font-mono tracking-wide">NEURAL MANIFESTO PROTOCOL</h5>
                          <p className="text-cyan-300 font-mono leading-relaxed">{candidate.manifesto}</p>
                        </div>

                        {candidateResults && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono text-cyan-400">VOTE DISTRIBUTION</span>
                              <span className="text-xs font-mono text-cyan-300">{candidateResults.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-3 relative overflow-hidden border border-cyan-400/30">
                              <div
                                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 transition-all duration-1000 neon-glow relative"
                                style={{ width: `${candidateResults.percentage}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Voting Status Indicator */}
                        {sessionToken && hasVoted[selectedElection.id] && (
                          <div className="absolute top-6 right-6 bg-green-900/90 border-2 border-green-400 text-green-400 px-3 py-2 font-mono neon-glow-green animate-pulse">
                            ✓ VOTE CAST
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center">
              {sessionToken && hasVoted[selectedElection.id] ? (
                <div className="cyber-panel border-green-400 neon-glow-green p-6 text-center max-w-md">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4 neon-glow-green animate-pulse" />
                  <p className="text-green-400 font-mono text-lg font-semibold">VOTE TRANSMISSION COMPLETE</p>
                  <p className="text-green-300 font-mono mt-2">Neural signature verified • Quantum encrypted • Blockchain recorded</p>
                </div>
              ) : (
                <button
                  onClick={handleVote}
                  disabled={!selectedCandidate || isVoting}
                  className={`holo-button px-12 py-4 font-semibold transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 text-lg ${
                    sessionToken 
                      ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-green-400 text-green-400 neon-glow-green hover:scale-105'
                      : 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border-blue-400 text-blue-400 hover:scale-105'
                  }`}
                >
                  <Vote className="w-6 h-6" />
                  <span className="font-mono">
                    {isVoting ? 'TRANSMITTING NEURAL DATA...' : sessionToken ? 'EXECUTE QUANTUM VOTE' : 'NEURAL AUTH REQUIRED'}
                  </span>
                </button>
              )}
            </div>

            {/* Sign In Prompt */}
            {showSignInPrompt && (
              <div className="mt-6 cyber-panel border-blue-400 neon-glow p-6 text-center relative overflow-hidden max-w-md mx-auto">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                <User className="w-10 h-10 text-blue-400 mx-auto mb-3 neon-glow animate-pulse" />
                <p className="text-blue-400 font-mono text-lg font-semibold">NEURAL AUTHENTICATION REQUIRED</p>
                <p className="text-blue-300 font-mono mt-2">Initialize biometric verification to cast quantum vote</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};