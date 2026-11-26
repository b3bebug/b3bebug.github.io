let lang = 'en';
let ctx = null;
let liveStream = null;
let liveChain = null;
let activePresetIdx = 0;

const ampPresets = new Array(
  { artist: "Kurt Cobain (Nirvana)", amp: "Fender Twin / BOSS DS-2", knobs: new Array({n:"Gain",v:7},{n:"Bass",v:6},{n:"Mid",v:4},{n:"Treble",v:8},{n:"Master",v:5}), en: "Bridge humbucker pickup. Keep mids slightly scooped and pair a clean amp with a BOSS DS-1/DS-2 distortion pedal.", es: "Pastilla humbucker en el puente. Recorta ligeramente los medios y combina un ampli limpio con pedal BOSS DS-1/DS-2." },
  { artist: "James Hetfield (Metallica)", amp: "Mesa Boogie Mark IIC+", knobs: new Array({n:"Gain",v:9},{n:"Bass",v:8},{n:"Mid",v:2},{n:"Treble",v:8},{n:"Master",v:5}), en: "Classic 'V-Shape' EQ: boost bass and treble aggressively while cutting mids to 2. Use tight palm-muting.", es: "Ecualización clásica en 'V': sube graves y agudos al 8 y recorta los medios al 2. Usa palm-muting firme." },
  { artist: "John Frusciante (RHCP)", amp: "Marshall Silver Jubilee", knobs: new Array({n:"Gain",v:4},{n:"Bass",v:7},{n:"Mid",v:6},{n:"Treble",v:5},{n:"Master",v:6}), en: "Set right on the edge of breakup with a Stratocaster neck pickup. Dig in for grit, or play softly for glassy cleans.", es: "Ajusta el ampli al borde de la saturación con Stratocaster en pastilla del mástil. Toca fuerte para romper o suave para limpios." },
  { artist: "Angus Young (AC/DC)", amp: "Marshall Plexi 1959", knobs: new Array({n:"Gain",v:6},{n:"Bass",v:5},{n:"Mid",v:7},{n:"Treble",v:7},{n:"Master",v:6}), en: "Pure power-tube crunch without pedals. Keep gain moderate so open chords ring clearly with punchy mids.", es: "Crunch puro de válvulas sin pedales. Mantén la ganancia moderada para que los acordes abiertos suenen claros." },
  { artist: "Slash (Guns N' Roses)", amp: "Marshall AFD100", knobs: new Array({n:"Gain",v:8},{n:"Bass",v:6},{n:"Mid",v:7},{n:"Treble",v:6},{n:"Master",v:5}), en: "Les Paul neck pickup with tone rolled back slightly for creamy solos, or bridge pickup for classic rock riffs.", es: "Pastilla del mástil de una Les Paul bajando un poco el tono para solos cremosos, o puente para riffs clásicos." },
  { artist: "David Gilmour (Pink Floyd)", amp: "Hiwatt DR103", knobs: new Array({n:"Gain",v:3},{n:"Bass",v:6},{n:"Mid",v:5},{n:"Treble",v:7},{n:"Master",v:7}), en: "High-headroom clean tone pushed by a compressor and Big Muff fuzz for soaring, atmospheric lead sustain.", es: "Tono limpio con mucho techo dinámico empujado por compresor y fuzz Big Muff para solos atmosféricos." },
  { artist: "Alex Turner (Arctic Monkeys)", amp: "Vox AC30", knobs: new Array({n:"Gain",v:6},{n:"Bass",v:5},{n:"Mid",v:6},{n:"Treble",v:8},{n:"Master",v:6}), en: "Chimy British top-boost overdrive. Pair with a slapback delay and spring reverb for indie garage punch.", es: "Overdrive británico brillante tipo Top Boost. Combínalo con delay corto y reverb de muelles para pegada indie." },
  { artist: "B.B. King (Classic Blues)", amp: "Fender Twin Reverb", knobs: new Array({n:"Gain",v:3},{n:"Bass",v:6},{n:"Mid",v:7},{n:"Treble",v:5},{n:"Master",v:7}), en: "Warm, singing clean tone with vocal midrange. Roll guitar volume to 8 and let vibrato do the talking.", es: "Tono limpio cálido y cantante con medios vocales. Pon el volumen de la guitarra al 8 y deja que hable el vibrato." }
);

const currentKnobs = new Array(7, 6, 4, 8, 5);

function unlockAudio(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!ctx) ctx = new AC();
  if(ctx.state === 'suspended') ctx.resume();
}

function makeDistortionCurve(amount){
  const k = amount * 40, n = 44100, curve = new Float32Array(n);
  for(let i = 0; i < n; i++){
    const x = i * 2 / n - 1;
    curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function applyAudioParams(){
  if(!liveChain) return;
  liveChain.pre.gain.value = 1 + (currentKnobs.at(0) * 1.1);
  liveChain.shaper.curve = makeDistortionCurve(currentKnobs.at(0));
  liveChain.bass.gain.value = (currentKnobs.at(1) - 5) * 2.8;
  liveChain.mid.gain.value = (currentKnobs.at(2) - 5) * 3.0;
  liveChain.treb.gain.value = (currentKnobs.at(3) - 5) * 2.8;
  liveChain.master.gain.value = currentKnobs.at(4) * 0.08;
}
function selectAmpPreset(idx){
  activePresetIdx = parseInt(idx) || 0;
  const preset = ampPresets.at(activePresetIdx);
  preset.knobs.forEach((k, i) => { currentKnobs[i] = k.v; });
  applyAudioParams();
  renderAmps();
}

function changeSingleKnob(kIdx, val){
  currentKnobs[kIdx] = parseFloat(val);
  document.getElementById('kv-' + kIdx).innerText = val;
  document.getElementById('kl-' + kIdx).style.transform = `rotate(${-135 + (val * 27)}deg)`;
  applyAudioParams();
}

function renderAmps(){
  const box = document.getElementById('ampsContainer');
  if(!box) return;
  const preset = ampPresets.at(activePresetIdx);
  let optionsHtml = '';
  ampPresets.forEach((p, i) => {
    optionsHtml += `<option value="${i}" ${i === activePresetIdx ? 'selected' : ''}>${p.artist} — ${p.amp}</option>`;
  });

  let knobsHtml = '';
  preset.knobs.forEach((k, i) => {
    const val = currentKnobs.at(i);
    const deg = -135 + (val * 27);
    knobsHtml += `<div class="knob-unit"><div class="knob"><div class="knob-line" id="kl-${i}" style="transform:rotate(${deg}deg)"></div></div><span class="knob-label">${k.n}</span><span class="knob-val" id="kv-${i}">${val}</span><input type="range" min="0" max="10" step="1" value="${val}" style="width:100%;accent-color:#fbbf24;margin-top:4px;cursor:pointer" oninput="changeSingleKnob(${i}, this.value)"></div>`;
  });

  const isLive = Boolean(liveStream);
  const btnTxt = isLive ? (lang === 'en' ? '■ Stop Guitar Audio' : '■ Detener Guitarra') : (lang === 'en' ? '● Plug In & Play Guitar Live' : '● Conectar y Tocar Guitarra en Vivo');
  const guideTxt = lang === 'en' ? 'Read Tone Guide ▾' : 'Leer Guía de Tono ▾';

  box.innerHTML = `
    <div style="margin-bottom:1rem">
      <label style="font-weight:700;display:block;margin-bottom:.4rem" data-en="Select Iconic Artist Tone:" data-es="Elige un Tono Icónico:">${lang === 'en' ? 'Select Iconic Artist Tone:' : 'Elige un Tono Icónico:'}</label>
      <select style="width:100%;padding:.65rem;font-size:1rem;font-weight:600" onchange="selectAmpPreset(this.value)">${optionsHtml}</select>
    </div>
    <div class="amp-card">
      <div class="amp-header" onclick="this.parentElement.classList.toggle('open')"><strong>${preset.artist}</strong><span class="amp-brand">${preset.amp}</span></div>
      <div class="knobs-row">${knobsHtml}</div>
      <div class="amp-actions">
        <button class="btn ${isLive ? 'live-on' : ''}" style="padding:.75rem 1.2rem;font-size:.98rem" onclick="toggleLiveAmp()">${btnTxt}</button>
        <span style="font-size:.85rem;color:#fbbf24;cursor:pointer;font-weight:600" onclick="this.parentElement.parentElement.classList.toggle('open')" data-en="Read Tone Guide ▾" data-es="Leer Guía de Tono ▾">${guideTxt}</span>
      </div>
      <div class="amp-details" data-en="${preset.en}" data-es="${preset.es}">${lang === 'en' ? preset.en : preset.es}</div>
    </div>`;
}

async function toggleLiveAmp(){
  unlockAudio();
  if(liveStream){
    liveStream.getTracks().forEach(t => t.stop());
    liveStream = null; liveChain = null;
    renderAmps(); return;
  }
  try{
    liveStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const src = ctx.createMediaStreamSource(liveStream);
    const pre = ctx.createGain();
    const shaper = ctx.createWaveShaper(); shaper.oversample = '4x';
    const bass = ctx.createBiquadFilter(); bass.type = 'lowshelf'; bass.frequency.value = 140;
    const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 750; mid.Q.value = 1.2;
    const treb = ctx.createBiquadFilter(); treb.type = 'highshelf'; treb.frequency.value = 2800;
    const cab = ctx.createBiquadFilter(); cab.type = 'lowpass'; cab.frequency.value = 4200;
    const master = ctx.createGain();
    src.connect(pre); pre.connect(shaper); shaper.connect(bass); bass.connect(mid); mid.connect(treb); treb.connect(cab); cab.connect(master); master.connect(ctx.destination);
    liveChain = { pre, shaper, bass, mid, treb, master };
    applyAudioParams();
    renderAmps();
  }catch(e){
    alert(lang === 'en' ? 'Please allow microphone/audio interface access in your browser.' : 'Permite el acceso al micrófono o interfaz de audio en tu navegador.');
  }
}

renderAmps();
