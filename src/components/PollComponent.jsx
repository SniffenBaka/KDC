import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
  soft: 'rgba(147, 51, 234, 0.14)',
  border: 'rgba(147, 51, 234, 0.35)',
};

// Helper to get or create device ID
const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  const key = 'eightDucksDeviceId';
  let deviceId = localStorage.getItem(key);
  if (!deviceId) {
    deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem(key, deviceId);
  }
  return deviceId;
};

const PollComponent = ({ 
  question = "Câu hỏi khảo sát", 
  options = [],
  pollId = 'poll-' + Date.now(),
  onVote = null 
}) => {
  const [voteCounts, setVoteCounts] = useState(new Array(options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const deviceId = getDeviceId();
  const username = localStorage.getItem('eightDucksUsername') || 'Anonymous';

  // Fetch all votes for this poll from Supabase
  const fetchVotes = async () => {
    if (!supabase) {
      console.warn('Supabase not configured, using localStorage fallback');
      loadFromLocalStorage();
      return;
    }

    try {
      // Get all votes for this poll
      const { data: votes, error } = await supabase
        .from('poll_votes')
        .select('option_index, device_id')
        .eq('poll_id', pollId);

      if (error) throw error;

      // Calculate vote counts
      const counts = new Array(options.length).fill(0);
      let userVote = null;

      if (votes && votes.length > 0) {
        votes.forEach(vote => {
          if (vote.option_index < counts.length) {
            counts[vote.option_index]++;
          }
          // Check if current user has voted
          if (vote.device_id === deviceId) {
            userVote = vote.option_index;
          }
        });
      }

      setVoteCounts(counts);
      setTotalVotes(votes.length);
      
      if (userVote !== null) {
        setHasVoted(true);
        setSelectedOption(userVote);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Load from localStorage
  const loadFromLocalStorage = () => {
    const savedVotes = localStorage.getItem(`poll-votes-${pollId}`);
    const savedUserVote = localStorage.getItem(`poll-user-vote-${pollId}`);
    
    if (savedVotes) {
      const votesObj = JSON.parse(savedVotes);
      const counts = Object.values(votesObj);
      setVoteCounts(counts);
      setTotalVotes(counts.reduce((sum, count) => sum + count, 0));
    } else {
      setVoteCounts(new Array(options.length).fill(0));
    }

    if (savedUserVote !== null) {
      setHasVoted(true);
      setSelectedOption(parseInt(savedUserVote));
    }
    setLoading(false);
  };

  // Submit vote to Supabase
  const handleVote = async (optionIndex) => {
    if (hasVoted || loading) return;

    if (!supabase) {
      // Fallback to localStorage
      saveToLocalStorage(optionIndex);
      return;
    }

    try {
      setLoading(true);

      // Upsert vote (insert or update if exists)
      const { error } = await supabase
        .from('poll_votes')
        .upsert({
          poll_id: pollId,
          option_index: optionIndex,
          device_id: deviceId,
          username: username
        }, {
          onConflict: 'poll_id,device_id'
        });

      if (error) throw error;

      // Update local state
      setSelectedOption(optionIndex);
      setHasVoted(true);

      // Refresh vote counts
      await fetchVotes();

      // Callback
      if (onVote) {
        onVote(pollId, optionIndex);
      }

      // Also save to localStorage as backup
      saveToLocalStorage(optionIndex);
    } catch (error) {
      console.error('Error submitting vote:', error);
      // Fallback to localStorage on error
      saveToLocalStorage(optionIndex);
    } finally {
      setLoading(false);
    }
  };

  // Save to localStorage (fallback)
  const saveToLocalStorage = (optionIndex) => {
    const newCounts = [...voteCounts];
    newCounts[optionIndex] = (newCounts[optionIndex] || 0) + 1;
    
    const votesObj = {};
    newCounts.forEach((count, idx) => {
      votesObj[idx] = count;
    });

    localStorage.setItem(`poll-votes-${pollId}`, JSON.stringify(votesObj));
    localStorage.setItem(`poll-user-vote-${pollId}`, optionIndex.toString());

    setVoteCounts(newCounts);
    setSelectedOption(optionIndex);
    setHasVoted(true);
    setTotalVotes(newCounts.reduce((sum, count) => sum + count, 0));
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchVotes();
  }, [pollId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`poll_${pollId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'poll_votes',
        filter: `poll_id=eq.${pollId}`
      }, (payload) => {
        console.log('Realtime update:', payload);
        // Refresh votes when changes occur
        fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  const getPercentage = (optionIndex) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCounts[optionIndex] / totalVotes) * 100);
  };

  return (
    <div style={{
      margin: '32px auto',
      maxWidth: '700px',
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '24px',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryHover})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BarChart3 size={20} color="#fff" />
        </div>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700',
          color: '#f9fafb',
          flex: 1,
        }}>
          {question}
        </h3>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((option, index) => {
          const percentage = getPercentage(index);
          const isSelected = selectedOption === index;
          const voteCount = voteCounts[index] || 0;

          return (
            <button
              key={index}
              onClick={() => handleVote(index)}
              disabled={hasVoted || loading}
              style={{
                position: 'relative',
                width: '100%',
                padding: '16px 20px',
                background: hasVoted 
                  ? (isSelected ? BRAND.soft : 'rgba(255, 255, 255, 0.03)')
                  : 'rgba(255, 255, 255, 0.03)',
                border: hasVoted && isSelected
                  ? `2px solid ${BRAND.primary}`
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: '#e5e7eb',
                fontSize: '15px',
                fontWeight: '500',
                textAlign: 'left',
                cursor: (hasVoted || loading) ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!hasVoted && !loading) {
                  e.currentTarget.style.background = 'rgba(147, 51, 234, 0.1)';
                  e.currentTarget.style.borderColor = BRAND.border;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!hasVoted && !loading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {/* Progress Bar Background */}
              {hasVoted && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${percentage}%`,
                  background: isSelected 
                    ? `linear-gradient(90deg, ${BRAND.primary}40, ${BRAND.primaryHover}40)`
                    : 'rgba(255, 255, 255, 0.05)',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '11px',
                  zIndex: 0,
                }} />
              )}

              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>{option}</span>
                {hasVoted && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <span style={{
                      fontSize: '13px',
                      color: '#9ca3af',
                    }}>
                      {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: isSelected ? BRAND.primaryHover : '#a78bfa',
                      minWidth: '45px',
                      textAlign: 'right',
                    }}>
                      {percentage}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {hasVoted && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '13px',
            color: '#9ca3af',
          }}>
            {totalVotes} {totalVotes === 1 ? 'người đã' : 'người đã'} bình chọn
          </span>
          <span style={{
            fontSize: '13px',
            color: '#22c55e',
            fontWeight: '600',
          }}>
            ✓ Đã bình chọn
          </span>
        </div>
      )}

      {loading && !hasVoted && (
        <div style={{
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#9ca3af',
        }}>
          Đang tải...
        </div>
      )}
    </div>
  );
};

export default PollComponent;
