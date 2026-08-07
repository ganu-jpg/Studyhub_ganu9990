import { useState, useEffect } from 'react';

export default function VaultTab() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Storage for uploaded items per category
  const [vaultItems, setVaultItems] = useState({});
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  // Load saved vault items from local storage
  useEffect(() => {
    const savedVault = localStorage.getItem('studyhub_vaultItems');
    if (savedVault) {
      setVaultItems(JSON.parse(savedVault));
    }
  }, []);

  const subjects = [
    { name: 'Physics', icon: '⚛️', color: 'from-blue-600 to-blue-400' },
    { name: 'Chemistry', icon: '🧪', color: 'from-emerald-600 to-emerald-400' },
    { name: 'Math', icon: '📐', color: 'from-purple-600 to-purple-400' },
    { name: 'Biology', icon: '🧬', color: 'from-rose-600 to-rose-400' },
    { name: 'Mock Tests', icon: '🎯', color: 'from-orange-600 to-orange-400' }
  ];

  const categories = [
    { name: 'Notes', icon: '📝' },
    { name: 'Formula', icon: '∑' },
    { name: 'Short Notes', icon: '⚡' },
    { name: 'Mind Maps', icon: '🧠' }
  ];

  // Handle File Upload & Point Rewards
  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert("Please enter a title for your notes/PDF!");
      return;
    }

    const key = `${selectedSubject}-${selectedCategory}`;
    const newItem = {
      title: uploadTitle,
      type: uploadFile ? uploadFile.type.includes('pdf') ? 'PDF' : 'Image' : 'Note',
      date: new Date().toLocaleDateString(),
      author: localStorage.getItem('studyhub_username') || 'ganeshknikam1324'
    };

    const updatedVault = {
      ...vaultItems,
      [key]: [...(vaultItems[key] || []), newItem]
    };

    setVaultItems(updatedVault);
    localStorage.setItem('studyhub_vaultItems', JSON.stringify(updatedVault));

    // REWARD POINTS: Add 300 seconds (5 minutes) of study time to their total for contributing!
    const currentTotal = parseInt(localStorage.getItem('studyhub_totalTime') || '0', 10);
    const newTotal = currentTotal + 300; 
    localStorage.setItem('studyhub_totalTime', newTotal.toString());

    setUploadTitle('');
    setUploadFile(null);
    alert("🎉 Upload successful! You earned +5 minutes study time and points for contributing!");
    window.location.reload(); // Refresh to update profile points/level instantly
  };

  const currentKey = `${selectedSubject}-${selectedCategory}`;
  const currentItems = vaultItems[currentKey] || [];

  // View 3: Inside a Subfolder (Shows Upload Form & Shared Files)
  if (selectedSubject && selectedCategory) {
    return (
      <div className="w-full max-w-md animate-fade-in pb-12">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="mb-6 text-slate-400 flex items-center gap-2 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-xl"
        >
          <span>⬅️</span> Back to {selectedSubject}
        </button>
        
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <span className="text-3xl">📁</span> {selectedCategory}
        </h2>
        <p className="text-slate-400 mb-6">{selectedSubject} • Upload notes to earn points!</p>

        {/* Upload Box */}
        <form onSubmit={handleUpload} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mb-8 space-y-4 shadow-lg">
          <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wider">📤 Share Notes or PDF</h3>
          <input 
            type="text" 
            placeholder="Title (e.g., Wave Optics Chapter Notes)" 
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <input 
            type="file" 
            accept="image/*,.pdf"
            onChange={(e) => setUploadFile(e.target.files[0])}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
          />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-sm transition-colors shadow-md">
            Upload & Earn Points 🚀
          </button>
        </form>

        {/* Display Uploaded Files */}
        <h3 className="font-bold text-slate-300 mb-3 text-sm uppercase tracking-wider">📂 Community Materials</h3>
        {currentItems.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
            No materials uploaded here yet. Be the first to share and earn points!
          </div>
        ) : (
          <div className="space-y-3">
            {currentItems.map((item, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Shared by @{item.author} • {item.date}</p>
                </div>
                <span className="bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs px-2.5 py-1 rounded-lg font-bold">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // View 2: Inside a Subject
  if (selectedSubject) {
    return (
      <div className="w-full max-w-md animate-fade-in">
        <button 
          onClick={() => setSelectedSubject(null)}
          className="mb-6 text-slate-400 flex items-center gap-2 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-xl"
        >
          <span>⬅️</span> Back to Vault
        </button>
        
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-3xl">📂</span> {selectedSubject}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-700 hover:border-slate-500 transition-all shadow-lg"
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="font-bold text-slate-200">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // View 1: Main Vault Screen
  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8 pt-4">
        <h2 className="text-3xl font-bold text-white mb-2">My Vault 🗄️</h2>
        <p className="text-slate-400 text-sm">Upload notes & PDFs to earn profile points!</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((sub) => (
          <button
            key={sub.name}
            onClick={() => setSelectedSubject(sub.name)}
            className={`bg-gradient-to-br ${sub.color} p-1 rounded-2xl shadow-lg hover:scale-105 transition-transform`}
          >
            <div className="bg-slate-900/40 w-full h-full p-5 rounded-xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm border border-white/10">
              <span className="text-4xl drop-shadow-md">{sub.icon}</span>
              <span className="font-bold text-white text-sm tracking-wide">{sub.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
