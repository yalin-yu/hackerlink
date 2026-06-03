import { useState, useEffect, useRef } from 'react';
import { api } from '../../../api/client';
import type { SoulData } from '../../../api/twin';

interface Props {
  userId: string;
  eventId: string;
  onResults: (results: SoulData[]) => void;
  onGoBack?: () => void;
}

/**
 * [API] TwinDepartureTransition
 *
 * Sends ONE POST /api/twin-search/start (which now waits synchronously until all
 * conversations are done, then returns results directly).
 *
 * Meanwhile plays an 8-step countdown animation. If the API returns before the
 * animation finishes, we wait for the animation to complete before transitioning.
 *
 * F12 Network → filter "twin-search" → single POST request, no polling
 */
export default function TwinDepartureTransition({ userId, eventId, onResults, onGoBack }: Props) {
  const [animStep, setAnimStep] = useState(0);
  const [statusLine, setStatusLine] = useState('waking twins...');
  const [error, setError] = useState('');
  const done = useRef(false);
  const resultsRef = useRef<SoulData[]>([]);
  const maxSteps = 8;

  const STATUS: Record<number, string> = {
    0: 'waking twins...',
    1: 'scanning the room...',
    2: 'reading profiles...',
    3: 'starting conversations...',
    4: 'asking deep questions...',
    5: 'finding resonance...',
    6: 'checking complements...',
    7: 'ranking matches...',
    8: 'almost there...',
  };

  // Start the API call immediately
  useEffect(() => {
    async function search() {
      try {
        const data = await api.post<{ status: string; results: SoulData[] }>(
          '/api/twin-search/start',
          { userId, eventId }
        );
        if (data.results?.length) {
          resultsRef.current = data.results;
          setStatusLine('found ' + data.results.length + ' people!');
        } else {
          setError('no matches found');
        }
      } catch (err: any) {
        setError(err.message?.slice(0, 60) || 'network error');
      }
    }
    search();
  }, [userId, eventId]);

  // Animate independently
  useEffect(() => {
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimStep(step);
      if (!resultsRef.current.length) {
        setStatusLine(STATUS[Math.min(step, maxSteps)] || STATUS[maxSteps]);
      }
      if (step >= maxSteps) {
        clearInterval(timer);
        // After animation + results arrived → transition
        checkDone();
      }
    }, 600);
    return () => clearInterval(timer);
  }, []);

  function checkDone() {
    if (done.current) return;
    if (resultsRef.current.length > 0 && animStep >= maxSteps) {
      done.current = true;
      setTimeout(() => onResults(resultsRef.current), 600);
    }
  }

  // Check whenever animStep updates or results arrive
  useEffect(() => {
    checkDone();
  }, [animStep]);

  // Also check when results arrive (statusLine changes)
  useEffect(() => {
    if (resultsRef.current.length > 0 && animStep >= maxSteps) {
      checkDone();
    }
  }, [statusLine]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-[#FAFAF7] relative">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-sm w-full">
        <div className="relative w-[100px] h-[100px]">
          <div className="absolute inset-0 rounded-full bg-[#2563EB]/10 blur-2xl animate-pulse-glow"></div>
          <svg width="100" height="100" viewBox="0 0 120 120" className="breathing-avatar">
            <defs>
              <filter id="goo-dep">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
            <path d="M60,20 C75,18 88,25 95,40 C102,55 100,72 90,85 C80,98 65,103 50,100 C35,97 22,88 18,73 C14,58 20,42 32,30 C40,22 50,21 60,20 Z" fill="#2563EB" filter="url(#goo-dep)" opacity="0.9" />
            <circle cx="45" cy="50" r="8" fill="#2563EB" opacity="0.6" />
            <circle cx="75" cy="55" r="6" fill="#2563EB" opacity="0.5" />
          </svg>
        </div>

        <div className="text-center">
          <div className="text-[18px] text-[#0A0A0A] mb-1" style={{ fontFamily: "'Inter Tight', 'PingFang SC', sans-serif", fontWeight: 600 }}>
            {error ? '出了点问题' : '分身正在跟所有人聊...'}
          </div>
          <div className="text-[13px] text-[#D97706]" style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}>
            {error || statusLine}
          </div>
        </div>

        {!error && (
          <div className="flex gap-1.5">
            {Array.from({ length: maxSteps + 1 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= animStep ? 'bg-[#2563EB]' : 'bg-[#E8E8E5]'} ${i === animStep ? 'scale-125' : ''}`} />
            ))}
          </div>
        )}

        {error && (
          <button onClick={onGoBack} className="px-4 py-2 border border-[#E8E8E5] rounded-lg text-[13px] text-[#6B6B70] hover:text-[#0A0A0A]" style={{ fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
            ← 返回调整
          </button>
        )}
      </div>

      <style>{`
        @keyframes breathing { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.1); } }
        .breathing-avatar { animation: breathing 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
