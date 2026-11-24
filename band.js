let play = false, tmr = null, step = 0, barIdx = 0, bpm = 100, stepsPerBar = 8, isCompound = false;

const chordDB = {
  "C":new Array(130.8,164.8,196.0),"Cm":new Array(130.8,155.6,196.0),"C7":new Array(130.8,164.8,196.0,233.1),
  "D":new Array(146.8,185.0,220.0),"Dm":new Array(146.8,174.6,220.0),"D7":new Array(146.8,185.0,220.0,261.6),
  "E":new Array(82.4,103.8,123.5),"Em":new Array(82.4,98.0,123.5),"E7":new Array(82.4,103.8,123.5,146.8),
  "F":new Array(87.3,110.0,130.8),"Fm":new Array(87.3,103.8,130.8),"G":new Array(98.0,123.5,146.8),
  "Gm":new Array(98.0,116.5,146.8),"G7":new Array(98.0,123.5,146.8,174.6),"A":new Array(110.0,138.6,164.8),
  "Am":new Array(110.0,130.8,164.8),"A7":new Array(110.0,138.6,164.8,196.0),"B":new Array(123.5,155.6,185.0),
  "Bm":new Array(123.5,146.8,185.0),"A5":new Array(110.0,164.8,220.0),"E5":new Array(82.4,123.5,164.8),
  "G5":new Array(98.0,146.8,196.0),"D5":new Array(146.8,220.0,293.7)
};
const chordNames = Object.keys(chordDB);

function showTab(id, btn){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');
}

function submitIndie(){
  const subj = encodeURIComponent("Indie Track Submission - ToneLab Studio");
  const body = encodeURIComponent("Artist/Band Name:\nTrack Title:\nBPM & Key:\nLink to Audio / Socials:\nI confirm I own the rights and grant permission for ToneLab users to jam over this track.");
  window.location.href = `mailto:tonelabjam@://gmail.com{subj}&body=${body}`;
}


function changeTimeSig(){
  const sig = document.getElementById('timeSig').value;
  isCompound = (sig === '6/8' || sig === '9/8');
  stepsPerBar = sig === '4/4' ? 8 : sig === '3/4' ? 6 : sig === '5/4' ? 10 : sig === '6/8' ? 6 : 9;
  const dotCount = isCompound ? (stepsPerBar / 3) : (stepsPerBar / 2);
  const box = document.getElementById('dotsBox'); box.innerHTML = '';
  for(let i = 0; i < dotCount; i++) box.innerHTML += `<div class="dot" id="d${i}"></div>`;
  if(play){ clearInterval(tmr); step = 0; tmr = setInterval(tick, ((60 / bpm) / 2) * 1000); }
}

function buildGrid(presetArr){
  let count = parseInt(document.getElementById('barCount').value) || 4;
  if(count < 1) count = 1; if(count > 32) count = 32;
  document.getElementById('barCount').value = count;
  const grid = document.getElementById('barsGrid'); grid.innerHTML = '';
  const defaults = presetArr || new Array("Am","F","C","G");
  for(let i = 0; i < count; i++){
    const div = document.createElement('div'); div.className = 'bar-box'; div.id = 'bar-' + i;
    const defChord = defaults.at(i % defaults.length);
    let opts = '';
    chordNames.forEach(cn => { opts += `<option value="${cn}" ${cn === defChord ? 'selected' : ''}>${cn}</option>`; });
    div.innerHTML = `<span class="bar-num">#${i + 1}</span><select id="sel-${i}">${opts}</select>`;
    grid.appendChild(div);
  }
}

function presetBlues(){ document.getElementById('barCount').value = 12; buildGrid(new Array("A7","A7","A7","A7","D7","D7","A7","A7","E7","D7","A7","E7")); }
function loadDemoTrack(){ document.getElementById('timeSig').value = '4/4'; changeTimeSig(); document.getElementById('barCount').value = 8; buildGrid(new Array("Am","Em","F","G","Am","Em","Dm","E7")); setBpm(95); showTab('jam', document.querySelector('.tab-btn')); }
function playWarmKeys(fs, dur, volMult = 1){
  const t = ctx.currentTime, flt = ctx.createBiquadFilter();
  flt.type = 'lowpass'; flt.frequency.setValueAtTime(1450, t); flt.connect(ctx.destination);
  fs.forEach(f => {
    new Array(-5, 5).forEach(det => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.detune.setValueAtTime(det, t);
      g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.05 * volMult, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(flt); o.start(t); o.stop(t + dur);
    });
  });
}

function playFatBass(f, dur, isGhost = false){
  const t = ctx.currentTime, sub = ctx.createOscillator(), body = ctx.createOscillator(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
  sub.type = 'sine'; sub.frequency.setValueAtTime(f / 2, t); body.type = 'sawtooth'; body.frequency.setValueAtTime(f / 2, t);
  flt.type = 'lowpass'; flt.frequency.setValueAtTime(isGhost ? 260 : 620, t); flt.frequency.exponentialRampToValueAtTime(160, t + dur);
  g.gain.setValueAtTime(isGhost ? 0.14 : 0.32, t); g.gain.exponentialRampToValueAtTime(0.01, t + dur);
  sub.connect(g); body.connect(flt); flt.connect(g); g.connect(ctx.destination);
  sub.start(t); body.start(t); sub.stop(t + dur); body.stop(t + dur);
}

function playRealDrum(type, vel = 1){
  const t = ctx.currentTime;
  if(type === 'k'){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(36, t + 0.14);
    g.gain.setValueAtTime(0.6 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.28);
  }else if(type === 'c'){
    const len = Math.floor(ctx.sampleRate * 0.65), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for(let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = buf; flt.type = 'highpass'; flt.frequency.setValueAtTime(4500, t);
    g.gain.setValueAtTime(0.16 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
    n.connect(flt); flt.connect(g); g.connect(ctx.destination); n.start(t);
  }else{
    const len = Math.floor(ctx.sampleRate * (type === 's' ? 0.18 : 0.045)), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for(let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = buf; flt.type = type === 's' ? 'bandpass' : 'highpass'; flt.frequency.setValueAtTime(type === 's' ? 1300 : 7800, t);
    g.gain.setValueAtTime((type === 's' ? 0.35 : 0.1) * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + (type === 's' ? 0.18 : 0.045));
    n.connect(flt); flt.connect(g); g.connect(ctx.destination); n.start(t);
  }
}

function playClick(acc){
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(acc ? 980 : 580, t); g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.05);
}

function tick(){
  const totalBars = parseInt(document.getElementById('barCount').value) || 4; if(barIdx >= totalBars) barIdx = 0;
  const st = document.getElementById('styleSel').value, d8 = (60 / bpm) / 2, div = isCompound ? 3 : 2, beat = Math.floor(step / div), dotCount = stepsPerBar / div;
  if(step % div === 0){
    for(let i = 0; i < dotCount; i++){ const el = document.getElementById('d' + i); if(el) el.classList.toggle('on', i === beat); }
    if(document.getElementById('mChk').checked) playClick(beat === 0);
  }
  const sel = document.getElementById('sel-' + barIdx), cName = sel ? sel.value : 'Am', ns = chordDB[cName] || new Array(110);
  const root = ns.at(0), fifth = ns.at(2) || root * 1.5, isFill = (totalBars >= 4 && (barIdx + 1) % 4 === 0 && step >= stepsPerBar - 2);
  if(step === 0){
    document.querySelectorAll('.bar-box').forEach(b => b.classList.remove('playing'));
    const ab = document.getElementById('bar-' + barIdx); if(ab) ab.classList.add('playing');
    if(barIdx === 0) playRealDrum('c', 1);
    playWarmKeys(ns, st === 'funk' ? d8 * 1.2 : d8 * (stepsPerBar - 0.4), 1);
  }else if((st === 'funk' && (step === 3 || step === 6)) || (st === 'jazz' && (step === 3 || step === 5)) || (st === 'blues' && step === 4)){
    playWarmKeys(ns, d8 * 1.1, 0.75);
  }
  if(step === 0) playFatBass(root, d8 * 1.6, false);
  else if(st === 'funk' && (step === 2 || step === 3 || step === 5 || step === 7)) playFatBass(step === 5 ? fifth : root * (step === 7 ? 2 : 1), d8 * 0.65, step === 2);
  else if(st === 'jazz' && (step === 2 || step === 4 || step === 6)) playFatBass(step === 2 ? ns.at(1) : step === 4 ? fifth : root * 1.12, d8 * 1.4, false);
  else if(step === 3 || step === 4 || step === 6) playFatBass(step === 4 ? fifth : root, d8 * 0.9, step === 3);
  playRealDrum('h', step % div === 0 ? 1 : 0.45);
  if(step === 0 || (!isCompound && step === 4) || (isCompound && step === 6)) playRealDrum('k', 1);
  else if(st === 'funk' && step === 7) playRealDrum('k', 0.7);
  if((!isCompound && (step === 2 || step === 6)) || (isCompound && step === 3)) playRealDrum('s', 1);
  else if((st === 'funk' && step === 5) || isFill) playRealDrum('s', isFill ? 0.85 : 0.25);
  step++; if(step >= stepsPerBar){ step = 0; barIdx = (barIdx + 1) % totalBars; }
}

function togglePlay(){
  unlockAudio(); const b = document.getElementById('pBtn');
  if(play){ clearInterval(tmr); play = false; b.classList.remove('stop'); b.innerText = lang === 'en' ? 'Play Band' : 'Tocar Banda'; document.querySelectorAll('.dot').forEach(d => d.classList.remove('on')); document.querySelectorAll('.bar-box').forEach(box => box.classList.remove('playing')); }
  else{ play = true; step = 0; barIdx = 0; b.classList.add('stop'); b.innerText = lang === 'en' ? 'Stop' : 'Detener'; tick(); tmr = setInterval(tick, ((60 / bpm) / 2) * 1000); }
}

function setBpm(v){ bpm = v; document.getElementById('bVal').innerText = v; if(play){ clearInterval(tmr); tmr = setInterval(tick, ((60 / bpm) / 2) * 1000); } }
function toggleLang(){ lang = lang === 'en' ? 'es' : 'en'; document.getElementById('lBtn').innerText = lang === 'en' ? 'ES / Español' : 'EN / English'; document.querySelectorAll('[data-en]').forEach(e => e.innerText = e.getAttribute('data-' + lang)); document.getElementById('pBtn').innerText = play ? (lang === 'en' ? 'Stop' : 'Detener') : (lang === 'en' ? 'Play Band' : 'Tocar Banda'); renderAmps(); }

changeTimeSig(); buildGrid();

