import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vivaAPI } from '../api';

export default function Results({ user, onLogout }) {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchResults(); }, [sessionId]);

  const fetchResults = async () => {
    try {
      const res = await vivaAPI.getResults(sessionId);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load results.');
    } finally { setLoading(false); }
  };

  const getScoreColor = (s) => s >= 8 ? 'text-accent-400' : s >= 6 ? 'text-primary-400' : s >= 4 ? 'text-amber-400' : 'text-red-400';
  const getScoreBg = (s) => s >= 8 ? 'bg-accent-500' : s >= 6 ? 'bg-primary-500' : s >= 4 ? 'bg-amber-500' : s > 0 ? 'bg-red-500' : 'bg-surface-200/20';

  const getOverallFeedback = () => {
    if (!results) return [];

    // Helper to extract the core topic/concept from a question
    const extractConcept = (text) => {
      let concept = text.toLowerCase().replace(/\?/g, '').trim();
      const prefixes = [
        'what is the role of the', 'what is the role of',
        'what is the purpose of the', 'what is the purpose of',
        'what are the functions of the', 'what are the functions of',
        'what is the difference between', 'how does the', 'how do the', 'how does', 'how do',
        'what do you mean by', 'what is a', 'what is an', 'what is the',
        'what is', 'what are', 'define the', 'define', 'explain the', 'explain', 'describe the', 'describe',
        'which layer', 'which protocol', 'what type of'
      ];
      for (const prefix of prefixes) {
        if (concept.startsWith(prefix)) {
          concept = concept.substring(prefix.length).trim();
          break;
        }
      }
      return concept.length > 2 ? concept : "networking fundamentals";
    };

    const wellDone = results.results.filter(r => r.score >= 7);
    const average = results.results.filter(r => r.score >= 4 && r.score < 7);
    const weak = results.results.filter(r => r.score > 0 && r.score < 4);
    const skipped = results.results.filter(r => r.grade === 'Skipped' || r.student_answer === '[Skipped]' || r.score === 0);

    const feedback = [];

    // Highlight concepts that were well understood
    if (wellDone.length > 0) {
      const concepts = Array.from(new Set(wellDone.map(r => extractConcept(r.question_text)))).slice(0, 3).join(', ');
      feedback.push({
        icon: '🌟',
        color: 'text-accent-400',
        bgColor: 'bg-accent-500/8',
        borderColor: 'border-accent-500/15',
        message: `Excellent command of: ${concepts}. Your understanding of these networking mechanisms and architectures is very strong.`
      });
    }

    // Highlight concepts that need refinement
    if (average.length > 0) {
      const concepts = Array.from(new Set(average.map(r => extractConcept(r.question_text)))).slice(0, 3).join(', ');
      feedback.push({
        icon: '💡',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/8',
        borderColor: 'border-amber-500/15',
        message: `Partial understanding on: ${concepts}. You got the basic idea, but in networking, precision matters. Review the specific terminologies and protocols.`
      });
    }

    // Highlight concepts completely missed
    if (weak.length > 0) {
      const concepts = Array.from(new Set(weak.map(r => extractConcept(r.question_text)))).slice(0, 3).join(', ');
      feedback.push({
        icon: '⚠️',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/8',
        borderColor: 'border-orange-500/15',
        message: `Needs attention: ${concepts}. These concepts are crucial for understanding data communications. I recommend re-reading how they operate within the standard models.`
      });
    }

    // Highlight skipped concepts
    if (skipped.length > 0) {
      const concepts = Array.from(new Set(skipped.map(r => extractConcept(r.question_text)))).slice(0, 3).join(', ');
      feedback.push({
        icon: '⏭',
        color: 'text-surface-200/60',
        bgColor: 'bg-surface-200/5',
        borderColor: 'border-surface-200/10',
        message: `You skipped topics related to: ${concepts}. Don't let these gaps in your networking knowledge remain. Go back and study these specific areas.`
      });
    }

    // Structured and personalized networking feedback closing
    if (wellDone.length >= 8) {
      feedback.push({ icon: '🎓', color: 'text-primary-400', bgColor: 'bg-primary-500/8', borderColor: 'border-primary-500/15',
        message: 'Outstanding overall performance! You have a solid grasp of network communications and protocols. You are well-prepared.' });
    } else if (wellDone.length >= 5) {
      feedback.push({ icon: '📈', color: 'text-primary-400', bgColor: 'bg-primary-500/8', borderColor: 'border-primary-500/15',
        message: 'Good effort overall! You have a respectable foundation in computer networks, but bridging the specific knowledge gaps highlighted above will make you an expert.' });
    } else {
      feedback.push({ icon: '🔧', color: 'text-primary-400', bgColor: 'bg-primary-500/8', borderColor: 'border-primary-500/15',
        message: 'Networking can be challenging with its layers and protocols. Don\'t be discouraged. Review the highlighted weaknesses in your textbook to build a stronger foundation.' });
    }

    return feedback;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
        <p className="text-surface-200/50">Loading results...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-8 max-w-md text-center animate-fade-in">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Dashboard</button>
      </div>
    </div>
  );

  const feedbackItems = getOverallFeedback();

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-surface-900/50 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Viva Results</h1>
          <button id="back-dashboard-btn" onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm rounded-xl bg-surface-800/50 border border-white/5 text-surface-200/60 hover:text-white transition-all">
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-1">Viva Examination Results</h2>
          <p className="text-surface-200/40">{results.student_name} · {results.total_questions} questions</p>
        </div>

        {/* All Questions with Scores */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-200/40 mb-5">All Questions</h3>
          <div className="space-y-3">
            {results.results.map((item, i) => {
              const isSkipped = item.grade === 'Skipped' || item.student_answer === '[Skipped]' || item.score === 0;
              return (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-900/30 border border-white/5 hover:border-primary-500/15 transition-all">
                  {/* Question number */}
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-400">{item.question_number}</span>
                  </div>

                  {/* Question text */}
                  <p className="flex-1 text-sm text-surface-200/80 leading-relaxed">{item.question_text}</p>

                  {/* Score */}
                  <div className="shrink-0 flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-surface-900/60 overflow-hidden hidden sm:block">
                      <div className={`h-full rounded-full ${getScoreBg(item.score)}`}
                        style={{ width: `${(item.score / 10) * 100}%` }} />
                    </div>
                    {isSkipped ? (
                      <span className="text-xs font-medium text-surface-200/30 w-14 text-right">Skipped</span>
                    ) : (
                      <span className={`text-sm font-bold w-14 text-right ${getScoreColor(item.score)}`}>
                        {item.score}/10
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-4">Feedback</h3>
          <div className="space-y-3">
            {feedbackItems.map((fb, i) => (
              <div key={i} className={`glass-card p-5 border ${fb.borderColor} ${fb.bgColor}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{fb.icon}</span>
                  <p className={`text-sm leading-relaxed ${fb.color}`}>{fb.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro tip */}
        <div className="mt-6 glass-card p-5 text-center">
          <p className="text-surface-200/50 text-sm">
             <span className="text-primary-400/70 font-medium">Pro tip:</span> Focus on the topics you scored low on or skipped. Understanding the key concepts will help you improve significantly!
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button id="retake-viva-btn" onClick={() => navigate('/dashboard')} className="btn-primary px-8">
            Take Another Viva
          </button>
          <button id="logout-result-btn" onClick={() => { onLogout(); navigate('/'); }}
            className="px-8 py-3 rounded-xl bg-surface-800/50 border border-white/5 text-surface-200/60 hover:text-white transition-all text-sm font-medium">
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
