// Paths of files in public/ (images, voices). Bump ASSET_V when they change, so browsers fetch the new files.
export const ASSET_V = '7';
const BASE = import.meta.env.BASE_URL;
export const cardImg = (set, name) => `${BASE}sets/${set.id}/cards/${name}.webp?v=${ASSET_V}`;
export const clipUrl = (set, word) => `${BASE}sets/${set.id}/audio/${word.id}.mp3?v=${ASSET_V}`;
export const SILENCE = `${BASE}silence.mp3`;
