let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const melody = [
      { freq: 523.25, start: 0, dur: 0.12 },
      { freq: 659.25, start: 0.1, dur: 0.12 },
      { freq: 783.99, start: 0.2, dur: 0.12 },
      { freq: 1046.5, start: 0.3, dur: 0.25 },
      { freq: 783.99, start: 0.5, dur: 0.1 },
      { freq: 1046.5, start: 0.58, dur: 0.35 },
    ];

    melody.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.01);
    });
  } catch {
    // Audio not supported
  }
}
