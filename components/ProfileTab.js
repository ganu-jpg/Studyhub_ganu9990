export default function ProfileTab({ username, totalSecondsStudied }) {
  
  // Custom Level Calculator
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

  // Format Time display
  const formatLeaderboardDisplay = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const currentLevel = calculateLevel(totalSecondsStudied);
  const displayUsername = username || 'ganeshknikam1324';

  return (
    <div className="w-full max-w-md">
      
      {/* Top Section: Photo, Name, and Level */}
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="w-28 h-28 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-5xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] mb-4 border-4 border-slate-800">
          {displayUsername.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-bold text-white mb-1">@{displayUsername} 🛡️</h2>
        <p className="text-slate-400 text-sm mb-4">Class 12 • K.B. Patil School, Sakora</p>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-6 py-2 rounded-full font-black text-xl shadow-[0_0_15px_rgba(234,179,8,0.15)] flex items-center gap-2">
          <span>⭐</span> LEVEL {currentLevel}
        </div>
      </div>

      {/* Middle Section: Lifetime Study Hours */}
      <div className="bg-slate-800/80 p-6 rounded-3xl shadow-lg border border-slate-700/50 text-center mb-6 backdrop-blur-sm">
        <p className="text-sm text-slate-400 uppercase tracking-widest mb-2 font-medium">Lifetime Study Time</p>
        <p className="text-5xl font-mono font-bold text-emerald-400 tracking-tight">
          {formatLeaderboardDisplay(totalSecondsStudied)}
        </p>
      </div>
        
      {/* Bottom Section: Target & Subjects */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Target Exam</p>
            <p className="font-bold text-indigo-300 text-lg">MHT-CET</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Focus</p>
            <div className="flex gap-1">
              <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded text-xs">⚛️ Phy</span>
              <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded text-xs">🧪 Chem</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
