let currentLang = 'en';
let isPlaying = false;
let timerID = null;
let currentStep = 0;
let currentChordIndex = 0;
let bpm = 100;

const chordNotes = {
    "A5": new Array(110.00, 164.81, 220.00),
    "G5": new Array(98.00, 146.83, 196.00),
    "D5": new Array(146.83, 220.00, 293.66),
    "E5": new Array(82.41, 123.47, 164.81),
    "F5": new Array(87.31, 130.81, 174.61),
    "C5": new Array(130.81, 196.00, 261.63),
    "Bb5": new Array(116.54, 174.61, 233.08),
    "E": new Array(82.41, 164.81, 207.65, 246.94),
    "B": new Array(123.47, 185.00, 246.94, 311.13),
    "C#m": new Array(138.59, 207.65, 277.18, 329.63),
    "A": new Array(110.00, 164.81, 220.00, 277.18),
    "G": new Array(98.00, 146.83, 196.00, 246.94),
    "D": new Array(146.83, 220.00, 293.66, 369.99),
    "Em": new Array(82.41, 123.47, 164.81, 196.00),
    "C": new Array(130.81, 196.00, 261.63, 329.63),
    "A7": new Array(110.00, 164.81, 196.00, 277.18),
    "D7": new Array(146.83, 220.00, 261.63, 369.99),
    "E7": new Array(82.41, 146.83, 207.65, 246.94),
    "B7": new Array(123.47, 185.00, 220.00, 311.13)
};

const progressions = {
    rock: new Array(
        { chords: new Array("A5", "G5", "D5", "A5"), scaleEn: "A Minor Pentatonic", scaleEs: "Pentatónica de La Menor" },
        { chords: new Array("E", "B", "C#m", "A"), scaleEn: "E Major / C# Minor Pentatonic", scaleEs: "Mi Mayor / Pentatónica de Do# Menor" },
        { chords: new Array("G", "D", "Em", "C"), scaleEn: "G Major Scale", scaleEs: "Escala de Sol Mayor" }
    ),
    blues: new Array(
        { chords: new Array("A7", "D7", "A7", "E7"), scaleEn: "A Blues Scale", scaleEs: "Escala de Blues en La" },
        { chords: new Array("E7", "A7", "B7", "E7"), scaleEn: "E Minor Pentatonic", scaleEs: "Pentatónica de Mi Menor" }
    ),
    metal: new Array(
        { chords: new Array("E5", "F5", "G5", "F5"), scaleEn: "E Phrygian Dominant", scaleEs: "Mi Frigio Dominante" },
        { chords: new Array("D5", "Bb5", "C5", "A5"), scaleEn: "D Natural Minor", scaleEs: "Re Menor Natural" }
    )
};

let activeProgression = progressions.rock.at(0);
const bassSteps = new Array(0, 2, 3, 4, 6);

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
    activeProgression = list.at(Math.floor(Math.random() * list.length));
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

    const chordName = activeProgression.chords.at(currentChordIndex);
    const notes = chordNotes[chordName] || new Array(110.00);
    const rootNote = notes.at(0);

    if (currentStep === 0) {
        playRockOrgan(notes, eighthDuration * 7.6);
        renderProgression();
    }

    if (bassSteps.includes(currentStep)) playBass(rootNote, eighthDuration * 0.9);
    playHiHat();
    if (currentStep === 0 || currentStep === 4 || currentStep === 5) playKick();
    if (currentStep === 2 || currentStep === 6) playSnare();

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
    btn.innerText = isPlaying 
        ? (currentLang === 'en' ? '⏹ Stop' : '⏹ Detener') 
        : (currentLang === 'en' ? '▶ Play Backing Track' : '▶ Reproducir Base');
    renderProgression();
}
