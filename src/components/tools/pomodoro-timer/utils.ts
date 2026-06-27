/**
 * Formats a duration in seconds to a human-readable mm:ss format.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Synthesizes a beautiful double-chime bell alarm using the browser's Web Audio API.
 * Avoids the need to bundle or request any external audio assets.
 */
export function playAlarmSound(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    const audioCtx = new AudioCtxClass();
    const now = audioCtx.currentTime;

    const playChime = (time: number, frequency: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, time);

      // Smooth attack and decay envelope
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.25, time + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.7);

      osc.start(time);
      osc.stop(time + 0.7);
    };

    // Beautiful high-register double chime (D5 followed by A5)
    playChime(now, 587.33); // D5
    playChime(now + 0.18, 880.00); // A5
  } catch (error) {
    console.error('Failed to play synthesized alarm sound:', error);
  }
}
