import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Timer');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');

  // Load user and check for a saved timer when the app opens
  useEffect(() => {
    const savedUser = localStorage.getItem('studyhub_username');
    if (savedUser) setUsername(savedUser);

    const savedEndTime = localStorage.getItem('studyhub_endTime');
    if (savedEndTime) {
      const now = new Date().getTime();
      const endTime = parseInt(savedEndTime, 10);
      if (endTime > now) {
        setTimeLeft(Math.floor((endTime - now) / 1000));
        setIsActive(true);
      } else {
        localStorage.removeItem('studyhub_endTime');
      }
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      localStorage.removeItem('studyhub_endTime');
      saveSessionToDatabase(); // Timer hit 0, save to DB!
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const saveSessionToDatabase = async () => {
    // This will send the completed time to your MongoDB Leaderboard
    console.log("Session saved to database!");
    alert("Session complete! Time logged to the Leaderboard.");
  };

  const startTimer = (minutes) => {
    const seconds = minutes * 60;
    const endTime = new Date().getTime() + seconds * 1000;
    
    setTimeLeft(seconds);
    setIsActive(true);
    localStorage.setItem('studyhub_endTime', endTime.toString());
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Head>
        <title>StudyHub</title>
      </Head>

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-xl font-bold">StudyHub 📚</h1>
        <div className="text-sm text-slate-300">
          @{username || 'ganeshknikam1324'} 🛡️
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {activeTab === 'Timer' && (
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="bg-slate-800 p-8 rounded-2xl w-full text-center shadow-lg">
              <h2 className="text-6xl font-mono tracking-wider">{formatTime(timeLeft)}</h2>
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
                onClick={() => {
                  setIsActive(false);
                  setTimeLeft(0);
                  localStorage.removeItem('studyhub_endTime');
                }} 
                className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                Cancel Session
              </button>
            )}
          </div>
        )}

        {activeTab === 'Ranks' && (
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
            <p className="text-slate-400">Sessions are logged here after the timer hits zero!</p>
          </div>
        )}

        {(activeTab === 'Vault' || activeTab === 'Doubts') && (
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
            <p className="text-slate-400">We will build this section next!</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-slate-800 p-4 flex justify-around items-center rounded-t-2xl">
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
