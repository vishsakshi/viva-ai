import React from 'react';

export default function Avatar({ isSpeaking }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card overflow-hidden h-full min-h-[250px]">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Pulsing rings when speaking */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute -inset-4 rounded-full bg-purple-500/20 animate-pulse" style={{ animationDuration: '1.5s' }} />
          </>
        )}
        
        {/* Avatar Base */}
        <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900 border-2 transition-all duration-300 ${isSpeaking ? 'border-primary-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : 'border-surface-600'}`}>
          <svg className={`w-12 h-12 transition-colors duration-300 ${isSpeaking ? 'text-primary-400' : 'text-surface-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22.5c-5.385 0-9.75-4.365-9.75-9.75s4.365-9.75 9.75-9.75 9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75zm0-1.5a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" />
          </svg>
          
          {/* Speaking indicator (mouth) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
            <div className={`w-1 bg-primary-400 rounded-full transition-all duration-150 ${isSpeaking ? 'h-3 animate-[pulse_0.5s_ease-in-out_infinite]' : 'h-1'}`} />
            <div className={`w-1 bg-primary-400 rounded-full transition-all duration-150 ${isSpeaking ? 'h-4 animate-[pulse_0.7s_ease-in-out_infinite]' : 'h-1'}`} style={{ animationDelay: '0.1s' }} />
            <div className={`w-1 bg-primary-400 rounded-full transition-all duration-150 ${isSpeaking ? 'h-3 animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-1'}`} style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium text-white mb-1">AI Examiner</h3>
        <p className={`text-sm transition-colors duration-300 ${isSpeaking ? 'text-primary-400 font-medium' : 'text-surface-200/50'}`}>
          {isSpeaking ? 'Speaking...' : 'Listening...'}
        </p>
      </div>
    </div>
  );
}
