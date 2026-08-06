import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Timer');
  const [activeTime, setActiveTime] = useState(0); // Counts UP from 0
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  
  const [totalSecondsStudied, setTotalSecondsStudied] = useState(0);

  // Load saved data when the app opens
  useEffect(() => {
    const savedUser = localStorage.getItem('studyhub_username');
    if (savedUser) setUsername(savedUser);

    const savedTotal = localStorage.getItem('studyhub_totalTime');
    if (savedTotal) setTotalSecondsStudied(parseInt(savedTotal, 10));

    const sessionStartTime = localStorage.getItem('studyhub_startTime');
    
    if (sessionStartTime) {
      // If a session was running, calculate how much time passed while the app was closed
      const now = new Date().getTime();
      const start = parseInt(sessionStartTime, 10);
      setActiveTime(Math.floor((now - start) / 1000));
      setIsActive(true);
    }
  }, []);

  // Stopwatch counting logic (adds 1 second infinitely)
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setActiveTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = () => {
    const now = new Date().getTime();
    setIsActive(true);
    // Saves the exact start time so the stopwatch survives page refreshes!
    localStorage.setItem('studyhub_startTime', now.toString());
  };

  const stopAndSaveTime = () => {
    if (activeTime > 0) {
      setTotalSecondsStudied((prev) => {
        const newTotal = prev + activeTime;
        localStorage.setItem('studyhub_totalTime', newTotal.toString());
        return newTotal;
      });
    }
    setIsActive(false);
    setActiveTime(0);
    localStorage.removeItem('studyhub_startTime');
  };

  const formatTimerDisplay = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatLeaderboardDisplay = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const myUsername = username || 'ganeshknikam1324';
  
  // Clean leaderboard - Fake accounts removed!
  const rawLeaderboardData = [
    { name: myUsername, time: totalSecondsStudied, isMe: true }
  ];

  const sortedLeaderboard = rawLeaderboardData.sort((a, b) => b.time - a.time);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Head>
        <title>StudyHub</title>
      </Head>

      <header className="p-4 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-xl font-bold">StudyHub 📚</h1>
        <div className="text-sm text-slate-300">
          @{myUsername} 🛡️
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 pt-8">
        
        {/* TIMER TAB */}
        {activeTab === 'Timer' && (
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="bg-slate-800 p-8 rounded-2xl w-full text-center shadow-lg">
              <p className="text-slate-400 mb-2 uppercase tracking-widest text-sm">Session Time</p>
              <h2 className="text-6xl font-mono tracking-wider">{formatTimerDisplay(activeTime)}</h2>
            </div>
            
            {!isActive ? (
              <button onClick={startTimer} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold text-lg transition-colors">
                Start Studying
              </button>
            ) : (
              <button 
                onClick={stopAndSaveTime} 
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                Stop & Save Time
              </button>
            )}
          </div>
        )}

        {/* RANKS TAB */}
        {activeTab === 'Ranks' && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">🏆 Class 12 Leaderboard</h2>
            
            <div className="flex flex-col gap-3">
              {sortedLeaderboard.map((student, index) => {
                const rank = index + 1;
                let medal = <span className="w-6 text-center text-slate-500 font-bold">{rank}</span>;
                if (rank === 1) medal = <span className="w-6 text-center text-xl">🥇</span>;

                return (
                  <div 
                    key={student.name} 
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      student.isMe 
                        ? 'bg-indigo-600 border border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {medal}
                      <span className={`font-bold ${student.isMe ? 'text-white' : 'text-slate-200'}`}>
                        {student.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm tracking-wide text-slate-300 bg-black/20 px-2 py-1 rounded">
                      {formatLeaderboardDisplay(student.time)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {totalSecondsStudied === 0 && (
              <p className="text-center text-slate-400 mt-8 text-sm">
                Start a session to get your time on the board!
              </p>
            )}
          </div>
        )}

        {(activeTab === 'Vault' || activeTab === 'Doubts') && (
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
            <p className="text-slate-400">Under construction!</p>
          </div>
        )}
      </main>

      <nav className="bg-slate-800 p-4 flex justify-around items-center rounded-t-2xl mt-auto">
        {['Timer', 'Vault', 'Doubts', 'Ranks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-medium ${activeTab === tab ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
