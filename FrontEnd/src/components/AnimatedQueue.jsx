import React, { useState, useEffect } from 'react';

export default function AnimatedQueue() {
  const [queue, setQueue] = useState([
    { id: 1, status: 'serving', position: 0 },
    { id: 2, status: 'waiting', position: 1 },
    { id: 3, status: 'waiting', position: 2 },
    { id: 4, status: 'waiting', position: 3 },
    { id: 5, status: 'waiting', position: 4 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        // Move serving person to the end and mark as done
        const serving = newQueue.shift();
        serving.status = 'done';
        newQueue.push(serving);

        // Update positions
        newQueue.forEach((item, idx) => {
          item.position = idx;
          if (idx === 0) {
            item.status = 'serving';
          } else {
            item.status = 'waiting';
          }
        });

        return newQueue;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'serving':
        return 'from-green-500 to-green-600';
      case 'waiting':
        return 'from-violet-500 to-violet-600';
      case 'done':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-violet-500 to-violet-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'serving':
        return '🚀 Serving';
      case 'waiting':
        return '⏳ Waiting';
      case 'done':
        return '✓ Done';
      default:
        return '⏳';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-violet-900/20 animate-pulse"></div>

      {/* Counter Display */}
      <div className="mb-8 text-center z-10">
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600 animate-pulse">
          {queue.filter(q => q.status === 'done').length} Served
        </div>
        <p className="text-violet-300 mt-2 text-sm">Today</p>
      </div>

      {/* Queue Visualization - Horizontal Timeline */}
      <div className="relative w-full mb-12 z-10">
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/30 via-violet-600/60 to-violet-600/30 transform -translate-y-1/2"></div>

        {/* Queue items */}
        <div className="flex justify-between items-center px-4">
          {queue.map((item, idx) => (
            <div
              key={item.id}
              className={`flex flex-col items-center transition-all duration-500 ${
                item.status === 'done' ? 'opacity-40' : 'opacity-100'
              }`}
              style={{
                animation:
                  item.status === 'serving'
                    ? 'bounce 0.8s ease-in-out infinite'
                    : 'none',
              }}
            >
              {/* Person circle */}
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${getStatusColor(
                  item.status
                )} shadow-lg shadow-violet-600/50 flex items-center justify-center text-2xl font-bold text-white mb-3 transition-all duration-300 hover:scale-110 cursor-pointer z-20 relative`}
              >
                #{item.id}
              </div>

              {/* Status label */}
              <div className="text-xs font-semibold text-violet-300 whitespace-nowrap">
                {getStatusLabel(item.status)}
              </div>

              {/* Position number */}
              {item.status !== 'done' && (
                <div className="text-tiny text-gray-400 mt-1">
                  Pos: {idx + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Animated waiting indicator */}
      <div className="flex items-center gap-2 z-10">
        <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse delay-100"></div>
        <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Stats bar */}
      <div className="mt-8 grid grid-cols-3 gap-4 w-full px-4 z-10">
        <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/50 rounded-lg p-3 text-center hover:bg-violet-900/50 transition-all duration-300">
          <div className="text-2xl font-bold text-violet-400">
            {queue.filter(q => q.status === 'waiting').length}
          </div>
          <div className="text-xs text-gray-400">Waiting</div>
        </div>
        <div className="bg-green-900/30 backdrop-blur-sm border border-green-700/50 rounded-lg p-3 text-center hover:bg-green-900/50 transition-all duration-300">
          <div className="text-2xl font-bold text-green-400">1</div>
          <div className="text-xs text-gray-400">Serving</div>
        </div>
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-center hover:bg-gray-800/50 transition-all duration-300">
          <div className="text-2xl font-bold text-gray-400">
            {queue.filter(q => q.status === 'done').length}
          </div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
