import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Ranks'); // Opening Ranks first to see the change
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  
  const [totalSecondsStudied, setTotalSecondsStudied] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0); 

  useEffect(() => {
    const savedUser = localStorage.getItem('studyhub_username');
    if (savedUser) setUsername(savedUser);

    const savedTotal = localStorage.getItem('studyhub_totalTime');
    if (savedTotal) setTotalSecondsStudied(parseInt(savedTotal, 10));

    const savedEndTime = localStorage.getItem('studyhub_endTime');
    const savedDuration = localStorage.getItem('studyhub_duration');
    
    if (savedEndTime && savedDuration) {
      const now = new Date().getTime();
      const endTime = parseInt(savedEndTime, 10);
      
      if (endTime > now) {
        setTimeLeft(Math.floor((endTime - now) / 1000));
        setSessionDuration(parseInt(savedDuration, 10));
        setIsActive(true);
      } else {
        const addedTime = parseInt(savedDuration, 10);
        const newTotal = (savedTotal ? parseInt(savedTotal, 10) : 0) + addedTime;
        setTotalSecondsStudied(newTotal);
        localStorage.setItem('studyhub_totalTime', newTotal.toString());
        localStorage.removeItem('studyhub_endTime');
        localStorage.removeItem('studyhub_duration');
      }
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      
      setTotalSecondsStudied((prev) => {
        const newTotal = prev + sessionDuration;
        localStorage.setItem('studyhub_totalTime', newTotal.toString());
        return newTotal;
      });
      
      localStorage.removeItem('studyhub_endTime');
      localStorage.removeItem('studyhub_duration');
      alert("Session complete! Time added to your total.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionDuration]);

  const startTimer = (minutes) => {
    const seconds = minutes * 60;
    const endTime = new Date().getTime() + seconds * 1000;
    
    setTimeLeft(seconds);
    setSessionDuration(seconds);
    setIsActive(true);
    localStorage.setItem('studyhub_endTime', endTime.toString());
    localStorage.setItem('studyhub_duration', seconds.toString());
  };

  const stopAndSaveTime = () => {
    const timeStudied = sessionDuration - timeLeft;
    if (timeStudied > 0) {
      setTotalSecondsStudied((prev) => {
        const newTotal = prev + timeStudied;
        localStorage.setItem('studyhub_totalTime', newTotal.toString());
        return newTotal;
      });
    }
    setIsActive(false);
    setTimeLeft(0);
    localStorage.removeItem('studyhub_endTime');
    localStorage.removeItem('studyhub_duration');
  };

  // Timer format (00:00:00)
  const formatTimerDisplay = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Leaderboard format (e.g., 2h 15m 30s)
  const formatLeaderboardDisplay = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // 🏆 LEADERBOARD SORTING LOGIC 🏆
  // We combine your real time with some dummy data to test the sorting
  const myUsername = username || 'ganeshknikam1324';
  const rawLeaderboardData = [
    { name: myUsername, time: totalSecondsStudied, isMe: true },
    { name: 'Physics_Topper', time: 12500, isMe: false }, // Approx 3.5 hours
    { name: 'Chem_Master', time: 7200, isMe: false },     // Exactly 2 hours
    { name: 'MockTest_Pro', time: 1800, isMe: false }     // 30 minutes
  ];

  // Sort from highest time to lowest time
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
              <h2 className="text-6xl font-mono tracking-wider">{formatTimerDisplay(timeLeft)}</h2>
            </div>
            
            {!isActive ? (
              <>
                <div className="flex gap-4">
                  <button onClick={() => startTimer(25)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">25m</button>
                  <button onClick={() => startTimer(50)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">50m</button>
                  <button onClick={() => startTimer(90)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">90m</button>
                </div>
                <button onClick={() => startTimer(25)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold text-lg transition-colors">
                  Start Studying
                </button>
              </>
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
                
                // Assign medals for top 3
                let medal = <span className="w-6 text-center text-slate-500 font-bold">{rank}</span>;
                if (rank === 1) medal = <span className="w-6 text-center text-xl">🥇</span>;
                if (rank === 2) medal = <span className="w-6 text-center text-xl">🥈</span>;
                if (rank === 3) medal = <span className="w-6 text-center text-xl">🥉</span>;

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
                        {student.name} {student.isMe && '(You)'}
                      </span>
                    </div>
                    <span className="font-mono text-sm tracking-wide text-slate-300 bg-black/20 px-2 py-1 rounded">
                      {formatLeaderboardDisplay(student.time)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-slate-500 mt-6">
              *Currently testing offline sorting logic before MongoDB sync
            </p>
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
