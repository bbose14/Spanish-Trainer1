// Embedded expanded Spanish trainer with TTS (Text-to-Speech)
//
// Drop-in replacement for app.js. Adds a speaker button in Flashcards and
// TTS play buttons in Verb drills. Uses the browser's SpeechSynthesis API.
//
// No HTML changes required.

// ---------------- TTS helper ----------------
const TTS = {
  voices: [],
  init() {
    return new Promise((resolve) => {
      const load = () => {
        TTS.voices = window.speechSynthesis.getVoices();
        resolve();
      };
      if (typeof speechSynthesis === "undefined") { resolve(); return; }
      speechSynthesis.onvoiceschanged = load;
      // Call once in case voices are already loaded
      load();
    });
  },
  speakSpanish(text) {
    if (!text || typeof speechSynthesis === "undefined") return;
    const u = new SpeechSynthesisUtterance(text);
    // Prefer Mexican/Latin American Spanish if present, otherwise any Spanish
    const all = TTS.voices || [];
    const pref = all.find(v => /^es-(MX|US|419)/i.test(v.lang))
              || all.find(v => /^es(-|$)/i.test(v.lang))
              || null;
    if (pref) u.voice = pref;
    u.lang = (pref && pref.lang) || "es-MX";
    u.rate = 0.95;
    u.pitch = 1.0;
    // Cancel anything currently queued so taps feel snappy
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
};

// ---------------- Data ----------------
const DECKS = {"Top 1000 — 001-100": [{"es": "de", "en": "of, from"}, {"es": "la", "en": "the (fem. sing.)"}], "Grammar — Question Words": [{"es": "qué", "en": "what"}]};

const VERBS = [
  {"inf":"hablar","type":"-ar",
   "present":{"yo":"hablo","tu":"hablas","el":"habla","nos":"hablamos","vos":"habláis","ellos":"hablan"},
   "preterite":{"yo":"hablé","tu":"hablaste","el":"habló","nos":"hablamos","vos":"hablasteis","ellos":"hablaron"},
   "imperfect":{"yo":"hablaba","tu":"hablabas","el":"hablaba","nos":"hablábamos","vos":"hablabais","ellos":"hablaban"}
  },
  {"inf":"comer","type":"-er",
   "present":{"yo":"como","tu":"comes","el":"come","nos":"comemos","vos":"coméis","ellos":"comen"},
   "preterite":{"yo":"comí","tu":"comiste","el":"comió","nos":"comimos","vos":"comisteis","ellos":"comieron"},
   "imperfect":{"yo":"comía","tu":"comías","el":"comía","nos":"comíamos","vos":"comíais","ellos":"comían"}
  },
  {"inf":"vivir","type":"-ir",
   "present":{"yo":"vivo","tu":"vives","el":"vive","nos":"vivimos","vos":"vivís","ellos":"viven"},
   "preterite":{"yo":"viví","tu":"viviste","el":"vivió","nos":"vivimos","vos":"vivisteis","ellos":"vivieron"},
   "imperfect":{"yo":"vivía","tu":"vivías","el":"vivía","nos":"vivíamos","vos":"vivíais","ellos":"vivían"}
  },
  {"inf":"estar","type":"irregular",
   "present":{"yo":"estoy","tu":"estás","el":"está","nos":"estamos","vos":"estáis","ellos":"están"},
   "preterite":{"yo":"estuve","tu":"estuviste","el":"estuvo","nos":"estuvimos","vos":"estuvisteis","ellos":"estuvieron"},
   "imperfect":{"yo":"estaba","tu":"estabas","el":"estaba","nos":"estábamos","vos":"estabais","ellos":"estaban"}
  },
  {"inf":"tener","type":"irregular",
   "present":{"yo":"tengo","tu":"tienes","el":"tiene","nos":"tenemos","vos":"tenéis","ellos":"tienen"},
   "preterite":{"yo":"tuve","tu":"tuviste","el":"tuvo","nos":"tuvimos","vos":"tuvisteis","ellos":"tuvieron"},
   "imperfect":{"yo":"tenía","tu":"tenías","el":"tenía","nos":"teníamos","vos":"teníais","ellos":"tenían"}
  }
];

// ---------------- State & utils ----------------
const state = {
  deck: "Top 1000 — 001-100",
  mode: "es-en",
  queue: [],
  current: null,
  studiedToday: 0,
  mastered: 0,
  streak: 0
};

function el(id){return document.getElementById(id)}
function save(){
  const data = {studiedToday:state.studiedToday, mastered:state.mastered, streak:state.streak, deck:state.deck, mode:state.mode, goal:el('dailyGoal').value};
  localStorage.setItem("spanish_trainer_progress", JSON.stringify(data));
}
function load(){
  try{
    const raw = localStorage.getItem("spanish_trainer_progress");
    if(!raw) return;
    const data = JSON.parse(raw);
    Object.assign(state, data);
    el('dailyGoal').value = data.goal || 30;
  }catch(e){}
}
function pickNext(){ if(state.queue.length===0) return null; return state.queue[Math.floor(Math.random()*state.queue.length)]; }
function normalize(s){ return (s||"").trim().toLowerCase(); }

// ---------------- Flashcards ----------------
function loadDeck(name){
  state.deck = name;
  state.queue = DECKS[name] || [];
  nextCard(true);
}

function ensureFlashTTSButton(){
  const content = document.getElementById("flashContent");
  if (!content) return;
  let speakBtn = document.getElementById("speakBtn");
  if (!speakBtn){
    speakBtn = document.createElement("button");
    speakBtn.id = "speakBtn";
    speakBtn.title = "Play pronunciation";
    speakBtn.textContent = "🔈 Play";
    speakBtn.style.marginLeft = "8px";
    const prompt = document.getElementById("cardPrompt");
    prompt.after(speakBtn);
  }
  // Always speak the Spanish side for pronunciation
  document.getElementById("speakBtn").onclick = () => {
    if (!state.current) return;
    TTS.speakSpanish(state.current.es);
  };
}

function nextCard(init=false){
  state.current = pickNext();
  const promptDiv = el('cardPrompt');
  if(!state.current){ promptDiv.innerText = "No cards in this deck."; return; }
  const prompt = state.mode==="es-en"? state.current.es : state.current.en;
  promptDiv.innerText = prompt;
  el('cardAnswer').value = "";
  el('feedback').innerText = init? "" : "";
  ensureFlashTTSButton();
}

function checkAnswer(showOnly=false){
  if(!state.current) return;
  const ans = normalize(el('cardAnswer').value);
  // Always compare against the opposite side
  const corr = state.mode==="es-en"? state.current.en : state.current.es;
  const correct = normalize(corr);
  if(showOnly){
    el('feedback').innerText = `Answer: ${corr}`;
    return;
  }
  if(ans && correct.split(/[;,/]/).map(x=>normalize(x)).includes(ans)){
    state.studiedToday++;
    el('feedback').innerText = `✅ Correct: ${corr}`;
  }else{
    state.studiedToday++;
    el('feedback').innerText = `❌ Correct answer: ${corr}`;
  }
  save();
}

function setupFlash(){
  const ds = el('deckSelect');
  ds.innerHTML = "";
  Object.keys(DECKS).forEach(name=>{
    const opt = document.createElement('option'); opt.value=name; opt.textContent=name; ds.appendChild(opt);
  });
  ds.value = state.deck in DECKS ? state.deck : Object.keys(DECKS)[0];
  ds.onchange = e=> loadDeck(e.target.value);

  el('modeSelect').value = state.mode;
  el('modeSelect').onchange = e=> { state.mode=e.target.value; save(); nextCard(true); }
  el('dailyGoal').onchange = save;

  el('showBtn').onclick = ()=> checkAnswer(true);
  el('correctBtn').onclick = ()=> { el('feedback').innerText="Marked known ✅"; state.studiedToday++; save(); nextCard(); }
  el('wrongBtn').onclick = ()=> { el('feedback').innerText="Marked review ❗"; state.studiedToday++; save(); nextCard(); }
  el('nextBtn').onclick = ()=> nextCard();

  el('cardAnswer').addEventListener('keydown', (e)=>{ if(e.key==="Enter"){ checkAnswer(false); } });

  ensureFlashTTSButton();
}

// ---------------- Verbs (with TTS buttons) ----------------
function setupVerbEvents(container){
  container.querySelectorAll("[data-tts]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const text = btn.getAttribute("data-tts") || "";
      TTS.speakSpanish(text);
    });
  });
}

function populateVerbs(){
  const sel = el('verbSelect'); sel.innerHTML="";
  VERBS.forEach(v=>{ const opt = document.createElement('option'); opt.value = v.inf; opt.textContent = `${v.inf} (${v.type})`; sel.appendChild(opt); });
  sel.onchange = renderVerbArea;
  el('tenseSelect').onchange = renderVerbArea;
  el('verbMode').onchange = renderVerbArea;
  renderVerbArea();
}
function conj(v, tense){ return v[tense] || {}; }
function renderVerbArea(){
  const inf = el('verbSelect').value || VERBS[0].inf; el('verbSelect').value = inf;
  const tense = el('tenseSelect').value; const v = VERBS.find(x=>x.inf===inf); const forms = conj(v, tense);
  const mode = el('verbMode').value; const a = el('verbArea'); a.innerHTML="";
  if(mode==="table"){
    const tbl = document.createElement('div');
    tbl.innerHTML = `
      <div class="grid">
        <div><strong>yo</strong> <button data-tts="${forms.yo||""}">🔈</button><br>${forms.yo||""}</div>
        <div><strong>tú</strong> <button data-tts="${forms.tu||""}">🔈</button><br>${forms.tu||""}</div>
        <div><strong>él/ella/usted</strong> <button data-tts="${forms.el||""}">🔈</button><br>${forms.el||""}</div>
        <div><strong>nosotros</strong> <button data-tts="${forms.nos||""}">🔈</button><br>${forms.nos||""}</div>
        <div><strong>vosotros</strong> <button data-tts="${forms.vos||""}">🔈</button><br>${forms.vos||""}</div>
        <div><strong>ellos/ustedes</strong> <button data-tts="${forms.ellos||""}">🔈</button><br>${forms.ellos||""}</div>
      </div>`;
    a.appendChild(tbl);
    setupVerbEvents(a);
  }else if(mode==="write"){
    const persons = ["yo","tú","él/ella/usted","nosotros","vosotros","ellos/ustedes"];
    const keys = ["yo","tu","el","nos","vos","ellos"];
    keys.forEach((k,i)=>{
      const wrap = document.createElement('div'); wrap.style.marginBottom="8px";
      const target = (forms[k]||"");
      wrap.innerHTML = `<div><strong>${persons[i]}</strong> <button data-tts="${target}">🔈</button></div><input data-k="${k}" placeholder="Type form…">`;
      a.appendChild(wrap);
    });
    const btn = document.createElement('button');
    btn.className="primary"; btn.textContent="Check";
    btn.onclick = ()=>{
      let correct=0,total=6;
      a.querySelectorAll("input").forEach(inp=>{
        const k = inp.getAttribute("data-k"); const want = (forms[k]||"").trim().toLowerCase();
        const got = (inp.value||"").trim().toLowerCase();
        if(got===want){ correct++; inp.style.borderColor = "var(--good)"; } else { inp.style.borderColor="var(--bad)"; inp.placeholder = `→ ${want}`; }
      });
      const p = document.createElement('div'); p.className="small"; p.textContent = `Score: ${correct}/${total}`; a.appendChild(p);
    };
    a.appendChild(btn);
    setupVerbEvents(a);
  }else{ // quiz
    const persons = [["yo","yo"],["tu","tú"],["el","él/ella/usted"],["nos","nosotros"],["vos","vosotros"],["ellos","ellos/ustedes"]];
    persons.forEach(([k,label])=>{
      const wrap = document.createElement('div'); wrap.className="card";
      const right = forms[k]||"";
      const opts = new Set([right]);
      VERBS.forEach(vv=>{ const o = (vv[tense]||{})[k]; if(o) opts.add(o); });
      const arr = Array.from(opts).sort(()=>Math.random()-0.5).slice(0,4);
      while(arr.length<4) arr.push(right);
      arr.sort(()=>Math.random()-0.5);
      wrap.innerHTML = `<div><strong>${label}</strong> <button data-tts="${right}">🔈</button></div>`;
      const btns = document.createElement('div'); btns.className='controls';
      arr.forEach(choice=>{
        const b = document.createElement('button'); b.textContent = choice;
        b.onclick = ()=>{ if(choice===right){ b.style.background="var(--good)"; } else { b.style.background="var(--bad)"; } };
        btns.appendChild(b);
      });
      wrap.appendChild(btns);
      el('verbArea').appendChild(wrap);
    });
    setupVerbEvents(a);
  }
}

// ---------------- Tabs/Settings ----------------
function showTab(name){
  ["flash","verbs","review","settings"].forEach(id=>{ el(id).style.display = (id===name) ? "" : "none"; });
  document.querySelectorAll(".tab").forEach(t=>{ t.classList.toggle("active", t.dataset.tab===name); });
}
function setupTabs(){ document.querySelectorAll(".tab").forEach(btn=>{ btn.addEventListener("click", ()=> showTab(btn.dataset.tab)); }); }
function setupReview(){
  el('exportBtn').onclick = ()=>{
    const data = localStorage.getItem("spanish_trainer_progress")||"{}";
    const blob = new Blob([data], {type:"application/json"});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "spanish_trainer_progress.json"; a.click();
  };
  el('importBtn').onclick = ()=> el('importFile').click();
  el('importFile').onchange = (e)=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ localStorage.setItem("spanish_trainer_progress", reader.result); alert("Progress imported."); location.reload(); };
    reader.readAsText(file);
  };
  el('resetBtn').onclick = ()=>{ if(confirm("Reset all progress?")){ localStorage.removeItem("spanish_trainer_progress"); location.reload(); } };
}
function updateStats(){ el('studiedToday').innerText = state.studiedToday||0; el('mastered').innerText = state.mastered||0; el('streak').innerText = state.streak||0; }

// ---------------- Init ----------------
async function init(){
  await TTS.init();
  load();
  setupTabs();
  setupFlash();
  setupReview();
  loadDeck(state.deck in DECKS ? state.deck : Object.keys(DECKS)[0]);
  populateVerbs();
  updateStats();
}
init();
