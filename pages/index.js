import { useState, useEffect } from 'react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('timer');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setCurrentUser({ username: authForm.username, role: data.role });
      } else {
        setAuthError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setAuthError('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSec) => {
    const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const fetchLeaderboard = async () => {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    if (data.success) setLeaderboard(data.leaderboard);
  };

  useEffect(() => {
    if (activeTab === 'ranks') fetchLeaderboard();
  }, [activeTab]);


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center text-indigo-400 mb-2">StudyHub</h1>
          <p className="text-center text-gray-400 mb-8">
            {isLoginMode ? 'Welcome back, focus up.' : 'Join your batch and start tracking.'}
          </p>

          {authError && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
              value={authForm.username}
              onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Wait...' : isLoginMode ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setAuthError('');
            }}
            className="w-full text-center text-sm text-gray-400 hover:text-white mt-6 transition"
          >
            {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between pb-16">
      <header className="p-4 bg-slate-800 text-center font-bold text-xl border-b border-slate-700 flex justify-between items-center">
        <span>StudyHub 📚</span>
        <span className="text-sm font-normal text-indigo-400">
          @{currentUser.username} {currentUser.role === 'admin' && '🛡️'}
        </span>
      </header>

      <main className="p-4 flex-1 flex flex-col items-center justify-center">
        {activeTab === 'timer' && (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="text-6xl font-mono bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg w-full text-center">
              {formatTime(seconds)}
            </div>

            <div className="flex gap-2">
              {[25, 50, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSeconds(mins * 60)}
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700"
                >
                  {mins}m
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-full py-4 text-xl font-bold rounded-xl transition ${
                isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isActive ? 'Stop & Log Session' : 'Start Studying'}
            </button>
          </div>
        )}

        {activeTab === 'ranks' && (
          <div className="w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-center">🏆 Leaderboard</h2>
            <div className="flex flex-col gap-2">
              {leaderboard.length === 0 ? (
                <p className="text-center text-gray-500">No sessions logged yet.</p>
              ) : (
                leaderboard.map((user, index) => (
                  <div
                    key={user.username}
                    className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700"
                  >
                    <span className="font-semibold">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}{' '}
                      {user.username}
                    </span>
                    <span className="text-indigo-400 font-bold">{user.totalHours} hrs</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-3 pb-safe">
        {['timer', 'vault', 'doubts', 'ranks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize font-medium transition-colors ${
              activeTab === tab ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
