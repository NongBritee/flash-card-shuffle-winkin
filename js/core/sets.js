/* Vocabulary-set registry. Each sets/<id>/set.js calls SETS.add({...}).
   Files of a set:  sets/<id>/cards/<word>.webp, sets/<id>/cards/back.webp, sets/<id>/audio/<word>.mp3 (optional) */
(function () {
  const list = [];
  const ASSET_V = '6';                     // bump when card images / voices change (cache-busting)
  window.SETS = {
    list,
    add(set) {
      set.words.forEach(w => { w.bg = w.bg || w.c2; w.letters = w.letters || set.palette; });
      list.push(set);
      list.sort((a, b) => a.no - b.no);
    },
    get: id => list.find(s => s.id === id),
    img: (set, name) => `sets/${set.id}/cards/${name}.webp?v=${ASSET_V}`,
    clip: (set, w) => `sets/${set.id}/audio/${w.id}.mp3?v=${ASSET_V}`,
  };
})();
