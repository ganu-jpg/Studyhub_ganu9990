import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProfileTab from '../components/ProfileTab';
import VaultTab from '../components/VaultTab';

const calculateLevel = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const h = Math.floor(totalSeconds / 3600);

  if (h >= 200) return 13 + Math.floor((h - 200) / 50);
  if (h >= 150) return 12;
  if (h >= 100) return 11;
  if (h >= 70) return 10;
  if (h >= 50) return 9;
  if (h >= 30) return 8;
  if (h >= 20) return 7;
  if (h >= 12) return 6;
  if (h >= 6) return 5;
  if (h >= 3) return 4;
  if (h >= 1) return 3;
  if (m >= 30) return 2;
  if (m >= 5) return 1;

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
    { name: 'Vault', icon: '📚' },
    { name: 'Doubts', icon: '💬' },
    { name: 'Ranks', icon: '🏆' },
    { name: 'Profile', icon: '👤' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('studyhub_username');
    if (savedUser) setUsername(savedUser);

    const savedTotal = localStorage.getItem('studyhub_totalTime');

    if (savedTotal) {
      setTotalSecondsStudied(parseInt(savedTotal, 10));
    }

    const sessionStartTime =
      localStorage.getItem('studyhub_startTime');

    if (sessionStartTime) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(sessionStartTime, 10)) / 1000
      );

      setActiveTime(Math.max(0, elapsed));
      setIsActive(true);
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
    if (activeTime > 0) {
      setTotalSecondsStudied((previous) => {
        const newTotal = previous + activeTime;

        localStorage.setItem(
          'studyhub_totalTime',
          newTotal.toString()
        );

        return newTotal;
      });
    }

    setIsActive(false);
    setActiveTime(0);
    localStorage.removeItem('studyhub_startTime');
  };

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatStudyTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const myUsername =
    username || 'ganeshknikam1324';

  const level =
    calculateLevel(totalSecondsStudied);

  const dailyGoal = 3 * 60 * 60;
  const todayProgress = Math.min(
    100,
    Math.round(
      (totalSecondsStudied / dailyGoal) * 100
    )
  );

  return (
    <>
      <Head>
        <title>StudyHub 📚</title>
        <meta
          name="description"
          content="StudyHub — your MHT-CET study companion"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 text-slate-900">

        {/* HEADER */}

        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">

          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                StudyHub 📚
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Your MHT-CET study companion
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-2 shadow-sm">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-black text-white">
                {myUsername.charAt(0).toUpperCase()}
              </div>

              <span className="hidden text-sm font-bold text-slate-700 sm:block">
                @{myUsername}
              </span>

            </div>

          </div>

        </header>

        {/* MAIN */}

        <main className="mx-auto max-w-5xl px-4 pb-32 pt-6">

          {/* HERO */}

          {activeTab === 'Profile' && (
            <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8">

              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                <div>

                  <p className="mb-2 text-sm font-medium text-indigo-100">
                    Welcome back 👋
                  </p>

                  <h2 className="text-3xl font-black sm:text-4xl">
                    @{myUsername}
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    Keep going. Your next level is waiting! 🚀
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-md">
                    <p className="text-xs text-indigo-100">
                      LEVEL
                    </p>
                    <p className="text-3xl font-black">
                      {level}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-md">
                    <p className="text-xs text-indigo-100">
                      TARGET
                    </p>
                    <p className="text-lg font-black">
                      MHT-CET
                    </p>
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* QUICK STATS */}

          {activeTab === 'Profile' && (
            <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-3xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 text-2xl">🔥</div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Streak
                </p>
                <p className="mt-1 text-2xl font-black text-orange-500">
                  0 days
                </p>
              </div>

              <div className="rounded-3xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 text-2xl">⭐</div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  XP
                </p>
                <p className="mt-1 text-2xl font-black text-indigo-600">
                  {totalSecondsStudied}
                </p>
              </div>

              <div className="rounded-3xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 text-2xl">⏱️</div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Study
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-500">
                  {formatStudyTime(totalSecondsStudied)}
                </p>
              </div>

              <div className="rounded-3xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 text-2xl">🎯</div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Progress
                </p>
                <p className="mt-1 text-2xl font-black text-purple-600">
                  {todayProgress}%
                </p>
              </div>

            </section>
          )}

          {/* TODAY'S PROGRESS */}

          {activeTab === 'Profile' && (
            <section className="mb-6 rounded-[28px] border border-indigo-100 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                    Today's Goal
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Make today count 🎯
                  </h3>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                  <span className="text-lg font-black text-indigo-600">
                    {todayProgress}%
                  </span>
                </div>

              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                  style={{
                    width: `${todayProgress}%`
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs font-semibold text-slate-400">
                <span>
                  {formatStudyTime(totalSecondsStudied)}
                </span>
                <span>
                  Goal: 3h
                </span>
              </div>

            </section>
          )}

          {/* TIMER */}

          {activeTab === 'Timer' && (
            <section className="mx-auto max-w-2xl">

              <div className="mb-5 text-center">

                <p className="text-sm font-bold uppercase tracking-widest text-indigo-500">
                  Focus Mode
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  Time to study ⚡
                </h2>

              </div>

              <div className="rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-600 p-1 shadow-2xl shadow-indigo-200">

                <div className="rounded-[29px] bg-white p-8 text-center sm:p-12">

                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                    Current Session
                  </p>

                  <div className="my-8 text-6xl font-black tracking-widest text-slate-900 sm:text-7xl">
                    {formatTimer(activeTime)}
                  </div>

                  {!isActive ? (
                    <button
                      onClick={startTimer}
                      className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-lg font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      ▶ Start Studying
                    </button>
                  ) : (
                    <button
                      onClick={stopAndSaveTime}
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-lg font-black text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      ■ Stop & Save
                    </button>
                  )}

                </div>

              </div>

            </section>
          )}

          {/* VAULT */}

          {activeTab === 'Vault' && (
            <VaultTab />
          )}

          {/* DOUBTS */}

          {activeTab === 'Doubts' && (
            <section className="mx-auto max-w-xl rounded-[32px] border border-purple-100 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-50 text-4xl">
                💬
              </div>

              <h2 className="text-3xl font-black">
                Doubts
              </h2>

              <p className="mt-2 text-slate-500">
                Your doubt-solving system is coming soon.
              </p>

            </section>
          )}

          {/* RANKS */}

          {activeTab === 'Ranks' && (
            <section className="mx-auto max-w-2xl">

              <div className="mb-6 text-center">

                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 text-3xl">
                  🏆
                </div>

                <h2 className="text-3xl font-black">
                  Leaderboard
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Compete. Study. Improve.
                </p>

              </div>

              <div className="rounded-[28px] border border-indigo-100 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-5">

                  <div className="flex items-center gap-4">

                    <span className="text-3xl">
                      🥇
                    </span>

                    <div>
                      <p className="font-black text-slate-900">
                        @{myUsername}
                      </p>

                      <p className="text-xs text-slate-500">
                        Your current ranking
                      </p>
                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-xs font-black text-indigo-600">
                      LEVEL {level}
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {formatStudyTime(totalSecondsStudied)}
                    </p>

                  </div>

                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-400">
                  🌎 Global rankings will be connected when the backend is added.
                </div>

              </div>

            </section>
          )}

          {/* PROFILE */}

          {activeTab === 'Profile' && (
            <section className="mt-6">

              <ProfileTab
                username={myUsername}
                totalSecondsStudied={totalSecondsStudied}
              />

            </section>
          )}

        </main>

        {/* BOTTOM NAVIGATION */}

        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-3 pb-3">

          <div className="flex items-center justify-around rounded-[25px] border border-white/80 bg-white/90 p-2 shadow-2xl shadow-slate-300/50 backdrop-blur-xl">

            {navTabs.map((tab) => {

              const active =
                activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex min-w-[58px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >

                  <span className="text-xl">
                    {tab.icon}
                  </span>

                  <span className="text-[10px] font-black">
                    {tab.name}
                  </span>

                </button>
              );
            })}

          </div>

        </nav>

      </div>
    </>
  );
            }
