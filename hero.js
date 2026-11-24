function injectSEOandHero(){
  const metaDesc = document.createElement('meta');
  metaDesc.name = 'description';
  metaDesc.content = 'ToneLab Studio: Free online guitar practice studio. Build custom chord progressions, explore fretboard scales & chords, and play through iconic live guitar amps.';
  document.head.appendChild(metaDesc);

  const container = document.querySelector('.container');
  if(!container) return;

  const hero = document.createElement('div');
  hero.className = 'card';
  hero.style.background = 'linear-gradient(135deg, #fffdf9 0%, #fef3c7 100%)';
  hero.style.border = '1px solid #d6c5a3';
  hero.style.marginBottom = '1.8rem';

  hero.innerHTML = `
    <span style="display:inline-block;background:#fef3c7;color:#92400e;border:1px solid #f59e0b;font-size:.75rem;font-weight:800;padding:.2rem .65rem;border-radius:99px;letter-spacing:.6px;margin-bottom:.7rem" data-en="YOUR GUITAR PRACTICE STUDIO" data-es="TU ESTUDIO DE PRÁCTICA DE GUITARRA">YOUR GUITAR PRACTICE STUDIO</span>
    <h1 style="font-size:2rem;line-height:1.2;color:#1f2937;margin-bottom:.6rem;font-weight:800" data-en="Play. Practice. Discover Your Sound." data-es="Toca. Practica. Descubre tu Sonido.">Play. Practice. Discover Your Sound.</h1>
    <p style="color:#4b5563;font-size:1.02rem;max-width:680px;margin-bottom:1.2rem" data-en="Create custom chord progressions, explore guitar scales and chords, and experiment with iconic amp tones. Everything you need to improve your playing in one place." data-es="Crea progresiones de acordes a medida, explora escalas y acordes en el mástil y experimenta con amplificadores icónicos. Todo en un mismo lugar.">Create custom chord progressions, explore guitar scales and chords, and experiment with iconic amp tones. Everything you need to improve your playing in one place.</p>
    <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-bottom:1.5rem">
      <button class="btn" onclick="document.getElementById('sec-jam').scrollIntoView({behavior:'smooth'})" data-en="Start Jamming →" data-es="Empezar a Tocar →">Start Jamming →</button>
      <button class="btn sec" onclick="document.getElementById('howItWorks').scrollIntoView({behavior:'smooth'})" data-en="How It Works" data-es="Cómo Funciona">How It Works</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.75rem">
      <div onclick="openToolCard('jam',0)" style="background:#fffdf9;border:1px solid var(--border);padding:.9rem;border-radius:10px;cursor:pointer">
        <strong style="color:var(--accent);display:block" data-en="Jam Studio" data-es="Estudio Jam">Jam Studio</strong>
        <span style="font-size:.85rem;color:var(--muted)" data-en="Build custom progressions" data-es="Crea tus progresiones">Build custom progressions</span>
      </div>
      <div onclick="openToolCard('fret',1)" style="background:#fffdf9;border:1px solid var(--border);padding:.9rem;border-radius:10px;cursor:pointer">
        <strong style="color:var(--accent);display:block" data-en="Fretboard & Chords" data-es="Mástil y Acordes">Fretboard & Chords</strong>
        <span style="font-size:.85rem;color:var(--muted)" data-en="Learn scales & 120 chords" data-es="Escalas y 120 acordes">Learn scales & 120 chords</span>
      </div>
      <div onclick="openToolCard('amps',2)" style="background:#fffdf9;border:1px solid var(--border);padding:.9rem;border-radius:10px;cursor:pointer">
        <strong style="color:var(--accent);display:block" data-en="Amp Simulator" data-es="Simulador de Amplis">Amp Simulator</strong>
        <span style="font-size:.85rem;color:var(--muted)" data-en="Shape your guitar tone" data-es="Moldea tu sonido en vivo">Shape your guitar tone</span>
      </div>
      <div onclick="openToolCard('indie',3)" style="background:#fffdf9;border:1px solid var(--border);padding:.9rem;border-radius:10px;cursor:pointer">
        <strong style="color:var(--accent);display:block" data-en="Indie Tracks" data-es="Pistas Indie">Indie Tracks</strong>
        <span style="font-size:.85rem;color:var(--muted)" data-en="Discover independent music" data-es="Descubre música indie">Discover independent music</span>
      </div>
    </div>
    <div id="howItWorks" style="margin-top:1.4rem;padding-top:1.2rem;border-top:1px dashed #d6c5a3;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;font-size:.88rem">
      <div><strong style="color:#1f2937" data-en="1. Choose a Tool" data-es="1. Elige Herramienta">1. Choose a Tool</strong><p style="color:var(--muted)" data-en="Pick Jam Studio, Fretboard, or Live Amps." data-es="Selecciona Estudio Jam, Mástil o Amplis.">Pick Jam Studio, Fretboard, or Live Amps.</p></div>
      <div><strong style="color:#1f2937" data-en="2. Customize Your Setup" data-es="2. Personaliza tu Ajuste">2. Customize Your Setup</strong><p style="color:var(--muted)" data-en="Set chords, tempo, groove style, or amp EQ." data-es="Ajusta acordes, tempo, estilo o ecualización.">Set chords, tempo, groove style, or amp EQ.</p></div>
      <div><strong style="color:#1f2937" data-en="3. Practice & Improve" data-es="3. Practica y Mejora">3. Practice & Improve</strong><p style="color:var(--muted)" data-en="Jam along with the band or play live." data-es="Improvisa con la banda o toca en vivo.">Jam along with the band or play live.</p></div>
    </div>`;

  container.prepend(hero);
}

function openToolCard(tabId, btnIndex){
  const btns = document.querySelectorAll('nav .tab-btn');
  if(btns.at(btnIndex)) showTab(tabId, btns.at(btnIndex));
  document.getElementById('sec-' + tabId).scrollIntoView({behavior:'smooth'});
}

injectSEOandHero();
