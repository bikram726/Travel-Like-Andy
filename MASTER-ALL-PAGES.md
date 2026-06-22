# Travel Like Andy — Master Code Reference

Single source of truth for all six Squarespace page code blocks + global Custom CSS.

**How to use:** Find the page you need below, copy everything inside its fenced code block, paste into that page's Squarespace Code Block (Edit → select all → delete → paste → Save). Each page is independent — Squarespace does not support one block driving multiple pages, so this file exists purely as your single editable reference; it does not get pasted anywhere as a whole.

Edit this file first when making changes, then copy the relevant section out to Squarespace.

---

## 1. HOME — `/` (Not Linked, reached via logo)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.tla-home-wrap { width:100vw; position:relative; left:calc(-50vw + 50%); overflow:hidden; }
.tla-home { --gold:#c8af78; --gold-bright:#dfc898; --bg:#0a0a0a; --surface:#0d0d0a; --text:#f0ebe0; --muted:#7a7060; background:var(--bg); color:var(--text); font-family:'Montserrat',sans-serif; font-weight:300; width:100%; }
.tla-home * { box-sizing:border-box; }
.tla-home h1,.tla-home h2,.tla-home h3 { font-family:'Cormorant Garamond',serif; font-weight:300; color:var(--text); margin:0; }
.tla-home em { font-style:italic; color:var(--gold); font-weight:300; }
.tla-home .tlah-hero { min-height:80vh; display:flex; align-items:center; justify-content:center; padding:6rem 1.5rem; text-align:center; background:radial-gradient(ellipse at 50% 100%, rgba(200,175,120,0.08), transparent 60%), linear-gradient(180deg,#0a0a0a 0%,#050505 100%); }
.tla-home .tlah-hero-inner { max-width:900px; }
.tla-home .tlah-hero h1 { font-size:clamp(2rem,6vw,4.5rem); line-height:1.1; margin-bottom:1.5rem; }
.tla-home .tlah-sub { color:var(--muted); font-size:0.85rem; letter-spacing:0.2em; text-transform:uppercase; margin:0 0 2.5rem; line-height:1.6; }
.tla-home .tlah-btn { display:inline-block; padding:1.1em 2.6em; border:1px solid var(--gold); color:var(--gold); text-decoration:none; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.4s ease; background:transparent; }
.tla-home .tlah-btn:hover { background:var(--gold); color:var(--bg); }
.tla-home .tlah-div { padding:5rem 1.5rem; background:var(--bg); }
.tla-home .tlah-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
.tla-home .tlah-card { background:var(--surface); border:1px solid rgba(200,175,120,0.18); padding:3rem 1.5rem; text-decoration:none; color:var(--text); text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:all 0.5s ease; min-height:300px; }
.tla-home .tlah-card:hover { border-color:var(--gold); transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.6); }
.tla-home .tlah-mark { font-family:'Cormorant Garamond',serif; font-size:3.5rem; font-style:italic; color:var(--gold); line-height:1; margin-bottom:1.2rem; }
.tla-home .tlah-card h2 { font-size:1.5rem; margin-bottom:0.8rem; letter-spacing:0.03em; line-height:1.2; }
.tla-home .tlah-card p { color:var(--muted); font-size:0.78rem; letter-spacing:0.12em; text-transform:uppercase; margin:0 0 1.8rem; line-height:1.5; }
.tla-home .tlah-card .tlah-invite { color:var(--gold); font-style:italic; text-transform:none; letter-spacing:0.05em; font-size:0.85rem; font-family:'Cormorant Garamond',serif; }
.tla-home .tlah-arrow { color:var(--gold); font-size:0.72rem; letter-spacing:0.2em; text-transform:uppercase; transition:transform 0.4s ease; }
.tla-home .tlah-card:hover .tlah-arrow { transform:translateX(8px); }
.tla-home .tlah-trust { padding:3rem 1.5rem; border-top:0.5px solid rgba(200,175,120,0.2); border-bottom:0.5px solid rgba(200,175,120,0.2); text-align:center; }
.tla-home .tlah-trust p { color:var(--muted); font-size:0.72rem; letter-spacing:0.25em; text-transform:uppercase; margin:0; line-height:1.8; }
.tla-home .tlah-about { padding:6rem 1.5rem; background:var(--bg); }
.tla-home .tlah-about-inner { max-width:760px; margin:0 auto; text-align:center; }
.tla-home .tlah-about-inner h3 { font-size:clamp(1.6rem,4vw,2.6rem); font-style:italic; margin-bottom:1.5rem; }
.tla-home .tlah-about-inner p { color:var(--text); font-size:1rem; line-height:1.8; font-weight:300; margin:0 0 2rem; }
.tla-home .tlah-link { color:var(--gold); text-decoration:none; letter-spacing:0.18em; text-transform:uppercase; font-size:0.75rem; border-bottom:1px solid var(--gold); padding-bottom:0.3rem; transition:all 0.3s ease; }
.tla-home .tlah-link:hover { color:var(--gold-bright); }
.tla-home .tlah-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.9s ease, transform 0.9s ease; }
.tla-home .tlah-reveal.tlah-in { opacity:1; transform:translateY(0); }
@media (prefers-reduced-motion: reduce) { .tla-home .tlah-reveal { opacity:1; transform:none; transition:none; } }
@media (max-width:767px) {
  .tla-home .tlah-grid { grid-template-columns:1fr; gap:1rem; }
  .tla-home .tlah-card { min-height:200px; padding:2.5rem 1.5rem; }
  .tla-home .tlah-hero { min-height:70vh; padding:4rem 1.2rem; }
  .tla-home .tlah-mark { font-size:3rem; }
  .tla-home .tlah-card h2 { font-size:1.4rem; }
  .tla-home .tlah-div,.tla-home .tlah-about { padding:4rem 1.2rem; }
  .tla-home .tlah-sub { font-size:0.72rem; letter-spacing:0.15em; }
  .tla-home .tlah-trust p { font-size:0.62rem; letter-spacing:0.15em; }
}
</style>
<div class="tla-home-wrap"><div class="tla-home">
  <section class="tlah-hero"><div class="tlah-hero-inner">
    <h1>Some people see the world.<br><em>A rare few experience it.</em></h1>
    <p class="tlah-sub">Curated journeys by Andy Eisenmann<br>Fora Travel Partner</p>
    <a href="/contact" class="tlah-btn">Tell Andy where you dream of going</a>
  </div></section>
  <section class="tlah-div tlah-reveal"><div class="tlah-grid">
    <a href="/leisure" class="tlah-card"><div class="tlah-mark">L</div><h2>Leisure Travel</h2><p>Vacations &middot; Resorts &middot; Cruises</p><span class="tlah-arrow">Explore &rarr;</span></a>
    <a href="/corporate" class="tlah-card"><div class="tlah-mark">C</div><h2>Corporate &amp; Group Travel</h2><span class="tlah-arrow">Explore &rarr;</span></a>
    <a href="/bespoke" class="tlah-card"><div class="tlah-mark">B</div><h2>Luxury Bespoke Travel</h2><p class="tlah-invite">By Invitation Only</p><span class="tlah-arrow">Enter &rarr;</span></a>
  </div></section>
  <section class="tlah-trust tlah-reveal"><p>Fora Travel Partner &nbsp;&middot;&nbsp; 50+ Countries &nbsp;&middot;&nbsp; #travellikeandy</p></section>
  <section class="tlah-about tlah-reveal"><div class="tlah-about-inner">
    <h3>I have circled the globe twice.</h3>
    <p>I sang opera for the King of Thailand. I hiked the Himalayas. I know the chef in Mexico City who opens his kitchen after midnight, and the room at the Taj Palace that faces the sunrise.</p>
    <a href="/about" class="tlah-link">More about Andy &rarr;</a>
  </div></section>
</div></div>
<script>
(function(){
  var els = document.querySelectorAll('.tlah-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('tlah-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('tlah-in'); io.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
```

---

## 2. LEISURE — `/leisure` (warm cream palette)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.tla-leisure-wrap { width:100vw; position:relative; left:calc(-50vw + 50%); overflow:hidden; }
.tla-leisure { --bg:#f5ede0; --surface:#ffffff; --surface-2:#fbf6ec; --gold:#a8894e; --navy:#1a3a5c; --ink:#1a1a1a; --muted:#7a7263; background:var(--bg); color:var(--ink); font-family:'Montserrat',sans-serif; font-weight:300; width:100%; }
.tla-leisure * { box-sizing:border-box; }
.tla-leisure h1,.tla-leisure h2,.tla-leisure h3 { font-family:'Cormorant Garamond',serif; font-weight:300; color:var(--ink); margin:0; }
.tla-leisure em { font-style:italic; color:var(--gold); font-weight:300; }
.tla-leisure .tlal-hero { min-height:70vh; display:flex; align-items:center; justify-content:center; padding:6rem 1.5rem; text-align:center; background:radial-gradient(ellipse at 50% 0%, rgba(168,137,78,0.12), transparent 60%), var(--bg); border-bottom:0.5px solid rgba(26,58,92,0.15); }
.tla-leisure .tlal-hero-inner { max-width:880px; }
.tla-leisure .tlal-hero h1 { font-size:clamp(2rem,5.5vw,4rem); line-height:1.15; margin-bottom:1.4rem; }
.tla-leisure .tlal-sub { color:var(--navy); font-size:0.85rem; letter-spacing:0.2em; text-transform:uppercase; margin:0 0 2.5rem; }
.tla-leisure .tlal-btn { display:inline-block; padding:1.1em 2.6em; border:1px solid var(--gold); color:var(--gold); text-decoration:none; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.4s ease; }
.tla-leisure .tlal-btn:hover { background:var(--gold); color:#fff; }
.tla-leisure .tlal-section { padding:5.5rem 1.5rem; }
.tla-leisure .tlal-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
.tla-leisure .tlal-card { background:var(--surface); border:1px solid rgba(26,58,92,0.12); padding:2.6rem 1.6rem; text-align:center; transition:all 0.4s ease; }
.tla-leisure .tlal-card:hover { border-color:var(--gold); transform:translateY(-5px); box-shadow:0 20px 50px rgba(26,58,92,0.1); }
.tla-leisure .tlal-mark { font-family:'Cormorant Garamond',serif; font-size:2.8rem; font-style:italic; color:var(--gold); margin-bottom:1rem; }
.tla-leisure .tlal-card h3 { font-size:1.3rem; margin-bottom:0.7rem; }
.tla-leisure .tlal-card p { color:var(--muted); font-size:0.85rem; line-height:1.6; margin:0; }
.tla-leisure .tlal-feature { width:100%; display:table; table-layout:fixed; background:var(--surface-2); }
.tla-leisure .tlal-feature-cell { display:table-cell; vertical-align:middle; width:50%; padding:4.5rem 4vw; }
.tla-leisure .tlal-feature-cell.tlal-img { background:url('https://images.unsplash.com/photo-1559599189-fe84dea4eac3?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat; min-height:420px; }
.tla-leisure .tlal-feature h2 { font-size:clamp(1.6rem,3.6vw,2.4rem); font-style:italic; margin-bottom:1.2rem; }
.tla-leisure .tlal-feature p { color:var(--muted); font-size:0.95rem; line-height:1.8; margin:0 0 1.8rem; }
.tla-leisure .tlal-close { background:var(--navy); color:#f0ebe0; text-align:center; padding:5.5rem 1.5rem; }
.tla-leisure .tlal-close h2 { color:#f0ebe0; font-size:clamp(1.8rem,4vw,2.6rem); font-style:italic; margin-bottom:1.6rem; }
.tla-leisure .tlal-close .tlal-btn { border-color:#dcc89a; color:#dcc89a; }
.tla-leisure .tlal-close .tlal-btn:hover { background:#dcc89a; color:var(--navy); }
.tla-leisure .tlal-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.9s ease, transform 0.9s ease; }
.tla-leisure .tlal-reveal.tlal-in { opacity:1; transform:translateY(0); }
@media (prefers-reduced-motion: reduce) { .tla-leisure .tlal-reveal { opacity:1; transform:none; } }
@media (max-width:767px) {
  .tla-leisure .tlal-grid { grid-template-columns:1fr; }
  .tla-leisure .tlal-feature, .tla-leisure .tlal-feature-cell { display:block; width:100%; }
  .tla-leisure .tlal-feature-cell.tlal-img { min-height:260px; }
  .tla-leisure .tlal-feature-cell { padding:3rem 1.4rem; }
  .tla-leisure .tlal-section { padding:3.5rem 1.2rem; }
}
</style>
<div class="tla-leisure-wrap"><div class="tla-leisure">
  <section class="tlal-hero"><div class="tlal-hero-inner">
    <h1>The trip you have always meant to take.<br><em>Now is the time.</em></h1>
    <p class="tlal-sub">Vacations &middot; Resorts &middot; Cruises</p>
    <a href="/contact" class="tlal-btn">Tell Andy where you dream of going</a>
  </div></section>

  <section class="tlal-section tlal-reveal"><div class="tlal-grid">
    <div class="tlal-card"><div class="tlal-mark">&#10042;</div><h3>Family Vacations</h3><p>Itineraries that work for every generation, from the youngest to the most particular.</p></div>
    <div class="tlal-card"><div class="tlal-mark">&#10042;</div><h3>Honeymoons</h3><p>The first journey of a marriage, designed around the two people taking it.</p></div>
    <div class="tlal-card"><div class="tlal-mark">&#10042;</div><h3>Cruises</h3><p>From intimate small-ship sailings to the grand classics, mapped to how you actually want to travel.</p></div>
    <div class="tlal-card"><div class="tlal-mark">&#10042;</div><h3>Group Tours</h3><p>Friends, family, milestone trips — coordinated so no one is left managing logistics.</p></div>
    <div class="tlal-card"><div class="tlal-mark">&#10042;</div><h3>Resort Stays</h3><p>The right resort, the right room category, the right week — not just any week.</p></div>
    <div class="tlal-card"><div class="tlal-mark">&#10042;</div><h3>Fora Hotel Upgrades</h3><p>Access to upgrades, amenities, and attention through my Fora Travel partnership.</p></div>
  </div></section>

  <section class="tlal-feature tlal-reveal">
    <div class="tlal-feature-cell tlal-img" role="img" aria-label="Resort coastline at golden hour"></div>
    <div class="tlal-feature-cell">
      <h2>I plan the way I travel myself.</h2>
      <p>Every itinerary I build comes from places I have actually stood — resorts I have walked through, ships I have sailed, rooms I have slept in. I do not send you somewhere I would not go.</p>
      <a href="/contact" class="tlal-btn">Start The Conversation</a>
    </div>
  </section>

  <section class="tlal-close">
    <h2>Tell Andy where you dream of going.</h2>
    <a href="/contact" class="tlal-btn">Tell Andy</a>
  </section>
</div></div>
<script>
(function(){
  var els = document.querySelectorAll('.tlal-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('tlal-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('tlal-in'); io.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
```

---

## 3. CORPORATE — `/corporate` (deep navy palette)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.tla-corp-wrap { width:100vw; position:relative; left:calc(-50vw + 50%); overflow:hidden; }
.tla-corp { --bg:#0f1a2e; --surface:#162439; --surface-2:#1b2c44; --gold:#c8af78; --text:#f0ebe0; --muted:#8a96a8; background:var(--bg); color:var(--text); font-family:'Montserrat',sans-serif; font-weight:300; width:100%; }
.tla-corp * { box-sizing:border-box; }
.tla-corp h1,.tla-corp h2,.tla-corp h3 { font-family:'Cormorant Garamond',serif; font-weight:300; color:var(--text); margin:0; }
.tla-corp em { font-style:italic; color:var(--gold); font-weight:300; }
.tla-corp .tlac-hero { min-height:70vh; display:flex; align-items:center; justify-content:center; padding:6rem 1.5rem; text-align:center; background:radial-gradient(ellipse at 50% 0%, rgba(200,175,120,0.1), transparent 60%), linear-gradient(180deg,#0f1a2e 0%,#0a1322 100%); }
.tla-corp .tlac-hero-inner { max-width:880px; }
.tla-corp .tlac-hero h1 { font-size:clamp(2rem,5.5vw,4rem); line-height:1.15; margin-bottom:1.4rem; }
.tla-corp .tlac-sub { color:var(--muted); font-size:0.85rem; letter-spacing:0.2em; text-transform:uppercase; margin:0 0 2.5rem; }
.tla-corp .tlac-btn { display:inline-block; padding:1.1em 2.6em; border:1px solid var(--gold); color:var(--gold); text-decoration:none; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.4s ease; margin:0 0.5rem; }
.tla-corp .tlac-btn:hover { background:var(--gold); color:var(--bg); }
.tla-corp .tlac-btn.tlac-ghost { border-color:rgba(200,175,120,0.4); color:var(--muted); }
.tla-corp .tlac-btn.tlac-ghost:hover { border-color:var(--gold); color:var(--gold); background:transparent; }
.tla-corp .tlac-quote { padding:4.5rem 1.5rem; text-align:center; border-top:0.5px solid rgba(200,175,120,0.15); border-bottom:0.5px solid rgba(200,175,120,0.15); }
.tla-corp .tlac-quote p { max-width:760px; margin:0 auto; font-family:'Cormorant Garamond',serif; font-style:italic; font-size:clamp(1.3rem,2.6vw,1.9rem); line-height:1.6; color:var(--text); }
.tla-corp .tlac-section { padding:5.5rem 1.5rem; }
.tla-corp .tlac-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
.tla-corp .tlac-card { background:var(--surface); border:1px solid rgba(200,175,120,0.18); padding:2.6rem 1.6rem; text-align:center; transition:all 0.4s ease; }
.tla-corp .tlac-card:hover { border-color:var(--gold); transform:translateY(-5px); box-shadow:0 20px 50px rgba(0,0,0,0.4); }
.tla-corp .tlac-mark { font-family:'Cormorant Garamond',serif; font-size:2.8rem; font-style:italic; color:var(--gold); margin-bottom:1rem; }
.tla-corp .tlac-card h3 { font-size:1.3rem; margin-bottom:0.7rem; }
.tla-corp .tlac-card p { color:var(--muted); font-size:0.85rem; line-height:1.6; margin:0; }
.tla-corp .tlac-feature { width:100%; display:table; table-layout:fixed; background:var(--surface-2); }
.tla-corp .tlac-feature-cell { display:table-cell; vertical-align:middle; width:50%; padding:4.5rem 4vw; }
.tla-corp .tlac-feature-cell.tlac-img { background:url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat; min-height:420px; }
.tla-corp .tlac-feature h2 { font-size:clamp(1.6rem,3.6vw,2.4rem); font-style:italic; margin-bottom:1.2rem; }
.tla-corp .tlac-feature p { color:var(--muted); font-size:0.95rem; line-height:1.8; margin:0 0 1.8rem; }
.tla-corp .tlac-close { text-align:center; padding:5.5rem 1.5rem; border-top:0.5px solid rgba(200,175,120,0.15); }
.tla-corp .tlac-close h2 { font-size:clamp(1.8rem,4vw,2.6rem); font-style:italic; margin-bottom:1.6rem; }
.tla-corp .tlac-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.9s ease, transform 0.9s ease; }
.tla-corp .tlac-reveal.tlac-in { opacity:1; transform:translateY(0); }
@media (prefers-reduced-motion: reduce) { .tla-corp .tlac-reveal { opacity:1; transform:none; } }
@media (max-width:767px) {
  .tla-corp .tlac-grid { grid-template-columns:1fr; }
  .tla-corp .tlac-feature, .tla-corp .tlac-feature-cell { display:block; width:100%; }
  .tla-corp .tlac-feature-cell.tlac-img { min-height:260px; }
  .tla-corp .tlac-feature-cell { padding:3rem 1.4rem; }
  .tla-corp .tlac-section { padding:3.5rem 1.2rem; }
  .tla-corp .tlac-btn { display:inline-block; margin:0.4rem; }
}
</style>
<div class="tla-corp-wrap"><div class="tla-corp">
  <section class="tlac-hero"><div class="tlac-hero-inner">
    <h1>Travel that respects <em>your time.</em></h1>
    <p class="tlac-sub">Executive &amp; Group Travel</p>
    <a href="/contact" class="tlac-btn">Speak With Andy</a>
    <a href="/contact" class="tlac-btn tlac-ghost">Request A Proposal</a>
  </div></section>

  <section class="tlac-quote"><p>Your team's time is the most expensive thing on the trip. I plan around that, not around the brochure.</p></section>

  <section class="tlac-section tlac-reveal"><div class="tlac-grid">
    <div class="tlac-card"><div class="tlac-mark">&#10042;</div><h3>Executive Travel</h3><p>Itineraries built for people whose schedules cannot absorb a wasted hour.</p></div>
    <div class="tlac-card"><div class="tlac-mark">&#10042;</div><h3>Conferences</h3><p>Room blocks, transfers, and timing coordinated so the event runs and nothing else does.</p></div>
    <div class="tlac-card"><div class="tlac-mark">&#10042;</div><h3>Incentive Trips</h3><p>Reward travel designed to feel earned, not generic.</p></div>
    <div class="tlac-card"><div class="tlac-mark">&#10042;</div><h3>Team Retreats</h3><p>Offsites that move people out of the building and into a different register entirely.</p></div>
    <div class="tlac-card"><div class="tlac-mark">&#10042;</div><h3>Group Logistics</h3><p>Flights, ground transport, and timing held together for groups of any size.</p></div>
    <div class="tlac-card"><div class="tlac-mark">&#10042;</div><h3>VIP Transfers</h3><p>The detail most planners skip — arrival to departure, handled.</p></div>
  </div></section>

  <section class="tlac-feature tlac-reveal">
    <div class="tlac-feature-cell tlac-img" role="img" aria-label="Modern executive lounge at dusk"></div>
    <div class="tlac-feature-cell">
      <h2>One point of contact. Every detail covered.</h2>
      <p>I run logistics the way I would want them run for me — a single line of communication, no handoffs, no surprises on arrival.</p>
      <a href="/contact" class="tlac-btn">Request A Proposal</a>
    </div>
  </section>

  <section class="tlac-close">
    <h2>Tell Andy where your team needs to be.</h2>
    <a href="/contact" class="tlac-btn">Speak With Andy</a>
  </section>
</div></div>
<script>
(function(){
  var els = document.querySelectorAll('.tlac-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('tlac-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('tlac-in'); io.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
```

---

## 4. BESPOKE — `/bespoke` (black, password: `LuxeAccess`)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.tla-bespoke-wrap { width:100vw; position:relative; left:calc(-50vw + 50%); overflow:hidden; }
.tla-bespoke { --gold:#c8af78; --gold-bright:#dfc898; --bg:#0a0a0a; --surface:#0d0d0a; --surface-2:#121210; --text:#f0ebe0; --muted:#7a7060; background:var(--bg); color:var(--text); font-family:'Montserrat',sans-serif; font-weight:300; width:100%; }
.tla-bespoke * { box-sizing:border-box; }
.tla-bespoke h1,.tla-bespoke h2,.tla-bespoke h3 { font-family:'Cormorant Garamond',serif; font-weight:300; color:var(--text); margin:0; }
.tla-bespoke em { font-style:italic; color:var(--gold); font-weight:300; }
.tla-bespoke .tlab-hero { min-height:75vh; display:flex; align-items:center; justify-content:center; padding:6rem 1.5rem; text-align:center; background:radial-gradient(ellipse at 50% 100%, rgba(200,175,120,0.08), transparent 60%), linear-gradient(180deg,#0a0a0a 0%,#050505 100%); }
.tla-bespoke .tlab-hero-inner { max-width:820px; }
.tla-bespoke .tlab-hero h1 { font-size:clamp(1.8rem,5vw,3.4rem); line-height:1.25; margin-bottom:1rem; }
.tla-bespoke .tlab-hero h1 + h1 { margin-top:0; }
.tla-bespoke .tlab-kicker { color:var(--muted); font-size:0.78rem; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 1.6rem; }
.tla-bespoke .tlab-manifesto { max-width:680px; margin:2rem auto 0; color:var(--muted); font-size:0.95rem; line-height:1.9; }
.tla-bespoke .tlab-tier { width:100%; display:table; table-layout:fixed; border-top:0.5px solid rgba(200,175,120,0.15); }
.tla-bespoke .tlab-tier.tlab-featured { background:linear-gradient(180deg, rgba(200,175,120,0.06), transparent); }
.tla-bespoke .tlab-tier-cell { display:table-cell; vertical-align:top; width:50%; padding:4.5rem 4vw; }
.tla-bespoke .tlab-tier-num { font-family:'Cormorant Garamond',serif; font-style:italic; color:var(--gold); font-size:1rem; letter-spacing:0.1em; margin-bottom:0.6rem; display:block; }
.tla-bespoke .tlab-tier-cell h2 { font-size:clamp(1.6rem,3.4vw,2.2rem); margin-bottom:0.4rem; }
.tla-bespoke .tlab-tier-access { color:var(--muted); font-size:0.74rem; letter-spacing:0.18em; text-transform:uppercase; margin:0 0 1.6rem; }
.tla-bespoke .tlab-tier ul { list-style:none; margin:0 0 2rem; padding:0; color:var(--text); font-size:0.92rem; line-height:1.6; }
.tla-bespoke .tlab-tier ul li { padding:0.5rem 0; border-bottom:0.5px solid rgba(200,175,120,0.1); }
.tla-bespoke .tlab-tier ul li:before { content:'\2014\0020'; color:var(--gold); }
.tla-bespoke .tlab-btn { display:inline-block; padding:1em 2.4em; border:1px solid var(--gold); color:var(--gold); text-decoration:none; font-size:0.72rem; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.4s ease; }
.tla-bespoke .tlab-btn:hover { background:var(--gold); color:var(--bg); }
.tla-bespoke .tlab-form { display:grid; gap:0.9rem; max-width:380px; }
.tla-bespoke .tlab-form input, .tla-bespoke .tlab-form textarea { background:transparent; border:none; border-bottom:1px solid rgba(200,175,120,0.35); color:var(--text); font-family:'Montserrat',sans-serif; font-size:0.9rem; padding:0.6rem 0.2rem; }
.tla-bespoke .tlab-form input::placeholder, .tla-bespoke .tlab-form textarea::placeholder { color:var(--muted); }
.tla-bespoke .tlab-form input:focus, .tla-bespoke .tlab-form textarea:focus { outline:none; border-color:var(--gold); }
.tla-bespoke .tlab-form button { justify-self:start; margin-top:0.4rem; background:transparent; cursor:pointer; }
.tla-bespoke .tlab-circle-note { font-style:italic; color:var(--gold); font-family:'Cormorant Garamond',serif; font-size:1.05rem; }
.tla-bespoke .tlab-close { text-align:center; padding:6rem 1.5rem; border-top:0.5px solid rgba(200,175,120,0.15); }
.tla-bespoke .tlab-close h2 { font-size:clamp(1.8rem,4vw,2.6rem); font-style:italic; }
.tla-bespoke .tlab-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.9s ease, transform 0.9s ease; }
.tla-bespoke .tlab-reveal.tlab-in { opacity:1; transform:translateY(0); }
@media (prefers-reduced-motion: reduce) { .tla-bespoke .tlab-reveal { opacity:1; transform:none; } }
@media (max-width:767px) {
  .tla-bespoke .tlab-tier, .tla-bespoke .tlab-tier-cell { display:block; width:100%; }
  .tla-bespoke .tlab-tier-cell { padding:3.2rem 1.4rem; }
}
</style>
<div class="tla-bespoke-wrap"><div class="tla-bespoke">
  <section class="tlab-hero"><div class="tlab-hero-inner">
    <p class="tlab-kicker">Luxury Bespoke Travel</p>
    <h1>This is not a travel service.<br><em>This is an inner circle.</em></h1>
    <p class="tlab-manifesto">I do not build packages. I build access — to people, places, and rooms that are not advertised. What you find here depends on how close you are to me, and what you are ready for.</p>
  </div></section>

  <section class="tlab-tier tlab-reveal">
    <div class="tlab-tier-cell">
      <span class="tlab-tier-num">I</span>
      <h2>The Wanderer</h2>
      <p class="tlab-tier-access">Open Access</p>
      <ul>
        <li>Group travel sessions with Andy</li>
        <li>The Travel Like Andy newsletter</li>
        <li>Fora hotel and resort upgrades</li>
        <li>Flight planning support</li>
        <li>Curated group tours</li>
      </ul>
      <a href="/contact" class="tlab-btn">Begin</a>
    </div>
    <div class="tlab-tier-cell"></div>
  </section>

  <section class="tlab-tier tlab-featured tlab-reveal">
    <div class="tlab-tier-cell"></div>
    <div class="tlab-tier-cell">
      <span class="tlab-tier-num">II</span>
      <h2>The Curator</h2>
      <p class="tlab-tier-access">By Referral</p>
      <ul>
        <li>Custom-built itineraries</li>
        <li>Private dining arrangements</li>
        <li>Jet and charter coordination</li>
        <li>Hidden suites, not listed rooms</li>
        <li>Direct access to Andy's contacts</li>
      </ul>
      <form class="tlab-form" onsubmit="event.preventDefault(); var n=this.curname.value,e=this.curemail.value,r=this.curref.value,d=this.curdream.value; window.location.href='mailto:andreweisenmann@gmail.com?subject=' + encodeURIComponent('The Curator — Referral') + '&body=' + encodeURIComponent('Name: '+n+'\nEmail: '+e+'\nReferred by: '+r+'\nWhere I dream of going: '+d);">
        <input type="text" name="curname" placeholder="Name" required>
        <input type="email" name="curemail" placeholder="Email" required>
        <input type="text" name="curref" placeholder="Who referred you">
        <input type="text" name="curdream" placeholder="Where you dream of going">
        <button type="submit" class="tlab-btn">Request Access</button>
      </form>
    </div>
  </section>

  <section class="tlab-tier tlab-reveal">
    <div class="tlab-tier-cell">
      <span class="tlab-tier-num">III</span>
      <h2>The Circle</h2>
      <p class="tlab-tier-access">Invitation Only &middot; 10 Per Season</p>
      <ul>
        <li>Andy travels with you, personally</li>
        <li>Private villas and estates</li>
        <li>Yacht and jet charters</li>
        <li>Opera &amp; Arts access</li>
        <li>24/7 WhatsApp line to Andy</li>
      </ul>
      <p class="tlab-circle-note">Andy reaches out.</p>
    </div>
    <div class="tlab-tier-cell"></div>
  </section>

  <section class="tlab-close">
    <h2>You will know if this is for you.</h2>
  </section>
</div></div>
<script>
(function(){
  var els = document.querySelectorAll('.tlab-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('tlab-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('tlab-in'); io.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
```

---

## 5. ABOUT — `/about` (black, awe→trust→warmth arc)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.tla-about-wrap { width:100vw; position:relative; left:calc(-50vw + 50%); overflow:hidden; }
.tla-about { --gold:#c8af78; --gold-bright:#dfc898; --bg:#0a0a0a; --surface:#0d0d0a; --surface-2:#121210; --text:#f0ebe0; --muted:#7a7060; background:var(--bg); color:var(--text); font-family:'Montserrat',sans-serif; font-weight:300; width:100%; }
.tla-about * { box-sizing:border-box; }
.tla-about h1,.tla-about h2,.tla-about h3 { font-family:'Cormorant Garamond',serif; font-weight:300; color:var(--text); margin:0; }
.tla-about em { font-style:italic; color:var(--gold); font-weight:300; }
.tla-about .tlaa-hero { min-height:70vh; display:flex; align-items:center; justify-content:center; padding:6rem 1.5rem; text-align:center; position:relative; background:linear-gradient(180deg, rgba(10,10,10,0.55), rgba(10,10,10,0.85)), url('https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat; }
.tla-about .tlaa-hero-inner { max-width:880px; }
.tla-about .tlaa-hero h1 { font-size:clamp(2rem,5.5vw,4rem); line-height:1.15; }
.tla-about .tlaa-tag { color:var(--gold); font-size:0.78rem; letter-spacing:0.25em; text-transform:uppercase; margin-top:1.4rem; }
.tla-about .tlaa-intro { max-width:760px; margin:0 auto; padding:6rem 1.5rem; text-align:center; }
.tla-about .tlaa-intro p { color:var(--text); font-size:clamp(1.1rem,2.2vw,1.4rem); line-height:1.9; font-family:'Cormorant Garamond',serif; font-style:italic; }
.tla-about .tlaa-stats { max-width:1000px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; padding:0 1.5rem 6rem; }
.tla-about .tlaa-stat { text-align:center; border:1px solid rgba(200,175,120,0.18); background:var(--surface); padding:2.4rem 1rem; }
.tla-about .tlaa-stat .tlaa-num { font-family:'Cormorant Garamond',serif; font-style:italic; color:var(--gold); font-size:2.4rem; display:block; margin-bottom:0.4rem; }
.tla-about .tlaa-stat p { color:var(--muted); font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; margin:0; }
.tla-about .tlaa-story { width:100%; display:table; table-layout:fixed; background:var(--surface-2); border-top:0.5px solid rgba(200,175,120,0.15); border-bottom:0.5px solid rgba(200,175,120,0.15); }
.tla-about .tlaa-story-cell { display:table-cell; vertical-align:middle; width:50%; padding:5rem 4vw; }
.tla-about .tlaa-story-cell.tlaa-img { background:url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat; min-height:460px; }
.tla-about .tlaa-story h2 { font-size:clamp(1.6rem,3.6vw,2.4rem); font-style:italic; margin-bottom:1.4rem; }
.tla-about .tlaa-story p { color:var(--muted); font-size:0.95rem; line-height:1.85; margin:0 0 1.2rem; }
.tla-about .tlaa-quotes { max-width:820px; margin:0 auto; padding:6rem 1.5rem; text-align:center; }
.tla-about .tlaa-quotes h3 { font-size:0.78rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--muted); margin-bottom:2.5rem; }
.tla-about .tlaa-quote { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:clamp(1.2rem,2.4vw,1.6rem); line-height:1.7; color:var(--text); margin:0 0 2.2rem; }
.tla-about .tlaa-quote span { display:block; margin-top:0.8rem; color:var(--gold); font-size:0.7rem; letter-spacing:0.18em; text-transform:uppercase; font-style:normal; font-family:'Montserrat',sans-serif; }
.tla-about .tlaa-close { text-align:center; padding:6rem 1.5rem; }
.tla-about .tlaa-close h2 { font-size:clamp(1.8rem,4vw,2.6rem); font-style:italic; margin-bottom:2rem; }
.tla-about .tlaa-btn { display:inline-block; padding:1.1em 2.6em; border:1px solid var(--gold); color:var(--gold); text-decoration:none; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.4s ease; }
.tla-about .tlaa-btn:hover { background:var(--gold); color:var(--bg); }
.tla-about .tlaa-sig { margin-top:2.5rem; color:var(--muted); font-size:0.75rem; letter-spacing:0.1em; }
.tla-about .tlaa-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.9s ease, transform 0.9s ease; }
.tla-about .tlaa-reveal.tlaa-in { opacity:1; transform:translateY(0); }
@media (prefers-reduced-motion: reduce) { .tla-about .tlaa-reveal { opacity:1; transform:none; } }
@media (max-width:767px) {
  .tla-about .tlaa-stats { grid-template-columns:1fr; padding:0 1.2rem 4rem; }
  .tla-about .tlaa-story, .tla-about .tlaa-story-cell { display:block; width:100%; }
  .tla-about .tlaa-story-cell.tlaa-img { min-height:260px; }
  .tla-about .tlaa-story-cell { padding:3rem 1.4rem; }
  .tla-about .tlaa-intro, .tla-about .tlaa-quotes, .tla-about .tlaa-close { padding:4rem 1.2rem; }
}
</style>
<div class="tla-about-wrap"><div class="tla-about">
  <section class="tlaa-hero"><div class="tlaa-hero-inner">
    <h1>Some people see the world.<br><em>Andy lives in it.</em></h1>
    <p class="tlaa-tag">#travellikeandy</p>
  </div></section>

  <section class="tlaa-intro tlaa-reveal">
    <p>I have never planned a trip I did not want to take myself. Everything I send people on, I have lived first.</p>
  </section>

  <section class="tlaa-stats tlaa-reveal">
    <div class="tlaa-stat"><span class="tlaa-num">2&times;</span><p>Circled The Globe</p></div>
    <div class="tlaa-stat"><span class="tlaa-num">50+</span><p>Countries</p></div>
    <div class="tlaa-stat"><span class="tlaa-num">&infin;</span><p>Network</p></div>
  </section>

  <section class="tlaa-story tlaa-reveal">
    <div class="tlaa-story-cell tlaa-img" role="img" aria-label="Portrait placeholder for Andy Eisenmann"></div>
    <div class="tlaa-story-cell">
      <h2>From the stage to the world.</h2>
      <p>I started as a professional musician with the Perth Symphony, the kind of work that teaches you to listen before you act. That training followed me everywhere — into an opera performance for the King of Thailand, onto trails through the Himalayas, into kitchens and rooms most travelers never see.</p>
      <p>Today I am a Certified Fora Travel Partner. I circled the globe twice in 2024 alone. Every itinerary I build still carries that same instinct: listen first, then design the experience that fits.</p>
    </div>
  </section>

  <section class="tlaa-quotes tlaa-reveal">
    <h3>In His Own Words</h3>
    <p class="tlaa-quote">"I know the chef in Mexico City who opens his kitchen after midnight." <span>Andy Eisenmann</span></p>
    <p class="tlaa-quote">"I know the room at the Taj Palace in Delhi that faces the sunrise." <span>Andy Eisenmann</span></p>
  </section>

  <section class="tlaa-close tlaa-reveal">
    <h2>Where do you dream of going?</h2>
    <a href="/contact" class="tlaa-btn">Tell Andy</a>
    <p class="tlaa-sig">&mdash; Andy Eisenmann &middot; Fora Travel Partner &middot; #travellikeandy</p>
  </section>
</div></div>
<script>
(function(){
  var els = document.querySelectorAll('.tlaa-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('tlaa-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('tlaa-in'); io.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
```

---

## 6. CONTACT — `/contact` (black, single column)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
.tla-contact-wrap { width:100vw; position:relative; left:calc(-50vw + 50%); overflow:hidden; }
.tla-contact { --gold:#c8af78; --gold-bright:#dfc898; --bg:#0a0a0a; --surface:#0d0d0a; --text:#f0ebe0; --muted:#7a7060; background:var(--bg); color:var(--text); font-family:'Montserrat',sans-serif; font-weight:300; width:100%; }
.tla-contact * { box-sizing:border-box; }
.tla-contact h1,.tla-contact h2 { font-family:'Cormorant Garamond',serif; font-weight:300; color:var(--text); margin:0; }
.tla-contact em { font-style:italic; color:var(--gold); font-weight:300; }
.tla-contact .tlact-hero { padding:6rem 1.5rem 3rem; text-align:center; }
.tla-contact .tlact-hero h1 { font-size:clamp(1.9rem,5vw,3.2rem); line-height:1.2; max-width:760px; margin:0 auto; }
.tla-contact .tlact-wrap-inner { max-width:560px; margin:0 auto; padding:0 1.5rem 5rem; }
.tla-contact .tlact-form { display:grid; gap:1.1rem; }
.tla-contact .tlact-form label { font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-bottom:0.4rem; display:block; }
.tla-contact .tlact-form input, .tla-contact .tlact-form textarea { width:100%; background:transparent; border:none; border-bottom:1px solid rgba(200,175,120,0.35); color:var(--text); font-family:'Montserrat',sans-serif; font-size:0.95rem; padding:0.7rem 0.2rem; resize:vertical; }
.tla-contact .tlact-form input::placeholder, .tla-contact .tlact-form textarea::placeholder { color:var(--muted); }
.tla-contact .tlact-form input:focus, .tla-contact .tlact-form textarea:focus { outline:none; border-color:var(--gold); }
.tla-contact .tlact-btn { display:inline-block; padding:1.1em 2.6em; border:1px solid var(--gold); color:var(--gold); background:transparent; cursor:pointer; text-decoration:none; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.4s ease; justify-self:start; margin-top:0.6rem; font-family:'Montserrat',sans-serif; }
.tla-contact .tlact-btn:hover { background:var(--gold); color:var(--bg); }
.tla-contact .tlact-or { text-align:center; padding:0 1.5rem 1.5rem; color:var(--muted); font-size:0.75rem; letter-spacing:0.18em; text-transform:uppercase; border-top:0.5px solid rgba(200,175,120,0.15); padding-top:3rem; max-width:560px; margin:0 auto; }
.tla-contact .tlact-cards { max-width:560px; margin:0 auto; display:grid; gap:1rem; padding:1.5rem; }
.tla-contact .tlact-card { display:flex; align-items:center; justify-content:space-between; gap:1rem; background:var(--surface); border:1px solid rgba(200,175,120,0.18); padding:1.3rem 1.5rem; text-decoration:none; color:var(--text); transition:all 0.3s ease; }
.tla-contact .tlact-card:hover { border-color:var(--gold); transform:translateX(4px); }
.tla-contact .tlact-card .tlact-label { font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:0.2rem; }
.tla-contact .tlact-card .tlact-value { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.1rem; color:var(--gold); }
.tla-contact .tlact-sig { text-align:center; padding:3rem 1.5rem 6rem; font-family:'Cormorant Garamond',serif; font-style:italic; color:var(--muted); font-size:0.95rem; }
.tla-contact .tlact-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.9s ease, transform 0.9s ease; }
.tla-contact .tlact-reveal.tlact-in { opacity:1; transform:translateY(0); }
@media (prefers-reduced-motion: reduce) { .tla-contact .tlact-reveal { opacity:1; transform:none; } }
</style>
<div class="tla-contact-wrap"><div class="tla-contact">
  <section class="tlact-hero">
    <h1>Tell Andy where you dream of going.</h1>
  </section>

  <section class="tlact-wrap-inner tlact-reveal">
    <form class="tlact-form" onsubmit="event.preventDefault(); var n=this.cname.value,e=this.cemail.value,dr=this.cdream.value,rf=this.cref.value,m=this.cmsg.value; var body='Name: '+n+'\nEmail: '+e+'\nWhere I dream of going: '+dr+'\nReferred by: '+rf+'\n\n'+m; window.location.href='mailto:andreweisenmann@gmail.com?subject='+encodeURIComponent('Tell Andy — '+n)+'&body='+encodeURIComponent(body);">
      <div><label for="cname">Name</label><input id="cname" name="cname" type="text" placeholder="Your name" required></div>
      <div><label for="cemail">Email</label><input id="cemail" name="cemail" type="email" placeholder="your@email.com" required></div>
      <div><label for="cdream">Where you dream of going</label><input id="cdream" name="cdream" type="text" placeholder="A place, a feeling, a country" required></div>
      <div><label for="cref">Referred by (optional)</label><input id="cref" name="cref" type="text" placeholder="Who sent you here"></div>
      <div><label for="cmsg">Message</label><textarea id="cmsg" name="cmsg" rows="4" placeholder="Tell Andy more"></textarea></div>
      <button type="submit" class="tlact-btn">Tell Andy</button>
    </form>
  </section>

  <p class="tlact-or">Or reach Andy directly</p>
  <section class="tlact-cards tlact-reveal">
    <a class="tlact-card" href="https://wa.me/525579495570" target="_blank" rel="noopener"><span><span class="tlact-label">WhatsApp</span><span class="tlact-value">+52 55 7949 5570</span></span><span>&rarr;</span></a>
    <a class="tlact-card" href="tel:+14422348624"><span><span class="tlact-label">Phone</span><span class="tlact-value">+1 (442) 234-8624</span></span><span>&rarr;</span></a>
    <a class="tlact-card" href="https://instagram.com/travellikeandy" target="_blank" rel="noopener"><span><span class="tlact-label">Instagram</span><span class="tlact-value">@travellikeandy</span></span><span>&rarr;</span></a>
  </section>

  <p class="tlact-sig">"Where do you dream of going?" &mdash; Andy Eisenmann</p>
</div></div>
<script>
(function(){
  var els = document.querySelectorAll('.tlact-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('tlact-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('tlact-in'); io.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
```

---

## 7. GLOBAL CUSTOM CSS — Design → Custom CSS (site-wide)

```css
/* DARK HEADER */
.header, .header-announcement-bar-wrapper { background:#0a0a0a !important; }
.header-nav-item a { color:#f0ebe0 !important; font-family:'Montserrat',sans-serif !important; letter-spacing:0.12em; text-transform:uppercase; font-size:0.78rem; }
.header-nav-item a:hover, .header-nav-item--active a { color:#c8af78 !important; }
.header-title-logo img { max-height:58px !important; width:auto !important; }

/* MOBILE BURGER */
.header-menu, .header-menu-bg { background:#0a0a0a !important; }
.header-menu-nav-item a { color:#f0ebe0 !important; font-family:'Cormorant Garamond',serif !important; text-transform:uppercase; }
.header-menu-nav-item a:hover { color:#c8af78 !important; }
.burger-inner .top, .burger-inner .middle, .burger-inner .bottom { background:#c8af78 !important; }

/* DARK FOOTER */
.footer-sections, #footerSections, .sqs-footer, footer { background:#0a0a0a !important; }
.footer-sections p, footer p { color:#7a7060 !important; font-family:'Montserrat',sans-serif !important; font-size:0.78rem !important; letter-spacing:0.1em; text-align:center; }
.footer-sections a, footer a { color:#c8af78 !important; }

/* BESPOKE LOCK SCREEN */
.sqs-password-page, .password-protected, .password-page { background:#0a0a0a !important; }
.password-page h1 { font-family:'Cormorant Garamond',serif !important; font-style:italic !important; color:#f0ebe0 !important; font-weight:300 !important; }
.password-page input[type="password"] { background:transparent !important; border:none !important; border-bottom:1px solid rgba(200,175,120,0.4) !important; color:#f0ebe0 !important; }
.password-page input[type="submit"], .password-page .sqs-system-button { background:#c8af78 !important; color:#0a0a0a !important; border:none !important; border-radius:0 !important; text-transform:uppercase !important; letter-spacing:0.2em !important; }
```

---

## Reminders

- Scroll the full page after pasting to check for leftover/duplicate Beacon sections.
- No prices, no banned words (buy/price/book now/package/etc.) anywhere.
- Beacon AI cannot read inside Code Blocks — don't rely on it to verify this content.
