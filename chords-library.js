const chordRoots = new Array("C","C#","D","D#","E","F","F#","G","G#","A","A#","B");

const chordTypes = new Array(
  { id: "maj", label: "", name: "Major", shape: new Array(0, 0, 1, 2, 2, 0), base: 4 },
  { id: "min", label: "m", name: "Minor", shape: new Array(0, 0, 0, 2, 2, 0), base: 4 },
  { id: "7", label: "7", name: "Dominant 7", shape: new Array(0, 0, 1, 0, 2, 0), base: 4 },
  { id: "maj7", label: "maj7", name: "Major 7", shape: new Array(0, 0, 1, 1, 2, 0), base: 4 },
  { id: "m7", label: "m7", name: "Minor 7", shape: new Array(0, 0, 0, 0, 2, 0), base: 4 },
  { id: "sus2", label: "sus2", name: "Sus2", shape: new Array(0, 2, 2, 0, 0, -1), base: 9 },
  { id: "sus4", label: "sus4", name: "Sus4", shape: new Array(0, 0, 2, 2, 2, 0), base: 4 },
  { id: "dim", label: "dim", name: "Diminished", shape: new Array(-1, 1, 2, 1, 2, -1), base: 3 },
  { id: "aug", label: "aug", name: "Augmented", shape: new Array(0, 1, 1, 2, 3, -1), base: 4 },
  { id: "5", label: "5", name: "Power Chord", shape: new Array(-1, -1, -1, 2, 2, 0), base: 4 }
);

function getChordVoicing(rootIdx, typeObj){
  const shift = (rootIdx - typeObj.base + 12) % 12;
  return typeObj.shape.map(fret => fret === -1 ? -1 : fret + shift);
}

function strumChordNotes(frets){
  if(typeof unlockAudio === 'function') unlockAudio();
  if(!ctx) return;
  const openFreqs = new Array(329.63, 246.94, 196.00, 146.83, 110.00, 82.41);
  let delay = 0;
  for(let s = 5; s >= 0; s--){
    const f = frets.at(s);
    if(f >= 0){
      const freq = openFreqs.at(s) * Math.pow(2, f / 12);
      const t = ctx.currentTime + delay;
      const o = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.setValueAtTime(freq, t);
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(1800, t);
      g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      o.connect(flt); flt.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 1.4);
      delay += 0.045;
    }
  }
}
function showChordVoicing(rootIdx, typeIdx){
  const typeObj = chordTypes.at(typeIdx);
  const frets = getChordVoicing(rootIdx, typeObj);
  const board = document.getElementById('fretboard');
  const nums = document.getElementById('fretNums');
  if(!board || !nums) return;

  board.innerHTML = '';
  nums.innerHTML = '';

  for(let s = 0; s < 6; s++){
    const targetFret = frets.at(s);
    for(let f = 0; f <= 12; f++){
      const cell = document.createElement('div');
      cell.className = 'fret-cell' + (f === 0 ? ' nut' : '');
      if(f === 0 && targetFret === -1){
        cell.innerHTML = '<span style="color:#ef4444;font-weight:bold;font-size:.85rem">✕</span>';
      } else if(f === targetFret){
        const dot = document.createElement('div');
        dot.className = 'note-dot root';
        dot.innerText = f === 0 ? '0' : f;
        cell.appendChild(dot);
      }
      board.appendChild(cell);
    }
  }

  for(let f = 0; f <= 12; f++){
    const n = document.createElement('div');
    n.innerText = f === 0 ? 'Open' : f;
    nums.appendChild(n);
  }
  strumChordNotes(frets);
}

function initChordDictionary(){
  const fretSec = document.querySelector('#sec-fret .card');
  if(!fretSec) return;
  const wrap = document.createElement('div');
  wrap.style.marginTop = '1.5rem';
  wrap.style.paddingTop = '1.2rem';
  wrap.style.borderTop = '1px solid var(--border)';
  wrap.innerHTML = `<h3 style="margin-bottom:.6rem" data-en="All Guitar Chords Dictionary (Click any chord to see shape & hear it)" data-es="Diccionario de Todos los Acordes (Haz clic para ver postura y escuchar)">All Guitar Chords Dictionary (Click any chord to see shape & hear it)</h3><div id="chordDictGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:.4rem;max-height:240px;overflow-y:auto;padding:.5rem;background:var(--bg);border-radius:8px;border:1px solid var(--border)"></div>`;
  fretSec.appendChild(wrap);

  const grid = document.getElementById('chordDictGrid');
  chordRoots.forEach((rName, rIdx) => {
    chordTypes.forEach((tObj, tIdx) => {
      const btn = document.createElement('button');
      btn.className = 'btn sec';
      btn.style.padding = '.35rem .2rem';
      btn.style.fontSize = '.82rem';
      btn.style.justifyContent = 'center';
      btn.innerText = rName + tObj.label;
      btn.onclick = () => showChordVoicing(rIdx, tIdx);
      grid.appendChild(btn);
    });
  });
}

initChordDictionary();
