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



  updateTimbre(x, y) {
    // 手动映射数值 (避免 Tone.MathUtils 报错)
    // 公式: value * (max - min) + min
    const cutoff = y * (8000 - 100) + 100; // Y轴对应频率: 100Hz - 8000Hz
    const q = x * (15 - 0.5) + 0.5;        // X轴对应共振: 0.5 - 15

    // 更新当前音色缓存 (用于新音符的录入)
    this.currentTimbre = { cutoff, q };

    // 实时更新全局滤波器
    // 确保 this.filter 已经正确连接到了 synth 和 destination
    if (this.filter) {
      this.filter.frequency.rampTo(cutoff, 0.05);
      this.filter.Q.rampTo(q, 0.05);
    }
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

  // 设置滤波器类型
  setFilterType(type) {
    if (this.filter) {
      this.filter.type = type;
      console.log(this.filter.type);
    }
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
