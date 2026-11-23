let lang = 'en';
let ctx = null;
let liveStream = null;
let liveAmpIdx = -1;

const ampPresets = new Array(
  {
    artist: "Kurt Cobain (Nirvana)", amp: "Fender Twin / DS-2",
    knobs: new Array({n:"Gain",v:7},{n:"Bass",v:6},{n:"Mid",v:4},{n:"Treble",v:8},{n:"Reverb",v:2}),
    en: "Bridge humbucker pickup. Keep mids slightly scooped and pair a clean amp with a BOSS DS-1/DS-2 distortion pedal. Add chorus for clean verses.",
    es: "Pastilla humbucker en el puente. Recorta ligeramente los medios y combina un ampli limpio con pedal BOSS DS-1/DS-2. Añade chorus en estrofas limpias."
  },
  {
    artist: "James Hetfield (Metallica)", amp: "Mesa Boogie Mark IIC+",
    knobs: new Array({n:"Gain",v:9},{n:"Bass",v:8},{n:"Mid",v:2},{n:"Treble",v:8},{n:"Reverb",v:0}),
    en: "Classic 'V-Shape' EQ: boost bass and treble aggressively while cutting mids to 2. Use tight palm-muting on the low E string.",
    es: "Ecualización clásica en 'V': sube graves y agudos al 8 y recorta los medios al 2. Usa palm-muting firme en la sexta cuerda."
  },
  {
    artist: "John Frusciante (RHCP)", amp: "Marshall Silver Jubilee",
    knobs: new Array({n:"Gain",v:4},{n:"Bass",v:7},{n:"Mid",v:6},{n:"Treble",v:5},{n:"Reverb",v:3}),
    en: "Set right on the edge of breakup with a Stratocaster neck pickup. Dig in for grit, or play softly for glassy funk cleans.",
    es: "Ajusta el ampli al borde de la saturación con Stratocaster en pastilla del mástil. Toca fuerte para romper o suave para limpios funk."
  },
  {
    artist: "Angus Young (AC/DC)", amp: "Marshall Plexi 1959",
    knobs: new Array({n:"Gain",v:6},{n:"Bass",v:5},{n:"Mid",v:7},{n:"Treble",v:7},{n:"Reverb",v:1}),
    en: "Pure power-tube crunch without pedals. Keep gain moderate so open chords ring clearly with punchy midrange.",
    es: "Crunch puro de válvulas sin pedales. Mantén la ganancia moderada para que los acordes abiertos suenen claros y con medios presentes."
  },
  {
    artist: "Slash (Guns N' Roses)", amp: "Marshall AFD100",
    knobs: new Array({n:"Gain",v:8},{n:"Bass",v:6},{n:"Mid",v:7},{n:"Treble",v:6},{n:"Reverb",v:3}),
    en: "Les Paul neck pickup with tone rolled back slightly for creamy solos, or bridge pickup for classic rock riffs.",
    es: "Pastilla del mástil de una Les Paul bajando un poco el tono para solos cremosos, o puente para riffs de rock clásico."
  },
  {
    artist: "David Gilmour (Pink Floyd)", amp: "Hiwatt DR103",
    knobs: new Array({n:"Gain",v:3},{n:"Bass",v:6},{n:"Mid",v:5},{n:"Treble",v:7},{n:"Reverb",v:6}),
    en: "High-headroom clean tone pushed by a compressor and Big Muff fuzz for soaring, atmospheric lead sustain.",
    es: "Tono limpio con mucho techo dinámico empujado por compresor y fuzz Big Muff para solos atmosféricos con sustain infinito."
  },
  {
    artist: "Alex Turner (Arctic Monkeys)", amp: "Vox AC30",
    knobs: new Array({n:"Gain",v:6},{n:"Bass",v:5},{n:"Mid",v:6},{n:"Treble",v:8},{n:"Reverb",v:4}),
    en: "Chimy British top-boost overdrive. Pair with a slapback delay and spring reverb for indie garage punch.",
    es: "Overdrive británico brillante tipo Top Boost. Combínalo con delay corto y reverb de muelles para pegada indie rock."
  },
  {
    artist: "B.B. King (Classic Blues)", amp: "Fender Twin Reverb",
    knobs: new Array({n:"Gain",v:3},{n:"Bass",v:6},{n:"Mid",v:7},{n:"Treble",v:5},{n:"Reverb",v:4}),
    en: "Warm, singing clean tone with vocal midrange. Roll guitar volume to 8 and let vibrato do the talking.",
    es: "Tono limpio cálido y cantante con medios vocales. Pon el volumen de la guitarra al 8 y deja que hable el vibrato."
  }
);
function unlockAudio(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!ctx) ctx = new AC();
  if(ctx.state === 'suspended') ctx.resume();
}

function renderAmps(){
  const box = document.getElementById('ampsContainer');
  if(!box) return;
  box.innerHTML = '';
  ampPresets.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'amp-card';
    let knobsHtml = '';
    item.knobs.forEach(k => {
      const deg = -135 + (k.v * 27);
      knobsHtml += `<div class="knob-unit"><div class="knob"><div class="knob-line" style="transform:rotate(${deg}deg)"></div></div><span class="knob-label">${k.n}</span><span class="knob-val">${k.v}</span></div>`;
    });
    const isThisLive = (liveAmpIdx === idx);
    const liveTxt = isThisLive ? (lang === 'en' ? 'Stop Guitar' : 'Detener Guitarra') : (lang === 'en' ? 'Play Guitar Live' : 'Tocar Guitarra en Vivo');
    const guideTxt = lang === 'en' ? 'Read Tone Guide ▾' : 'Leer Guía de Tono ▾';
    card.innerHTML = `<div class="amp-header" onclick="this.parentElement.classList.toggle('open')"><strong>${item.artist}</strong><span class="amp-brand">${item.amp}</span></div><div class="knobs-row">${knobsHtml}</div><div class="amp-actions"><button class="btn ${isThisLive ? 'live-on' : 'sec'}" onclick="toggleLiveAmp(${idx})">${liveTxt}</button><span style="font-size:.82rem;color:#b8b0a4;cursor:pointer" onclick="this.parentElement.parentElement.classList.toggle('open')" data-en="Read Tone Guide ▾" data-es="Leer Guía de Tono ▾">${guideTxt}</span></div><div class="amp-details" data-en="${item.en}" data-es="${item.es}">${lang === 'en' ? item.en : item.es}</div>`;
    box.appendChild(card);
  });
}

function makeDistortionCurve(amount){
  const k = amount * 35, n = 44100, curve = new Float32Array(n);
  for(let i = 0; i < n; i++){
    const x = i * 2 / n - 1;
    curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

async function toggleLiveAmp(idx){
  unlockAudio();
  if(liveStream){ liveStream.getTracks().forEach(t => t.stop()); liveStream = null; }
  if(liveAmpIdx === idx){ liveAmpIdx = -1; renderAmps(); return; }
  try{
    liveStream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const src = ctx.createMediaStreamSource(liveStream);
    const preset = ampPresets.at(idx).knobs;
    const gainVal = preset.at(0).v, bassVal = preset.at(1).v, midVal = preset.at(2).v, trebVal = preset.at(3).v;
    const pre = ctx.createGain(); pre.gain.value = 1 + (gainVal * 0.8);
    const shaper = ctx.createWaveShaper(); shaper.curve = makeDistortionCurve(gainVal); shaper.oversample = '4x';
    const bass = ctx.createBiquadFilter(); bass.type = 'lowshelf'; bass.frequency.value = 140; bass.gain.value = (bassVal - 5) * 2.5;
    const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 750; mid.Q.value = 1.2; mid.gain.value = (midVal - 5) * 2.8;
    const treb = ctx.createBiquadFilter(); treb.type = 'highshelf'; treb.frequency.value = 2800; treb.gain.value = (trebVal - 5) * 2.5;
    const cab = ctx.createBiquadFilter(); cab.type = 'lowpass'; cab.frequency.value = 4200;
    const master = ctx.createGain(); master.gain.value = 0.35;
    src.connect(pre); pre.connect(shaper); shaper.connect(bass); bass.connect(mid); mid.connect(treb); treb.connect(cab); cab.connect(master); master.connect(ctx.destination);
    liveAmpIdx = idx; renderAmps();
  }catch(e){
    alert(lang === 'en' ? 'Allow microphone/interface access to play guitar live.' : 'Permite el acceso al micrófono/interfaz para tocar la guitarra en vivo.');
  }
}

renderAmps();

