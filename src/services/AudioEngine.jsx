import * as Tone from 'tone';
/**
 * AudioEngine 类：负责处理所有的音频合成与效果逻辑
 * 使用 Tone.js 构建，包含合成器、滤波器、延迟和混响
 */

class AudioEngine {
  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.2,
        release: 0.5
      }
    });

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      Q: 1
    });

    this.reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0.3
    }).toDestination();

    this.delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.2,
      wet: 0.2
    });

    // Chain: Synth -> Filter -> Delay -> Reverb -> Destination
    this.synth.chain(this.filter, this.delay, this.reverb);

    // Initial parameters
    this.currentTimbre = {
      cutoff: 2000,
      q: 1
    };

    // Scale: Pentatonic Major (C4 to C6 roughly)
    this.scale = [
      'C6', 'A5', 'G5', 'E5', 'D5', 'C5', 'A4', 'G4', 'E4', 'D4', 'C4', 'A3', 'G3', 'E3', 'D3', 'C3'
    ];
  }

  /**
   * 更新音色参数 (由 XYPad 调用)
   * @param {number} x - 归一化的 X 轴坐标 (0-1)，映射到共鸣度 Q
   * @param {number} y - 归一化的 Y 轴坐标 (0-1)，映射到截止频率 Cutoff
   */


  // TODO 无法使用mapLin,尝试手写
  updateTimbre(x, y) {
    // x: 0-1 (Q), y: 0-1 (Cutoff)
    const cutoff = Tone.MathUtils.mapLin(y, 0, 1, 100, 8000);
    const q = Tone.MathUtils.mapLin(x, 0, 1, 0.5, 15);
    
    this.currentTimbre = { cutoff, q };
    
    // Real-time update for the global filter
    this.filter.frequency.rampTo(cutoff, 0.05);
    this.filter.Q.rampTo(q, 0.05);
  }

  playNote(noteIndex, timbre, time) {
    const note = this.scale[noteIndex];
    if (!note) return;

    // Apply specific timbre for this note
    if (timbre) {
      this.filter.frequency.setValueAtTime(timbre.cutoff, time);
      this.filter.Q.setValueAtTime(timbre.q, time);
    }

    this.synth.triggerAttackRelease(note, '16n', time);
  }

  start() {
    Tone.start();
    Tone.getTransport().start();
  }

  stop() {
    Tone.getTransport().stop();
  }

  setBpm(bpm) {
    Tone.getTransport().bpm.value = bpm;
  }
}

export const engine = new AudioEngine();
