import React, { useEffect, useRef } from 'react';

/**
 * AI Examiner Video Avatar with synchronized playback and subtitles.
 * 
 * Features:
 * - Plays a video only when the AI is speaking
 * - Resets the video to the beginning for each new question
 * - Pauses immediately when speaking finishes
 * - Displays the question as subtitles while speaking
 */

export default function Avatar({ isSpeaking, questionText }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking) {
        // Reset to beginning and play
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log('Video autoplay prevented:', e));
      } else {
        // Pause immediately when not speaking
        videoRef.current.pause();
      }
    }
  }, [isSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card overflow-hidden h-full min-h-[280px]">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center">
        {/* Speaking aura */}
        {isSpeaking && (
          <div className="absolute inset-0 ring-4 ring-primary-500/30 rounded-xl transition-all duration-300" />
        )}

        {/* Video Element (Replace src with your actual video file) */}
        <video
          ref={videoRef}
          src="/teacher.mp4"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-80 grayscale-[30%]'}`}
          loop
          muted
          playsInline
        />

        {/* Fallback avatar if video fails/is missing */}
        <p className="z-0 text-surface-200/20 text-xs italic absolute">
          (teacher.mp4 missing)
        </p>

        {/* Subtitles Overlay */}
        {isSpeaking && questionText && (
          <div className="absolute bottom-4 left-4 right-4 z-10 animate-fade-in">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 text-center">
              <p className="text-white text-sm md:text-base font-medium drop-shadow-md leading-snug">
                {questionText}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-white mb-0.5">AI Examiner</h3>
        <p className={`text-sm transition-colors duration-300 ${isSpeaking ? 'text-primary-400 font-medium' : 'text-surface-200/50'}`}>
          {isSpeaking ? (
            <span className="flex items-center justify-center gap-2">
              <span className="flex gap-0.5 items-end">
                <span className="w-1 h-2.5 bg-primary-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
                <span className="w-1 h-3.5 bg-primary-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 h-2.5 bg-primary-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 h-4 bg-primary-400 rounded-full animate-[pulse_0.45s_ease-in-out_infinite]" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 h-2 bg-primary-400 rounded-full animate-[pulse_0.55s_ease-in-out_infinite]" style={{ animationDelay: '0.25s' }} />
              </span>
              Speaking...
            </span>
          ) : 'Listening...'}
        </p>
      </div>
    </div>
  );
}
