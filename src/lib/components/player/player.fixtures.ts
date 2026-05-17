export type AudioTrack = { id: string; label: string; sublabel?: string };
export type SubtitleTrack = { id: string; label: string; sublabel?: string };
export type EpisodeFixture = {
  id: string;
  number: number;
  season: number;
  title: string;
  description: string;
  duration: string;
  thumbSeed: string;
  progress: number;
  isPlaying?: boolean;
};

export const AUDIO_TRACKS: AudioTrack[] = [
  { id: 'ko-51', label: 'Korean', sublabel: '5.1' },
  { id: 'ja', label: 'Japanese', sublabel: 'Stereo' },
  { id: 'en-dub', label: 'English Dub', sublabel: 'Stereo' }
];

export const SUBTITLE_TRACKS: SubtitleTrack[] = [
  { id: 'off', label: 'Off' },
  { id: 'ko', label: 'Korean' },
  { id: 'en-cc', label: 'English', sublabel: 'CC' }
];

export const EPISODE_FIXTURES: EpisodeFixture[] = [
  {
    id: 'e3',
    number: 3,
    season: 1,
    title: 'A Wedding in Yongdu-ri',
    description: 'Hae-in returns to her in-laws to settle a long-standing family dispute.',
    duration: '72m',
    thumbSeed: 'mirae-ep3',
    progress: 1
  },
  {
    id: 'e4',
    number: 4,
    season: 1,
    title: 'The Hospital Visit',
    description: 'A surprise diagnosis upends everything Hae-in believed about her future.',
    duration: '68m',
    thumbSeed: 'mirae-ep4',
    progress: 0.42,
    isPlaying: true
  },
  {
    id: 'e5',
    number: 5,
    season: 1,
    title: 'Snow in Yangpyeong',
    description: 'Hyun-woo confronts a memory he had spent years trying to forget.',
    duration: '71m',
    thumbSeed: 'mirae-ep5',
    progress: 0
  },
  {
    id: 'e6',
    number: 6,
    season: 1,
    title: 'The Letter Never Sent',
    description: 'An old letter resurfaces, exposing the truth behind a fractured friendship.',
    duration: '69m',
    thumbSeed: 'mirae-ep6',
    progress: 0
  }
];

export const UP_NEXT_EPISODE = EPISODE_FIXTURES.find((e) => e.number === 5)!;
export const CURRENT_EPISODE_LABEL = 'S1 · E4 — The Hospital Visit';

// Mux's public Tears of Steel VOD HLS — adaptive bitrate, ~12min, proper duration.
export const DEMO_VIDEO_SRC = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
