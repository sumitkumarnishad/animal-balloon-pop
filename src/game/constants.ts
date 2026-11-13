import { AnimalBalloonStyle, AnimalKind } from './types';

export const LOGICAL_WIDTH = 450;
export const LOGICAL_HEIGHT = 800;

export const PARTY_TARGET_POPS = 15;
export const MILESTONE_STEP = 10;
export const MAX_PARTICLES = 260;

export const CHEER_WORDS = [
  'Pop!',
  'Yay!',
  'Boop!',
  'Whee!',
  'Super!',
  'Happy!',
];

export const CONFETTI_COLORS = [
  '#FF8FA3',
  '#FFD166',
  '#7AE5B8',
  '#7EC8FF',
  '#C5A3FF',
  '#FFB07A',
  '#FFF185',
];

export const PENTATONIC_FREQS = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.0,  // A5
  1046.5, // C6
];

export const ANIMAL_STYLES: Record<AnimalKind, AnimalBalloonStyle> = {
  bunny: {
    kind: 'bunny',
    label: 'Bunny',
    bodyColor: '#FF8FA3',
    highlightColor: '#FFD6DF',
    shadeColor: '#EB6B84',
    earColor: '#FFAEC0',
    cheekColor: '#FF6B8A',
    points: 1,
  },
  duck: {
    kind: 'duck',
    label: 'Duckling',
    bodyColor: '#FFD166',
    highlightColor: '#FFF1B8',
    shadeColor: '#F0B63A',
    earColor: '#FFE08A',
    cheekColor: '#FF9E7D',
    points: 1,
  },
  frog: {
    kind: 'frog',
    label: 'Froggy',
    bodyColor: '#7AE5B8',
    highlightColor: '#D4FCEB',
    shadeColor: '#4EC997',
    earColor: '#97EFC9',
    cheekColor: '#FF9AA8',
    points: 1,
  },
  bear: {
    kind: 'bear',
    label: 'Bear',
    bodyColor: '#7EC8FF',
    highlightColor: '#D4EDFF',
    shadeColor: '#54ACEE',
    earColor: '#9ED7FF',
    cheekColor: '#FF9AB2',
    points: 1,
  },
  kitty: {
    kind: 'kitty',
    label: 'Kitty',
    bodyColor: '#C5A3FF',
    highlightColor: '#EBDDFF',
    shadeColor: '#A179EB',
    earColor: '#D6BEFF',
    cheekColor: '#FF99B8',
    points: 1,
  },
  fox: {
    kind: 'fox',
    label: 'Fox',
    bodyColor: '#FFB07A',
    highlightColor: '#FFE2CC',
    shadeColor: '#EE8B4E',
    earColor: '#FFC499',
    cheekColor: '#FF867C',
    points: 1,
  },
  puppy: {
    kind: 'puppy',
    label: 'Star Puppy',
    bodyColor: '#FFE066',
    highlightColor: '#FFF7BF',
    shadeColor: '#F2BE35',
    earColor: '#FFC94D',
    cheekColor: '#FF8A8A',
    points: 3,
  },
};

export const STANDARD_ANIMALS: AnimalKind[] = [
  'bunny',
  'duck',
  'frog',
  'bear',
  'kitty',
  'fox',
];
