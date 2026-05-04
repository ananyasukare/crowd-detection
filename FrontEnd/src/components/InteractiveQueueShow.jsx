import React, { useState, useEffect } from 'react';

export default function InteractiveQueueShow() {
  const [queue, setQueue] = useState([
    { id: 1, name: 'User #001', status: 'serving', waitTime: 0, mood: '😊' },
    { id: 2, name: 'User #002', status: 'next', waitTime: 2, mood: '😊' },
    { id: 3, name: 'User #003', status: 'waiting', waitTime: 4, mood: '😐' },
    { id: 4, name: 'User #004', status: 'waiting', waitTime: 6, mood: '😐' },
    { id: 5, name: 'User #005', status: 'waiting', waitTime: 8, mood: '😐' },
  ]);

  const [servedCount, setServedCount] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [particles, setParticles] = useState([]);
  const [avgWaitTime, setAvgWaitTime] = useState(4.5);

  // Auto-move queue
  useEffect(() => {
    const interval = setInterval(() => {
      handleServe();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update average wait time
  useEffect(() => {
    const times = queue.filter(q => q.status !== 'serving').map(q => q.waitTime);
    if (times.length > 0) {
      setAvgWaitTime((times.reduce((a, b) => a + b) / times.length).toFixed(1));
    }
  }, [queue]);

  const handleServe = () => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      newQueue.shift();

      // Add new person
      newQueue.push({
        id: Math.random() * 100000,
        name: `User #${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        status: 'waiting',
        waitTime: 8,
        mood: '😐',
      });

      // Update statuses
      newQueue.forEach((person, idx) => {
        if (idx === 0) {
          person.status = 'serving';
          person.waitTime = 0;
          person.mood = '😊';
          createExplosion(idx);
        } else if (idx === 1) {
          person.status = 'next';
          person.waitTime = 2;
          person.mood = '😊';
        } else {
          person.status = 'waiting';
          person.mood = '😐';
        }
      });

      setServedCount(prev => prev + 1);
      return newQueue;
    });
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const newQueue = [...queue];
    [newQueue[index], newQueue[index - 1]] = [newQueue[index - 1], newQueue[index]];
    setQueue(newQueue);
    createExplosion(index - 1);
  };

  const createExplosion = (index) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Math.random(),
      x: Math.cos((i / 8) * Math.PI * 2) * 50,
      y: Math.sin((i / 8) * Math.PI * 2) * 50,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  const getPersonEmoji = (id) => {
    const emojis = ['👨', '👩', '👨‍💼', '👩‍💼', '👤', '🧑', '👶', '👴'];
    return emojis[id % emojis.length];
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black/20">
      {/* Ambient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-transparent to-violet-900/10 animate-pulse"></div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6 z-10">
        <div className="group bg-violet-900/40 backdrop-blur-md border border-violet-600/60 rounded-lg p-3 text-center hover:bg-violet-900/70 transition-all duration-300 hover:scale-110 cursor-pointer">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-300 to-violet-500 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
            {queue.length}
          </div>
          <div className="text-xs text-gray-300 mt-1">👥 In Queue</div>
        </div>

        <div className="group bg-yellow-900/40 backdrop-blur-md border border-yellow-600/60 rounded-lg p-3 text-center hover:bg-yellow-900/70 transition-all duration-300 hover:scale-110 cursor-pointer">
          <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
            {avgWaitTime}
          </div>
          <div className="text-xs text-gray-300 mt-1">⏱️ Wait (min)</div>
        </div>

        <div className="group bg-green-900/40 backdrop-blur-md border border-green-600/60 rounded-lg p-3 text-center hover:bg-green-900/70 transition-all duration-300 hover:scale-110 cursor-pointer">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
            {servedCount}
          </div>
          <div className="text-xs text-gray-300 mt-1">✅ Served</div>
        </div>
      </div>

      {/* Service Counter */}
      <div className="relative mb-8 w-full max-w-3xl z-10">
        <div className="flex gap-3 justify-between px-2">
          {/* Active Counter */}
          <div className="flex-1">
            <div className="relative bg-gradient-to-b from-amber-800 to-amber-950 border-4 border-amber-600 rounded-xl p-4 min-h-32 flex flex-col items-center justify-center group hover:border-amber-500 transition-all duration-300 shadow-2xl shadow-amber-900/50 overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer"></div>

              {/* Particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                  style={{
                    left: '50%',
                    top: '40%',
                    animation: `float 0.6s ease-out forwards`,
                    '--tx': `${p.x}px`,
                    '--ty': `${p.y}px`,
                  }}
                />
              ))}

              <div className="text-center z-20 relative">
                {queue[0] && (
                  <>
                    <div className="text-5xl animate-bounce mb-3">{getPersonEmoji(queue[0].id)}</div>
                    <div className="text-white font-bold text-sm">{queue[0].name}</div>
                    <div className="text-amber-300 text-xs mt-2 font-semibold">🚀 SERVING NOW</div>
                    <div className="text-amber-200/70 text-xs mt-1">{queue[0].mood}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center px-3">
            <div className="text-3xl animate-pulse">→</div>
          </div>

          {/* Closed Counter */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-slate-700/40 to-slate-800/40 border-4 border-slate-600/40 rounded-xl p-4 min-h-32 flex items-center justify-center opacity-50">
              <div className="text-center text-gray-500 text-sm">
                <div className="text-3xl mb-2">🪟</div>
                <div className="text-xs">Counter 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Queue Display */}
      <div className="w-full max-w-3xl z-10 bg-gradient-to-b from-violet-900/20 to-transparent rounded-2xl p-6 border border-violet-700/30">
        <div className="space-y-4">
          {queue.map((person, idx) => (
            <div
              key={person.id}
              className={`group relative transition-all duration-300 cursor-pointer transform ${
                hoveredId === person.id ? 'scale-105' : 'scale-100'
              }`}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleMoveUp(idx)}
            >
              {/* Main card */}
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-300 shadow-lg backdrop-blur-sm ${
                  person.status === 'serving'
                    ? 'bg-green-900/40 border-green-500/80 shadow-green-700/50'
                    : person.status === 'next'
                    ? 'bg-yellow-900/40 border-yellow-500/80 shadow-yellow-700/50'
                    : 'bg-violet-900/30 border-violet-500/50 shadow-violet-700/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`relative text-4xl p-3 rounded-xl transition-all duration-300 ${
                      person.status === 'serving'
                        ? 'bg-green-500/30 ring-2 ring-green-400 animate-bounce'
                        : person.status === 'next'
                        ? 'bg-yellow-500/30 ring-2 ring-yellow-400 animate-pulse'
                        : 'bg-violet-500/30 ring-2 ring-violet-400 hover:ring-violet-300'
                    }`}
                  >
                    {getPersonEmoji(person.id)}

                    {/* Position badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-red-400">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-lg ${
                        person.status === 'serving'
                          ? 'text-green-100'
                          : person.status === 'next'
                          ? 'text-yellow-100'
                          : 'text-violet-100'
                      }`}>{person.name}</p>
                      <span className="text-2xl">{person.mood}</span>
                    </div>

                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        person.status === 'serving'
                          ? 'bg-green-500/40 text-green-300'
                          : person.status === 'next'
                          ? 'bg-yellow-500/40 text-yellow-300'
                          : 'bg-violet-500/40 text-violet-300'
                      }`}>
                        {person.status === 'serving'
                          ? '🚀 Serving'
                          : person.status === 'next'
                          ? '⏳ Next'
                          : `⏳ ${person.waitTime + idx}m`}
                      </span>
                      
                      {person.status === 'next' && (
                        <span className="text-xs px-2 py-1 bg-blue-500/40 text-blue-300 rounded-full animate-pulse">
                          ⚡ Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className={`flex gap-2 transition-all duration-300 ${
                    hoveredId === person.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {idx > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveUp(idx);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-all duration-200 active:scale-95 font-bold"
                      >
                        ↑ Move
                      </button>
                    )}

                    {idx === 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServe();
                        }}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-all duration-200 active:scale-95 font-bold"
                      >
                        ✓ Done
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      person.status === 'serving'
                        ? 'bg-gradient-to-r from-green-500 to-green-400 w-full'
                        : person.status === 'next'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 w-3/4 animate-pulse'
                        : 'bg-gradient-to-r from-violet-500 to-violet-400'
                    }`}
                    style={{
                      width: person.status === 'serving' ? '100%' : person.status === 'next' ? '75%' : `${50 + idx * 10}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={handleServe}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-green-700/50 hover:shadow-green-600/80"
          >
            🚀 Next Customer
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes float {
          to {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
}
