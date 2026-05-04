import React, { useState, useEffect } from 'react';

export default function QueueLineAnimation() {
  const [queue, setQueue] = useState([
    { id: 1, name: 'User #001', status: 'serving', waitTime: 0 },
    { id: 2, name: 'User #002', status: 'next', waitTime: 2 },
    { id: 3, name: 'User #003', status: 'waiting', waitTime: 4 },
    { id: 4, name: 'User #004', status: 'waiting', waitTime: 6 },
    { id: 5, name: 'User #005', status: 'waiting', waitTime: 8 },
  ]);

  const [servedCount, setServedCount] = useState(0);
  const [avgWaitTime] = useState(4.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        
        // Remove served customer
        newQueue.shift();
        
        // Add new customer at end
        newQueue.push({
          id: Math.random() * 10000,
          name: `User #${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          status: 'waiting',
          waitTime: 8,
        });

        // Update statuses
        newQueue.forEach((person, idx) => {
          if (idx === 0) {
            person.status = 'serving';
            person.waitTime = 0;
          } else if (idx === 1) {
            person.status = 'next';
            person.waitTime = 2;
          } else {
            person.status = 'waiting';
          }
        });

        setServedCount(prev => prev + 1);
        return newQueue;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-violet-900/20 animate-pulse"></div>

      {/* Header Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4 w-full px-4 z-10">
        <div className="bg-violet-900/40 backdrop-blur-md border border-violet-600/50 rounded-lg p-3 text-center hover:bg-violet-900/60 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-violet-300">{queue.length}</div>
          <div className="text-xs text-gray-400 mt-1">In Queue</div>
        </div>
        <div className="bg-green-900/40 backdrop-blur-md border border-green-600/50 rounded-lg p-3 text-center hover:bg-green-900/60 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-green-300">{avgWaitTime}</div>
          <div className="text-xs text-gray-400 mt-1">Avg Wait (min)</div>
        </div>
        <div className="bg-blue-900/40 backdrop-blur-md border border-blue-600/50 rounded-lg p-3 text-center hover:bg-blue-900/60 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-blue-300">{servedCount}</div>
          <div className="text-xs text-gray-400 mt-1">Served Today</div>
        </div>
      </div>

      {/* Counter Window */}
      <div className="relative mb-8 w-full max-w-2xl z-10">
        <div className="flex gap-2 justify-between px-4">
          {/* Window 1 */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-amber-900/80 to-amber-950/80 border-4 border-amber-700 rounded-lg p-4 min-h-24 flex items-center justify-center relative overflow-hidden group hover:border-amber-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-shimmer"></div>
              
              {queue[0] && queue[0].status === 'serving' ? (
                <div className="text-center z-10 relative">
                  <div className="text-4xl animate-bounce mb-2">🙋</div>
                  <div className="text-white font-bold text-sm">{queue[0].name}</div>
                  <div className="text-amber-300 text-xs mt-1">Serving...</div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  <div className="text-3xl mb-2">🪟</div>
                  <div>Counter 1</div>
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center px-2">
            <div className="text-3xl animate-pulse">→</div>
          </div>

          {/* Window 2 */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-slate-700/60 to-slate-800/60 border-4 border-slate-600 rounded-lg p-4 min-h-24 flex items-center justify-center opacity-60">
              <div className="text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">🪟</div>
                <div>Counter 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Line */}
      <div className="relative w-full z-10">
        {/* Queue floor line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-96 h-1 bg-gradient-to-r from-violet-600/30 via-violet-600/70 to-violet-600/30"></div>

        {/* People in queue */}
        <div className="flex flex-col gap-6 px-4 items-center">
          {queue.map((person, idx) => {
            const isServing = person.status === 'serving';
            const isNext = person.status === 'next';
            const fromCounterDistance = (idx + 1) * 60;

            return (
              <div
                key={person.id}
                className={`flex items-end gap-3 transition-all duration-500 ${
                  isServing ? 'scale-110' : ''
                }`}
                style={{
                  animation: isServing ? 'bounce 1s ease-in-out infinite' : 'none',
                }}
              >
                {/* Person avatar */}
                <div
                  className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${
                    isNext
                      ? 'animate-pulse'
                      : ''
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-300 shadow-lg shadow-violet-600/50 ${
                      isServing
                        ? 'bg-gradient-to-br from-green-400 to-green-600 ring-4 ring-green-500 animate-bounce'
                        : isNext
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 ring-4 ring-yellow-500 hover:scale-110'
                        : 'bg-gradient-to-br from-violet-500 to-violet-700 ring-4 ring-violet-600 hover:scale-105'
                    }`}
                  >
                    {idx % 5 === 0 ? '👨' : idx % 5 === 1 ? '👩' : idx % 5 === 2 ? '👨‍💼' : idx % 5 === 3 ? '👩‍💼' : '👤'}
                  </div>

                  {/* Info */}
                  <div className="text-center min-w-max">
                    <div className="text-white font-bold text-sm">{person.name}</div>
                    <div className={`text-xs font-semibold ${
                      isServing
                        ? 'text-green-400'
                        : isNext
                        ? 'text-yellow-400'
                        : 'text-violet-400'
                    }`}>
                      {isServing
                        ? '🚀 Serving'
                        : isNext
                        ? '⏳ Next'
                        : `⏳ ${person.waitTime + idx}m`}
                    </div>
                  </div>

                  {/* Position indicator */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {idx + 1}
                  </div>
                </div>

                {/* Connecting line */}
                {idx < queue.length - 1 && (
                  <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-violet-600/50 to-violet-400/30 mx-2"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile view - vertical stack */}
        <div className="md:hidden flex flex-col gap-4 mt-8 px-4">
          {queue.map((person, idx) => (
            <div
              key={person.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                person.status === 'serving'
                  ? 'bg-green-900/30 border-green-600/60 ring-2 ring-green-500/50'
                  : person.status === 'next'
                  ? 'bg-yellow-900/30 border-yellow-600/60 ring-2 ring-yellow-500/50'
                  : 'bg-violet-900/20 border-violet-600/40'
              }`}
            >
              <div className="text-3xl">{idx % 5 === 0 ? '👨' : idx % 5 === 1 ? '👩' : idx % 5 === 2 ? '👨‍💼' : idx % 5 === 3 ? '👩‍💼' : '👤'}</div>
              <div className="flex-1">
                <div className="font-bold text-white">{person.name}</div>
                <div className="text-sm text-gray-400">Position: {idx + 1}</div>
              </div>
              <div className={`font-bold ${
                person.status === 'serving'
                  ? 'text-green-400'
                  : person.status === 'next'
                  ? 'text-yellow-400'
                  : 'text-violet-400'
              }`}>
                {person.status === 'serving' ? '🚀' : person.status === 'next' ? '⏳' : `${person.waitTime + idx}m`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
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
