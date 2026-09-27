import { useEffect, useState } from 'react';

interface Props {
  isRecording?: boolean;
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
  theme?: 'teal' | 'red' | 'blue';
}

export const AudioWaveform = ({
  isRecording = false,
  isPlaying = false,
  barCount = 28,
  className = '',
  theme = 'teal',
}: Props) => {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial baseline heights
    const initial = Array.from({ length: barCount }, (_, i) => {
      const mid = barCount / 2;
      const dist = Math.abs(i - mid) / mid;
      return Math.max(12, Math.round((1 - dist * 0.7) * 32));
    });
    setHeights(initial);

    if (!isRecording && !isPlaying) return;

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          const mid = barCount / 2;
          const bellCurve = Math.max(0.2, 1 - (Math.abs(i - mid) / mid) * 0.8);
          const randomFactor = 0.35 + Math.random() * 0.65;
          return Math.round(bellCurve * randomFactor * 72) + 8;
        })
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isRecording, isPlaying, barCount]);

  const colorClass =
    theme === 'red'
      ? isRecording
        ? 'bg-red-500'
        : 'bg-red-300'
      : theme === 'blue'
      ? isRecording
        ? 'bg-blue-600'
        : 'bg-blue-300'
      : isRecording
      ? 'bg-teal-600'
      : 'bg-teal-400';

  return (
    <div
      className={`flex items-center justify-center gap-1.5 h-20 w-full overflow-hidden px-4 ${className}`}
      aria-label="Audio waveform visualizer"
    >
      {heights.map((h, idx) => (
        <span
          key={idx}
          className={`w-1 rounded-full transition-all duration-100 ease-out ${colorClass}`}
          style={{
            height: isRecording || isPlaying ? `${Math.min(h, 68)}px` : '6px',
            opacity: isRecording || isPlaying ? 0.9 : 0.35,
          }}
        />
      ))}
    </div>
  );
};
