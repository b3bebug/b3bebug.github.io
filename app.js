let currentLang = 'en';
let isPlaying = false;
let audioCtx = null;
let timerID = null;
let currentStep = 0;
let currentChordIndex = 0;
let bpm = 100;

const chordNotes = {
    "A5": [110.00, 164.81, 220.00],
    "G5": [98.00, 146.83, 196.00],
    "D5": [146.83, 220.00, 293.66],
    "E5": [82.41, 123.47, 164.81],
    "F5": [87.31, 130.81, 174.61],
    "C5": [130.81, 196.00, 261.63],
    "Bb5": [116.54, 174.61, 233.08],
    "E": [82.41, 164.81, 207.65, 246.94],
    "B": [123.47, 185.00, 246.94, 311.13],
    "C#m": [138.59, 207.65, 277.18, 329.63],
    "A": [110.00, 164.81, 220.00, 277.18],
    "G": [98.00, 146.83, 196.00, 246.94],
    "D": [146.83, 220.00, 293.66, 369.99],
    "Em": [82.41, 123.47, 164.81, 196.00],
    "C": [130.81, 196.00, 261.63, 329.63],
    "A7": [110.00, 164.81, 196.00, 277.18],
    "D7": [146.83, 220.00, 261.63, 369.99],
    "E7": [82.41, 146.83, 207.65, 246.94],
    "B7": [123.47, 185.00, 220.00, 311.13]
};

const progressions = {
    rock: [
        { chords: ["A5", "G5", "D5", "A5"], scaleEn: "A Minor Pentatonic", scaleEs: "Pentatónica de La Menor" },
        { chords: ["E", "B", "C#m", "A"], scaleEn: "E Major / C# Minor Pentatonic", scaleEs: "Mi Mayor / Pentatónica de Do# Menor" },
        { chords: ["G", "D", "Em", "C"], scaleEn: "G Major Scale", scaleEs: "Escala de Sol Mayor" }
    ],
    blues: [
        { chords: ["A7", "D7", "A7", "E7"], scaleEn: "A Blues Scale", scaleEs: "Escala de Blues en La" },
        { chords: ["E7", "A7", "B7", "E7"], scaleEn: "E Minor Pentatonic", scaleEs: "Pentatónica de Mi Menor" }
    ],
    metal: [
        { chords: ["E5", "F5", "G5", "F5"], scaleEn: "E Phrygian Dominant", scaleEs: "Mi Frigio Dominante" },
        { chords: ["D5", "Bb5", "C5", "A5"], scaleEn: "D Natural Minor", scaleEs: "Re Menor Natural" }
    ]
};

let activeProgression = progressions.rock[0];
const organMultipliers =;
const bassSteps =;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playRockOrgan(freqs, duration) {
    initAudio();
    const now = audioCtx.currentTime;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.connect(audioCtx.destination);

    freqs.forEach(freq => {
        organMultipliers.forEach((mult, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx === 0 ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(freq * mult, now);

            const vol = idx === 0 ? 0.045 : 0.03;
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(vol, now + 0.04);
            gain.gain.setValueAtTime(vol, now + duration - 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);
            gain.connect(filter);
            osc.start(now);
            osc.stop(now + duration);
        });
    });
}

function playBass(rootFreq, duration) {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(rootFreq / 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
}

function playKick() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
}

function playSnare() {
    initAudio();
    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.18;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
}

function playHiHat() {
    initAudio();
    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
}

function playMetronomeClick(isAccent) {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1000 : 600, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
}

function renderProgression() {
    const resultDiv = document.getElementById('progressionResult');
    const chordText = activeProgression.chords.map((c, idx) => 
        (isPlaying && idx === currentChordIndex) ? `<span style="color:#f59e0b; text-decoration:underline;">${c}</span>` : c
    ).join(" - ");

    if (currentLang === 'en') {
        resultDiv.innerHTML = `<strong>Chords:</strong> ${chordText}<br><small style="color:#f59e0b;">Scale: ${activeProgression.scaleEn}</small>`;
    } else {
        resultDiv.innerHTML = `<strong>Acordes:</strong> ${chordText}<br><small style="color:#f59e0b;">Escala: ${activeProgression.scaleEs}</small>`;
    }
}

function generateProgression() {
    const genre = document.getElementById('genreSelect').value;
    const list = progressions[genre];
    const randomIndex = Math.floor(Math.random() * list.length);
    activeProgression = list[randomIndex];
    currentChordIndex = 0;
    currentStep = 0;
    renderProgression();
}

function tick() {
    const eighthDuration = (60 / bpm) / 2;
    const beatIndex = Math.floor(currentStep / 2);
    const isDownbeat = currentStep % 2 === 0;

    if (isDownbeat) {
        for (let i = 0; i < 4; i++) {
            document.getElementById(`dot${i}`).classList.toggle('active', i === beatIndex);
        }
        if (document.getElementById('metroCheck').checked) {
            playMetronomeClick(beatIndex === 0);
        }
    }

    const chordName = activeProgression.chords[currentChordIndex];
    const notes = chordNotes[chordName] || [110.00];
    const rootNote = notes[0];

    if (currentStep === 0) {
        playRockOrgan(notes, eighthDuration * 7.6);
        renderProgression();
    }

    if (bassSteps.includes(currentStep)) {
        playBass(rootNote, eighthDuration * 0.9);
    }

    playHiHat();

    if (currentStep === 0 || currentStep === 4 || currentStep === 5) {
        playKick();
    }

    if (currentStep === 2 || currentStep === 6) {
        playSnare();
    }

    currentStep++;
    if (currentStep >= 8) {
        currentStep = 0;
        currentChordIndex = (currentChordIndex + 1) % activeProgression.chords.length;
    }
}

function togglePlay() {
    const btn = document.getElementById('playBtn');
    if (isPlaying) {
        clearInterval(timerID);
        isPlaying = false;
        btn.classList.remove('stop-btn');
        btn.innerText = currentLang === 'en' ? '▶ Play Backing Track' : '▶ Reproducir Base';
        for (let i = 0; i < 4; i++) document.getElementById(`dot${i}`).classList.remove('active');
        renderProgression();
    } else {
        isPlaying = true;
        currentStep = 0;
        currentChordIndex = 0;
        btn.classList.add('stop-btn');
        btn.innerText = currentLang === 'en' ? '⏹ Stop' : '⏹ Detener';
        tick();
        timerID = setInterval(tick, ((60 / bpm) / 2) * 1000);
    }
}

function updateBPM(val) {
    bpm = val;
    document.getElementById('bpmVal').innerText = val;
    if (isPlaying) {
        clearInterval(timerID);
        timerID = setInterval(tick, ((60 / bpm) / 2) * 1000);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    document.getElementById('langBtn').innerText = currentLang === 'en' ? 'ES / Español' : 'EN / English';
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
    const btn = document.getElementById('playBtn');
    if (isPlaying) {
        btn.innerText = currentLang === 'en' ? '⏹ Stop' : '⏹ Detener';
    } else {
        btn.innerText = currentLang === 'en' ? '▶ Play Backing Track' : '▶ Reproducir Base';
    }
renderProgression();
}
