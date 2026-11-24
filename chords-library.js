const chordRoots = new Array("C","C#","D","D#","E","F","F#","G","G#","A","A#","B");

const chordTypes = new Array(
  { id: "maj", label: "", shapes: new Array(
      { s: new Array(0,0,1,2,2,0), b: 4, tag: "Pos 1 (E-Shape)" },
      { s: new Array(3,5,5,5,3,-1), b: 0, tag: "Pos 2 (A-Shape)" },
      { s: new Array(0,1,0,2,3,-1), b: 0, tag: "Pos 3 (C-Shape)" }
  )},
  { id: "min", label: "m", shapes: new Array(
      { s: new Array(0,0,0,2,2,0), b: 4, tag: "Pos 1 (Em-Shape)" },
      { s: new Array(3,4,5,5,3,-1), b: 0, tag: "Pos 2 (Am-Shape)" },
      { s: new Array(1,3,2,0,-1,-1), b: 2, tag: "Pos 3 (Dm-Shape)" }
  )},
  { id: "7", label: "7", shapes: new Array(
      { s: new Array(0,0,1,0,2,0), b: 4, tag: "Pos 1 (E7-Shape)" },
      { s: new Array(3,5,3,5,3,-1), b: 0, tag: "Pos 2 (A7-Shape)" },
      { s: new Array(0,1,3,2,3,-1), b: 0, tag: "Pos 3 (C7-Shape)" }
  )},
  { id: "maj7", label: "maj7", shapes: new Array(
      { s: new Array(0,0,1,1,2,0), b: 4, tag: "Pos 1 (Emaj7)" },
      { s: new Array(3,5,4,5,3,-1), b: 0, tag: "Pos 2 (Amaj7)" },
      { s: new Array(2,2,2,0,-1,-1), b: 2, tag: "Pos 3 (Dmaj7)" }
  )},
  { id: "m7", label: "m7", shapes: new Array(
      { s: new Array(0,0,0,0,2,0), b: 4, tag: "Pos 1 (Em7)" },
      { s: new Array(3,4,3,5,3,-1), b: 0, tag: "Pos 2 (Am7)" },
      { s: new Array(1,1,2,0,-1,-1), b: 2, tag: "Pos 3 (Dm7)" }
  )},
  { id: "sus2", label: "sus2", shapes: new Array(
      { s: new Array(0,2,2,0,0,-1), b: 9, tag: "Pos 1 (Asus2)" },
      { s: new Array(0,3,2,0,-1,-1), b: 2, tag: "Pos 2 (Dsus2)" },
      { s: new Array(3,3,5,5,3,-1), b: 0, tag: "Pos 3 (Bar Sus2)" }
  )},
  { id: "sus4", label: "sus4", shapes: new Array(
      { s: new Array(0,0,2,2,2,0), b: 4, tag: "Pos 1 (Esus4)" },
      { s: new Array(3,6,5,5,3,-1), b: 0, tag: "Pos 2 (Asus4)" },
      { s: new Array(3,3,2,0,-1,-1), b: 2, tag: "Pos 3 (Dsus4)" }
  )},
  { id: "5", label: "5", shapes: new Array(
      { s: new Array(-1,-1,-1,2,2,0), b: 4, tag: "Pos 1 (6th String)" },
      { s: new Array(-1,-1,5,5,3,-1), b: 0, tag: "Pos 2 (5th String)" },
      { s: new Array(-1,3,2,0,-1,-1), b: 2, tag: "Pos 3 (4th String)" }
  )}
);
function strumVoicing(frets){
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
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
      o.connect(flt); flt.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 1.3);
      delay += 0.045;
    }
  }
}

function buildMiniFretboard(frets, label, chordName){
  const wrap = document.createElement('div');
  wrap.style.marginBottom = '1.2rem';
  wrap.style.background = 'var(--bg)';
  wrap.style.padding = '.8rem';
  wrap.style.borderRadius = '10px';
  wrap.style.border = '1px solid var(--border)';

  const top = document.createElement('div');
  top.style.display = 'flex'; top.style.justifyContent = 'space-between'; top.style.alignItems = 'center'; top.style.marginBottom = '.5rem';
  top.innerHTML = `<strong style="color:var(--accent)">${chordName} — ${label}</strong>`;
  const playBtn = document.createElement('button');
  playBtn.className = 'btn sec'; playBtn.style.padding = '.3rem .7rem'; playBtn.style.fontSize = '.82rem';
  playBtn.innerText = '▶ Hear';
  playBtn.onclick = () => strumVoicing(frets);
  top.appendChild(playBtn);
  wrap.appendChild(top);

  const scroll = document.createElement('div'); scroll.className = 'fret-wrap'; scroll.style.padding = '0';
  const board = document.createElement('div'); board.className = 'fretboard';
  for(let s = 0; s < 6; s++){
    const targetFret = frets.at(s);
    for(let f = 0; f <= 12; f++){
      const cell = document.createElement('div'); cell.className = 'fret-cell' + (f === 0 ? ' nut' : '');
      if(f === 0 && targetFret === -1) cell.innerHTML = '<span style="color:#ef4444;font-weight:bold;font-size:.85rem">✕</span>';
      else if(f === targetFret){ const dot = document.createElement('div'); dot.className = 'note-dot root'; dot.innerText = f === 0 ? '0' : f; cell.appendChild(dot); }
      board.appendChild(cell);
    }
  }
  scroll.appendChild(board); wrap.appendChild(scroll);
  return wrap;
}

function showAllChordShapes(rootIdx, typeIdx){
  const tObj = chordTypes.at(typeIdx), chordName = chordRoots.at(rootIdx) + tObj.label;
  let container = document.getElementById('multiChordBox');
  if(!container){
    container = document.createElement('div'); container.id = 'multiChordBox'; container.style.marginTop = '1.2rem';
    document.getElementById('chordDictGrid').after(container);
  }
  container.innerHTML = '';
  tObj.shapes.forEach((sh, i) => {
    const shift = (rootIdx - sh.b + 12) % 12;
    const frets = sh.s.map(f => f === -1 ? -1 : f + shift);
    container.appendChild(buildMiniFretboard(frets, sh.tag, chordName));
    if(i === 0) strumVoicing(frets);
  });
}

function initChordDictionary(){
  const fretSec = document.querySelector('#sec-fret .card'); if(!fretSec) return;
  const wrap = document.createElement('div'); wrap.style.marginTop = '1.5rem'; wrap.style.paddingTop = '1.2rem'; wrap.style.borderTop = '1px solid var(--border)';
  wrap.innerHTML = `<h3 style="margin-bottom:.6rem" data-en="All Guitar Chords Dictionary (Click any chord to see 3 positions)" data-es="Diccionario de Todos los Acordes (Haz clic para ver 3 posturas)">All Guitar Chords Dictionary (Click any chord to see 3 positions)</h3><div id="chordDictGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:.4rem;max-height:210px;overflow-y:auto;padding:.5rem;background:var(--bg);border-radius:8px;border:1px solid var(--border)"></div>`;
  fretSec.appendChild(wrap);
  const grid = document.getElementById('chordDictGrid');
  chordRoots.forEach((rName, rIdx) => {
    chordTypes.forEach((tObj, tIdx) => {
      const btn = document.createElement('button'); btn.className = 'btn sec'; btn.style.padding = '.35rem .2rem'; btn.style.fontSize = '.82rem'; btn.style.justifyContent = 'center';
      btn.innerText = rName + tObj.label; btn.onclick = () => showAllChordShapes(rIdx, tIdx);
      grid.appendChild(btn);
    });
  });
}
initChordDictionary();
