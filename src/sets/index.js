/* Registry of vocabulary sets. To add a set: create src/sets/<id>.js, import it here,
   put its images in public/sets/<id>/cards/ (node design/render.js <id>) and optional voices in public/sets/<id>/audio/. */
import weather from './weather.js';
import days from './days.js';
import things from './things.js';
import home from './home.js';
import animals from './animals.js';
import farm from './farm.js';

// fill defaults: overlay colour = c2, letter colours = set palette
const normalize = set => ({
  ...set,
  words: set.words.map(w => ({ ...w, bg: w.bg || w.c2, letters: w.letters || set.palette })),
});

export const SETS = [weather, days, things, home, animals, farm].map(normalize).sort((a, b) => a.no - b.no);
export const getSet = id => SETS.find(s => s.id === id);

// Only the first FREE_SETS sets can be played for now; open the site with ?allow=all to unlock everything.
export const FREE_SETS = 4;
export const allowAll = () => new URLSearchParams(location.search).get('allow') === 'all';
export const isUnlocked = set => allowAll() || set.no <= FREE_SETS;
