function setupLandingView(){
  const metaDesc = document.createElement('meta');
  metaDesc.name = 'description';
  metaDesc.content = 'ToneLab Studio: Free online guitar practice studio. Build custom chord progressions, explore fretboard scales & chords, and play through iconic live guitar amps.';
  document.head.appendChild(metaDesc);

  const container = document.querySelector('.container');
  if(!container) return;

  // Ocultar herramientas al entrar para mostrar la portada completa
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav .tab-btn').forEach(b => b.classList.remove('active'));

  const hero = document.createElement('section');
  hero.id = 'sec-home';
  hero.className = 'section active';

  hero.innerHTML = `
    <div class="card" style="background:linear-gradient(135deg,#fffdf9 0%,#fef3c7 100%);border:1px solid #d6c5a3;padding:2.4rem 2rem;margin-bottom:1.8rem">
      <span style="display:inline-block;background:#fffdf9;color:#92400e;border:1px solid #f59e0b;font-size:.75rem;font-weight:800;padding:.25rem .75rem;border-radius:99px;letter-spacing:.8px;margin-bottom:.9rem" data-en="ALL-IN-ONE GUITAR & MUSIC STUDIO" data-es="ESTUDIO MUSICAL TODO EN UNO">ALL-IN-ONE GUITAR & MUSIC STUDIO</span>
      <h1 style="font-size:2.35rem;line-height:1.15;color:#1f2937;margin-bottom:.8rem;font-weight:800;letter-spacing:-.5px" data-en="Play. Practice. Discover Your Sound." data-es="Toca. Practica. Descubre tu Sonido.">Play. Practice. Discover Your Sound.</h1>
      <p style="color:#4b5563;font-size:1.08rem;max-width:660px;margin-bottom:1.5rem" data-en="A professional browser-based practice environment. Build dynamic backing tracks, visualize 120+ chords and scales, and play your guitar through classic amp models." data-es="Un entorno profesional de práctica en tu navegador. Crea pistas de acompañamiento dinámicas, visualiza más de 120 acordes y escalas y toca con amplificadores clásicos.">A professional browser-based practice environment. Build dynamic backing tracks, visualize 120+ chords and scales, and play your guitar through classic amp models.</p>
      <div style="display:flex;flex-wrap:wrap;gap:.8rem">
        <button class="btn" style="padding:.75rem 1.4rem;font-size:1rem" onclick="enterStudio('jam',0)" data-en="Launch Jam Studio →" data-es="Abrir Estudio Jam →">Launch Jam Studio →</button>
        <button class="btn sec" style="padding:.75rem 1.4rem;font-size:1rem;background:#fffdf9" onclick="enterStudio('amps',2)" data-en="Try Live Guitar Amps" data-es="Probar Amplis en Vivo">Try Live Guitar Amps</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-bottom:1.8rem">
      <div class="card" onclick="enterStudio('jam',0)" style="margin:0;cursor:pointer;transition:.2s;border-left:4px solid var(--accent)">
        <h3 style="margin-top:0;font-size:1.15rem" data-en="1. Jam Studio & Backing Band" data-es="1. Estudio Jam y Banda Dinámica">1. Jam Studio & Backing Band</h3>
        <p style="font-size:.92rem;color:var(--muted);margin-bottom:.8rem" data-en="Create up to 32-bar chord progressions in 4/4, 3/4, 6/8, 9/8, or 5/4 with dynamic Rock, Funk, Blues, and Bossa grooves." data-es="Crea progresiones de hasta 32 compases en 4/4, 3/4, 6/8, 9/8 o 5/4 con ritmos dinámicos de Rock, Funk, Blues y Bossa.">Create up to 32-bar chord progressions in 4/4, 3/4, 6/8, 9/8, or 5/4 with dynamic Rock, Funk, Blues, and Bossa grooves.</p>
        <span style="color:var(--accent);font-weight:700;font-size:.88rem" data-en="Open Jam Studio →" data-es="Entrar al Estudio →">Open Jam Studio →</span>
      </div>
      <div class="card" onclick="enterStudio('fret',1)" style="margin:0;cursor:pointer;transition:.2s;border-left:4px solid var(--accent)">
        <h3 style="margin-top:0;font-size:1.15rem" data-en="2. Interactive Fretboard & Chords" data-es="2. Mástil Interactivo y Acordes">2. Interactive Fretboard & Chords</h3>
        <p style="font-size:.92rem;color:var(--muted);margin-bottom:.8rem" data-en="Visualize scales across the neck and explore our chord dictionary showing 3 playable voicings with audio preview." data-es="Visualiza escalas en el diapasón y explora nuestro diccionario con 3 posturas distintas por acorde y sonido real.">Visualize scales across the neck and explore our chord dictionary showing 3 playable voicings with audio preview.</p>
        <span style="color:var(--accent);font-weight:700;font-size:.88rem" data-en="Explore Fretboard →" data-es="Explorar Mástil →">Explore Fretboard →</span>
      </div>
      <div class="card" onclick="enterStudio('amps',2)" style="margin:0;cursor:pointer;transition:.2s;border-left:4px solid var(--accent)">
        <h3 style="margin-top:0;font-size:1.15rem" data-en="3. Live Guitar Amp Simulator" data-es="3. Simulador de Amplis en Vivo">3. Live Guitar Amp Simulator</h3>
        <p style="font-size:.92rem;color:var(--muted);margin-bottom:.8rem" data-en="Plug in your guitar interface and play in real time through 8 iconic artist amp presets with live adjustable EQ knobs." data-es="Conecta tu interfaz de guitarra y toca en tiempo real con 8 amplificadores icónicos y perillas de ecualización vivas.">Plug in your guitar interface and play in real time through 8 iconic artist amp presets with live adjustable EQ knobs.</p>
        <span style="color:var(--accent);font-weight:700;font-size:.88rem" data-en="Open Amp Room →" data-es="Entrar a Amplis →">Open Amp Room →</span>
      </div>
      <div class="card" onclick="enterStudio('indie',3)" style="margin:0;cursor:pointer;transition:.2s;border-left:4px solid var(--accent)">
        <h3 style="margin-top:0;font-size:1.15rem" data-en="4. Indie Artists Community" data-es="4. Comunidad de Artistas Indie">4. Indie Artists Community</h3>
        <p style="font-size:.92rem;color:var(--muted);margin-bottom:.8rem" data-en="Practice over community chord progressions or submit your own original instrumental tracks for musicians worldwide." data-es="Practica sobre progresiones de la comunidad o envía tus propias pistas instrumentales para músicos de todo el mundo.">Practice over community chord progressions or submit your own original instrumental tracks for musicians worldwide.</p>
        <span style="color:var(--accent);font-weight:700;font-size:.88rem" data-en="Visit Indie Tracks →" data-es="Ver Pistas Indie →">Visit Indie Tracks →</span>
      </div>
    </div>`;

  container.prepend(hero);
  const logo = document.querySelector('.logo');
  if(logo){
    logo.style.cursor = 'pointer';
    logo.onclick = goHome;
  }

  document.querySelectorAll('.section:not(#sec-home)').forEach(sec => {
    const backBar = document.createElement('div');
    backBar.style.marginBottom = '.8rem';
    backBar.innerHTML = `<button class="btn sec" style="padding:.4rem .85rem;font-size:.85rem" onclick="goHome()" data-en="← Back to Home" data-es="← Volver al Inicio">← Back to Home</button>`;
    sec.prepend(backBar);
  });
}

function enterStudio(tabId, btnIndex){
  const btns = document.querySelectorAll('nav .tab-btn');
  if(btns.at(btnIndex)) showTab(tabId, btns.at(btnIndex));
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function goHome(){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav .tab-btn').forEach(b => b.classList.remove('active'));
  const home = document.getElementById('sec-home');
  if(home) home.classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

setupLandingView();
