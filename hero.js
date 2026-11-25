function setupSymmetricHomeMenu(){
  const style = document.createElement('style');
  style.innerHTML = `
    header nav { display: none !important; }
    .home-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; min-height: calc(100vh - 190px); align-items: stretch; }
    @media (max-width: 680px) { .home-grid { grid-template-columns: 1fr; min-height: auto; } }
    .menu-tile { background: var(--card); border: 2px solid var(--border); border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all .22s ease; box-shadow: 0 4px 14px rgba(0,0,0,.03); }
    .menu-tile:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(180,83,9,.12); background: linear-gradient(180deg, #fffdf9 0%, #fef3c7 100%); }
    .tile-icon { width: 46px; height: 46px; border-radius: 12px; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid #f59e0b; }
    .tile-icon svg { width: 24px; height: 24px; stroke: currentColor; fill: none; stroke-width: 2; }
    .menu-tile h2 { font-size: 1.35rem; margin-bottom: .5rem; color: var(--text); }
    .menu-tile p { font-size: .95rem; color: var(--muted); line-height: 1.55; margin-bottom: 1.2rem; }
    .tile-cta { font-weight: 700; color: var(--accent); font-size: .92rem; display: inline-flex; align-items: center; gap: .35rem; }
  `;
  document.head.appendChild(style);

  const container = document.querySelector('.container');
  if(!container) return;

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  const home = document.createElement('section');
  home.id = 'sec-home';
  home.className = 'section active';

  home.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <h1 style="font-size:1.85rem;font-weight:800;color:var(--text);letter-spacing:-.4px" data-en="Play. Practice. Discover Your Sound." data-es="Toca. Practica. Descubre tu Sonido.">Play. Practice. Discover Your Sound.</h1>
      <p style="color:var(--muted);font-size:.98rem" data-en="Select a studio module below to start practicing" data-es="Selecciona un módulo del estudio para empezar a practicar">Select a studio module below to start practicing</p>
    </div>
    <div class="home-grid">
      <div class="menu-tile" onclick="openModule('jam')">
        <div>
          <div class="tile-icon"><svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
          <h2 data-en="Jam Studio" data-es="Estudio Jam">Jam Studio</h2>
          <p data-en="Build custom chord progressions up to 32 bars across 5 time signatures with a dynamic Rock, Funk, Blues, and Bossa backing band." data-es="Crea progresiones de hasta 32 compases en 5 métricas distintas con una banda dinámica de Rock, Funk, Blues y Bossa.">Build custom chord progressions up to 32 bars across 5 time signatures with a dynamic Rock, Funk, Blues, and Bossa backing band.</p>
        </div>
        <span class="tile-cta" data-en="Open Jam Studio →" data-es="Abrir Estudio Jam →">Open Jam Studio →</span>
      </div>
      <div class="menu-tile" onclick="openModule('fret')">
        <div>
          <div class="tile-icon"><svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="7" y1="6" x2="7" y2="18"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="17" y1="6" x2="17" y2="18"/></svg></div>
          <h2 data-en="Fretboard & Chords" data-es="Mástil y Acordes">Fretboard & Chords</h2>
          <p data-en="Visualize scales across the guitar neck and explore 120+ chords showing 3 playable voicings simultaneously with audio preview." data-es="Visualiza escalas en el diapasón y explora más de 120 acordes mostrando 3 posturas simultáneas con sonido real.">Visualize scales across the guitar neck and explore 120+ chords showing 3 playable voicings simultaneously with audio preview.</p>
        </div>
        <span class="tile-cta" data-en="Explore Fretboard →" data-es="Explorar Mástil →">Explore Fretboard →</span>
      </div>
      <div class="menu-tile" onclick="openModule('amps')">
        <div>
          <div class="tile-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><circle cx="12" cy="9" r="1.5"/><circle cx="16" cy="9" r="1.5"/><line x1="6" y1="15" x2="18" y2="15"/></svg></div>
          <h2 data-en="Live Guitar Amps" data-es="Amplis en Vivo">Live Guitar Amps</h2>
          <p data-en="Connect your guitar via audio interface and play live through 8 iconic artist presets with real-time adjustable EQ knobs." data-es="Conecta tu guitarra por interfaz de audio y toca en vivo con 8 amplificadores icónicos y controles de ecualización en tiempo real.">Connect your guitar via audio interface and play live through 8 iconic artist presets with real-time adjustable EQ knobs.</p>
        </div>
        <span class="tile-cta" data-en="Open Amp Room →" data-es="Entrar a Amplis →">Open Amp Room →</span>
      </div>
      <div class="menu-tile" onclick="openModule('indie')">
        <div>
          <div class="tile-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <h2 data-en="Indie Tracks" data-es="Pistas Indie">Indie Tracks</h2>
          <p data-en="Jam over community chord progressions or submit your original instrumental tracks with permission for musicians worldwide." data-es="Improvisa sobre progresiones de la comunidad o envía tus propias pistas instrumentales con permiso para músicos de todo el mundo.">Jam over community chord progressions or submit your original instrumental tracks with permission for musicians worldwide.</p>
        </div>
        <span class="tile-cta" data-en="Visit Indie Tracks →" data-es="Ver Pistas Indie →">Visit Indie Tracks →</span>
      </div>
    </div>`;

  container.prepend(home);

  const logo = document.querySelector('.logo');
  if(logo){ logo.style.cursor = 'pointer'; logo.onclick = goHome; }

  document.querySelectorAll('.section:not(#sec-home)').forEach(sec => {
    const backBar = document.createElement('div');
    backBar.style.marginBottom = '1rem';
    backBar.innerHTML = `<button class="btn sec" style="padding:.45rem .95rem;font-size:.88rem;font-weight:700" onclick="goHome()" data-en="← Main Menu" data-es="← Menú Principal">← Main Menu</button>`;
    sec.prepend(backBar);
  });
}

function openModule(id){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('sec-' + id);
  if(target) target.classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function goHome(){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const home = document.getElementById('sec-home');
  if(home) home.classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

setupSymmetricHomeMenu();
