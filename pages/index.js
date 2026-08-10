import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProfileTab from '../components/ProfileTab';
import VaultTab from '../components/VaultTab';

const calculateLevel = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalSeconds / 3600);

  if (hours >= 200) return 13 + Math.floor((hours - 200) / 50);
  if (hours >= 150) return 12;
  if (hours >= 100) return 11;
  if (hours >= 70) return 10;
  if (hours >= 50) return 9;
  if (hours >= 30) return 8;
  if (hours >= 20) return 7;
  if (hours >= 12) return 6;
  if (hours >= 6) return 5;
  if (hours >= 3) return 4;
  if (hours >= 1) return 3;
  if (minutes >= 30) return 2;
  if (minutes >= 5) return 1;

  return 0;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [activeTime, setActiveTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  const [totalSecondsStudied, setTotalSecondsStudied] = useState(0);

  const navTabs = [
    { name: 'Timer', icon: '⏱️' },
    { name: 'Vault', icon: '📁' },
    { name: 'Doubts', icon: '💬' },
    { name: 'Ranks', icon: '🏆' },
    { name: 'Profile', icon: '👤' }
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedUser = localStorage.getItem('studyhub_username');
    if (savedUser) {
      setUsername(savedUser);
    }

    const savedTotal = localStorage.getItem('studyhub_totalTime');

    if (savedTotal) {
      const parsedTotal = parseInt(savedTotal, 10);

      if (!Number.isNaN(parsedTotal)) {
        setTotalSecondsStudied(parsedTotal);
      }
    }

    const sessionStartTime = localStorage.getItem('studyhub_startTime');

    if (sessionStartTime) {
      const start = parseInt(sessionStartTime, 10);

      if (!Number.isNaN(start)) {
        const elapsed = Math.floor(
          (Date.now() - start) / 1000
        );

        setActiveTime(Math.max(0, elapsed));
        setIsActive(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setActiveTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = () => {
    const now = Date.now();

    setIsActive(true);
    localStorage.setItem(
      'studyhub_startTime',
      now.toString()
    );
  };

  const stopAndSaveTime = () => {
    if (activeTime <= 0) {
      setIsActive(false);
      localStorage.removeItem('studyhub_startTime');
      return;
    }

    setTotalSecondsStudied((previous) => {
      const newTotal = previous + activeTime;

      localStorage.setItem(
        'studyhub_totalTime',
        newTotal.toString()
      );

      return newTotal;
    });

    setIsActive(false);
    setActiveTime(0);

    localStorage.removeItem('studyhub_startTime');
  };

  const formatTimerDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const formatStudyTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
  };

  const myUsername =
    username || 'ganeshknikam1324';

  const currentLevel =
    calculateLevel(totalSecondsStudied);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      <Head>
        <title>StudyHub 📚</title>
        <meta
          name="description"
          content="StudyHub — your personal MHT-CET study dashboard"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">

          <div>
            <h1 className="text-xl font-black tracking-tight">
              StudyHub 📚
            </h1>

            <p className="text-xs text-slate-500">
              MHT-CET Study Dashboard
            </p>
          </div>

          <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
            @{myUsername}
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6">

        {/* QUICK STATS */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Level
            </p>
            <p className="mt-1 text-2xl font-black text-yellow-400">
              {currentLevel}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Study Time
            </p>
            <p className="mt-1 text-lg font-black text-emerald-400">
              {formatStudyTime(totalSecondsStudied)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Target
            </p>
            <p className="mt-1 text-lg font-black text-indigo-400">
              MHT-CET
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Status
            </p>
            <p className="mt-1 text-lg font-black">
              {isActive ? '🟢 Studying' : '⚪ Ready'}
            </p>
          </div>

        </section>

        {/* TIMER */}
        {activeTab === 'Timer' && (
          <section className="mx-auto w-full max-w-xl">

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center shadow-xl sm:p-10">

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Current Study Session
              </p>

              <div className="mb-8 text-5xl font-black tracking-wider text-white sm:text-7xl">
                {formatTimerDisplay(activeTime)}
              </div>

              {!isActive ? (
                <button
                  onClick={startTimer}
                  className="w-full rounded-2xl bg-indigo-600 py-4 text-lg font-black transition hover:bg-indigo-500 active:scale-[0.98]"
                >
                  ▶ Start Studying
                </button>
              ) : (
                <button
                  onClick={stopAndSaveTime}
                  className="w-full rounded-2xl bg-emerald-600 py-4 text-lg font-black transition hover:bg-emerald-500 active:scale-[0.98]"
                >
                  ■ Stop & Save
                </button>
              )}

            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm font-bold text-slate-300">
                💡 Study Tip
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Start the timer when you begin studying and
                stop it when your session is finished.
              </p>
            </div>

          </section>
        )}

        {/* VAULT */}
        {activeTab === 'Vault' && (
          <VaultTab />
        )}

        {/* DOUBTS */}
        {activeTab === 'Doubts' && (
          <section className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">

            <div className="mb-4 text-5xl">
              💬
            </div>

            <h2 className="text-2xl font-black">
              Doubts
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your doubt-solving system will be added in V1.
            </p>

          </section>
        )}

        {/* RANKS */}
        {activeTab === 'Ranks' && (
          <section className="mx-auto max-w-xl">

            <h2 className="mb-5 text-center text-2xl font-black">
              🏆 Leaderboard
            </h2>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

              <div className="flex items-center justify-between rounded-2xl border border-indigo-500/30 bg-indigo-600/20 p-4">

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    🥇
                  </span>

                  <div>
                    <p className="font-black">
                      @{myUsername}
                    </p>

                    <p className="text-xs text-slate-400">
                      Your current position
                    </p>
                  </div>

                </div>

                <div className="text-right">

                  <p className="text-xs font-bold text-yellow-400">
                    LEVEL {currentLevel}
                  </p>

                  <p className="mt-1 font-mono text-sm text-slate-300">
                    {formatStudyTime(totalSecondsStudied)}
                  </p>

                </div>

              </div>

              <p className="mt-4 text-center text-xs text-slate-600">
                Multiplayer rankings will be connected to MongoDB later in V1.
              </p>

            </div>

          </section>
        )}

        {/* PROFILE */}
        {activeTab === 'Profile' && (
          <ProfileTab
            username={myUsername}
            totalSecondsStudied={totalSecondsStudied}
          />
        )}

      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-3xl -translate-x-1/2 border-t border-slate-800 bg-slate-950/95 px-2 pb-3 pt-2 backdrop-blur-xl">

        <div className="mx-auto flex max-w-xl justify-around">

          {navTabs.map((tab) => {

            const active = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex min-w-[58px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >

                <span className="text-xl">
                  {tab.icon}
                </span>

                <span className="text-[10px] font-bold">
                  {tab.name}
                </span>

              </button>
            );
          })}

        </div>

      </nav>

    </div>
  );
}
