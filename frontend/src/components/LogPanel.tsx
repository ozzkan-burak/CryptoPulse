import { memo } from 'react';

interface LogPanelProps {
  logs: string[];
}

export const LogPanel = memo(({ logs }: LogPanelProps) => {
  return (
    <div className="mt-8 bg-black border border-gray-800 rounded-xl p-4 font-mono text-xs overflow-hidden">
      <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-2">
        <span className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">
          System Stream Logs
        </span>
        <span className="text-gray-600 italic">Auto-cleaning (last 10)</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-gray-600">
              [{new Date().toLocaleTimeString()}]
            </span>
            <span className="text-emerald-500">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
