// Tailored app.js with TTS + your expanded decks embedded
// Drop-in replacement: upload this to your repo root to replace app.js.

// ---- TTS helper ----
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
      load();
    });
  },
  speakSpanish(text) {
    if (!text || typeof speechSynthesis === "undefined") return;
    const u = new SpeechSynthesisUtterance(text);
    const all = TTS.voices || [];
    const pref = all.find(v => /^es-(MX|US|419)/i.test(v.lang))
              || all.find(v => /^es(-|$)/i.test(v.lang))
              || null;
    if (pref) u.voice = pref;
    u.lang = (pref && pref.lang) || "es-MX";
    u.rate = 0.95; u.pitch = 1.0;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
};

// ---- Embedded decks ----
const DECKS = {"Top 1000 — 001-100": [{"es": "de", "en": "of, from"}, {"es": "la", "en": "the (fem. sing.)"}, {"es": "que", "en": "that, which"}, {"es": "el", "en": "the (masc. sing.)"}, {"es": "en", "en": "in, on"}, {"es": "y", "en": "and"}, {"es": "a", "en": "to, at"}, {"es": "los", "en": "the (masc. pl.)"}, {"es": "se", "en": "oneself, itself (reflexive pronoun); 'se' marker"}, {"es": "del", "en": "of the (de + el)"}, {"es": "las", "en": "the (fem. pl.)"}, {"es": "un", "en": "a, an (masc.)"}, {"es": "por", "en": "by, through, for"}, {"es": "con", "en": "with"}, {"es": "no", "en": "no, not"}, {"es": "una", "en": "a, an (fem.)"}, {"es": "su", "en": "his, her, your, their"}, {"es": "para", "en": "for, in order to"}, {"es": "es", "en": "is (ser)"}, {"es": "al", "en": "to the (a + el)"}, {"es": "lo", "en": "it, him (DO pronoun); the (neuter)"}, {"es": "como", "en": "like, as"}, {"es": "más", "en": "more"}, {"es": "pero", "en": "but"}, {"es": "sus", "en": "his/her/your/their (pl.)"}, {"es": "le", "en": "to him/her (IO pronoun)"}, {"es": "ya", "en": "already, now"}, {"es": "o", "en": "or"}, {"es": "fue", "en": "was/went (ser/ir)"}, {"es": "ha", "en": "has (aux.)"}, {"es": "sí", "en": "yes"}, {"es": "porque", "en": "because"}, {"es": "esta", "en": "this (fem.)"}, {"es": "son", "en": "are (ser)"}, {"es": "entre", "en": "between, among"}, {"es": "cuando", "en": "when"}, {"es": "muy", "en": "very"}, {"es": "sin", "en": "without"}, {"es": "sobre", "en": "on, about"}, {"es": "también", "en": "also"}, {"es": "me", "en": "me"}, {"es": "hasta", "en": "until, up to"}, {"es": "hay", "en": "there is/are"}, {"es": "donde", "en": "where"}, {"es": "quien", "en": "who"}, {"es": "desde", "en": "since, from"}, {"es": "todo", "en": "everything, all"}, {"es": "nos", "en": "us"}, {"es": "durante", "en": "during"}, {"es": "todos", "en": "everyone, all (masc. pl.)"}, {"es": "uno", "en": "one"}, {"es": "les", "en": "to them/you (IO)"}, {"es": "ni", "en": "neither, nor"}, {"es": "contra", "en": "against"}, {"es": "otros", "en": "others (masc.)"}, {"es": "ese", "en": "that (masc.)"}, {"es": "eso", "en": "that (neuter)"}, {"es": "ante", "en": "before, in the face of"}, {"es": "ellos", "en": "they (masc.)"}, {"es": "e", "en": "and (before i-)"}, {"es": "esto", "en": "this (neuter)"}, {"es": "mí", "en": "me (after prep)"}, {"es": "antes", "en": "before"}, {"es": "algunos", "en": "some (masc.)"}, {"es": "qué", "en": "what"}, {"es": "unos", "en": "some (masc. pl.)"}, {"es": "yo", "en": "I"}, {"es": "otro", "en": "other, another (masc.)"}, {"es": "otras", "en": "others (fem. pl.)"}, {"es": "otra", "en": "other, another (fem.)"}, {"es": "él", "en": "he"}, {"es": "tanto", "en": "so much, so many"}, {"es": "esa", "en": "that (fem.)"}, {"es": "estos", "en": "these (masc. pl.)"}, {"es": "mucho", "en": "much, a lot"}, {"es": "quienes", "en": "who (pl.)"}, {"es": "nada", "en": "nothing"}, {"es": "muchos", "en": "many (masc. pl.)"}, {"es": "cual", "en": "which"}, {"es": "poco", "en": "little, few"}, {"es": "ella", "en": "she"}, {"es": "estar", "en": "to be (temp.)"}, {"es": "estas", "en": "these (fem. pl.)"}, {"es": "algunas", "en": "some (fem. pl.)"}, {"es": "algo", "en": "something"}, {"es": "nosotros", "en": "we (masc./mixed)"}, {"es": "mi", "en": "my"}, {"es": "mis", "en": "my (pl.)"}, {"es": "tú", "en": "you (sing. informal)"}, {"es": "te", "en": "you (DO/IO/reflexive)"}, {"es": "ti", "en": "you (after prep)"}, {"es": "tu", "en": "your (sing. informal)"}, {"es": "tus", "en": "your (pl.)"}, {"es": "ellas", "en": "they (fem.)"}, {"es": "mismo", "en": "same"}, {"es": "cuáles", "en": "which (pl.)"}, {"es": "cuál", "en": "which (sing.)"}, {"es": "por qué", "en": "why"}, {"es": "cuándo", "en": "when"}, {"es": "cómo", "en": "how"}, {"es": "dónde", "en": "where"}, {"es": "cuánto", "en": "how much"}, {"es": "cuántos", "en": "how many (masc.)"}, {"es": "cuántas", "en": "how many (fem.)"}, {"es": "porque (por que)", "en": "because / 'for which'"}], "Top 1000 — 101-200": [], "Top 1000 — 201-300": [], "Top 1000 — 301-400": [], "Top 1000 — 401-500": [], "Top 1000 — 501-600": [], "Top 1000 — 601-700": [], "Top 1000 — 701-800": [], "Top 1000 — 801-900": [], "Top 1000 — 901-1000": [], "Grammar — Question Words": [{"es": "qué", "en": "what"}, {"es": "cuál / cuáles", "en": "which"}, {"es": "quién / quiénes", "en": "who"}, {"es": "cuándo", "en": "when"}, {"es": "dónde", "en": "where"}, {"es": "cómo", "en": "how"}, {"es": "cuánto / cuánta", "en": "how much"}, {"es": "cuántos / cuántas", "en": "how many"}, {"es": "por qué", "en": "why"}, {"es": "para qué", "en": "for what purpose"}], "Grammar — Prepositions (Core)": [{"es": "a", "en": "to, at"}, {"es": "de", "en": "of, from"}, {"es": "en", "en": "in, on"}, {"es": "con", "en": "with"}, {"es": "sin", "en": "without"}, {"es": "por", "en": "by, through, because of"}, {"es": "para", "en": "for, in order to"}, {"es": "sobre", "en": "on, about, over"}, {"es": "entre", "en": "between, among"}, {"es": "hasta", "en": "until, up to"}, {"es": "desde", "en": "since, from"}, {"es": "contra", "en": "against"}, {"es": "según", "en": "according to"}, {"es": "hacia", "en": "toward"}, {"es": "tras", "en": "after, behind"}], "Grammar — Connectors": [{"es": "porque", "en": "because"}, {"es": "ya que", "en": "since, given that"}, {"es": "aunque", "en": "although, even though"}, {"es": "sin embargo", "en": "however"}, {"es": "por lo tanto", "en": "therefore"}, {"es": "así que", "en": "so, therefore"}, {"es": "además", "en": "in addition"}, {"es": "por ejemplo", "en": "for example"}, {"es": "mientras", "en": "while"}, {"es": "después", "en": "afterwards"}, {"es": "antes", "en": "before"}, {"es": "luego", "en": "then, later"}, {"es": "por eso", "en": "that’s why"}, {"es": "en cambio", "en": "on the other hand"}, {"es": "a pesar de", "en": "in spite of"}], "LDS — Core Gospel Terms": [{"es": "el Evangelio", "en": "the Gospel"}, {"es": "la fe", "en": "faith"}, {"es": "el arrepentimiento", "en": "repentance"}, {"es": "el bautismo", "en": "baptism"}, {"es": "el don del Espíritu Santo", "en": "the gift of the Holy Ghost"}, {"es": "la Santa Cena", "en": "the sacrament"}, {"es": "las Escrituras", "en": "the Scriptures"}, {"es": "La Biblia", "en": "the Bible"}, {"es": "El Libro de Mormón", "en": "the Book of Mormon"}, {"es": "Doctrina y Convenios", "en": "Doctrine and Covenants"}, {"es": "La Perla de Gran Precio", "en": "Pearl of Great Price"}, {"es": "el profeta", "en": "prophet"}, {"es": "los apóstoles", "en": "apostles"}, {"es": "el sacerdocio", "en": "priesthood"}, {"es": "el templo", "en": "temple"}, {"es": "la obra misional", "en": "missionary work"}, {"es": "la obra del templo y de historia familiar", "en": "temple and family history work"}, {"es": "la conferencia general", "en": "general conference"}, {"es": "la Primaria", "en": "Primary"}, {"es": "la Sociedad de Socorro", "en": "Relief Society"}, {"es": "la Clase de Hombres Jóvenes", "en": "Young Men"}, {"es": "la Clase de Mujeres Jóvenes", "en": "Young Women"}, {"es": "el obispo", "en": "bishop"}, {"es": "el cuórum de élderes", "en": "elders quorum"}, {"es": "el barrio", "en": "ward"}, {"es": "la estaca", "en": "stake"}, {"es": "la expiación de Jesucristo", "en": "the Atonement of Jesus Christ"}, {"es": "el convenio", "en": "covenant"}, {"es": "guardar los mandamientos", "en": "to keep the commandments"}, {"es": "orar", "en": "to pray"}, {"es": "ayunar", "en": "to fast"}, {"es": "el Espíritu Santo", "en": "the Holy Ghost"}, {"es": "el diezmo", "en": "tithing"}, {"es": "la palabra de sabiduría", "en": "the Word of Wisdom"}, {"es": "la ley de castidad", "en": "the law of chastity"}, {"es": "la bendición del sacerdocio", "en": "priesthood blessing"}, {"es": "el llamamiento", "en": "calling (church)"}, {"es": "la revelación", "en": "revelation"}, {"es": "la misión", "en": "mission (service)"}], "Core A2/B1 (Clinic)": [{"es": "la cita", "en": "appointment"}, {"es": "la receta", "en": "prescription"}, {"es": "la fiebre", "en": "fever"}, {"es": "la presión arterial", "en": "blood pressure"}, {"es": "la frecuencia cardíaca", "en": "heart rate"}, {"es": "la herida", "en": "wound"}, {"es": "la prueba de laboratorio", "en": "lab test"}, {"es": "el dolor agudo", "en": "sharp pain"}, {"es": "el dolor sordo", "en": "dull pain"}, {"es": "mareado", "en": "dizzy"}], "Medical — Basics": [{"es": "la osteomielitis", "en": "osteomyelitis"}, {"es": "la biopsia", "en": "biopsy"}, {"es": "el vendaje compresivo", "en": "compression bandage"}, {"es": "la úlcera del pie diabético", "en": "diabetic foot ulcer"}, {"es": "el examen físico", "en": "physical exam"}, {"es": "recetar", "en": "to prescribe"}, {"es": "diagnosticar", "en": "to diagnose"}, {"es": "tratar", "en": "to treat"}, {"es": "mejorar", "en": "to improve"}, {"es": "empeorar", "en": "to worsen"}]};

// ---- Verbs (sample set kept from your build) ----
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

// ---- State & utils ----
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
  try{ const raw = localStorage.getItem("spanish_trainer_progress"); if(!raw) return;
    const data = JSON.parse(raw); Object.assign(state, data); el('dailyGoal').value = data.goal || 30;
  }catch(e){}
}
function pickNext(){ if(state.queue.length===0) return null; return state.queue[Math.floor(Math.random()*state.queue.length)]; }
function normalize(s){ return (s||"").trim().toLowerCase(); }

// ---- Flashcards (with TTS) ----
function loadDeck(name){ state.deck = name; state.queue = DECKS[name] || []; nextCard(true); }
function ensureFlashTTSButton(){
  const content = document.getElementById("flashContent"); if (!content) return;
  let speakBtn = document.getElementById("speakBtn");
  if (!speakBtn){
    speakBtn = document.createElement("button");
    speakBtn.id = "speakBtn"; speakBtn.title = "Play pronunciation"; speakBtn.textContent = "🔈 Play"; speakBtn.style.marginLeft = "8px";
    const prompt = document.getElementById("cardPrompt"); prompt.after(speakBtn);
  }
  document.getElementById("speakBtn").onclick = () => { if (!state.current) return; TTS.speakSpanish(state.current.es); };
}
function nextCard(init=false){
  state.current = pickNext();
  const promptDiv = el('cardPrompt');
  if(!state.current){ promptDiv.innerText = "No cards in this deck."; return; }
  const prompt = state.mode==="es-en"? state.current.es : state.current.en;
  promptDiv.innerText = prompt;
  el('cardAnswer').value = ""; el('feedback').innerText = init? "" : "";
  ensureFlashTTSButton();
}
function checkAnswer(showOnly=false){
  if(!state.current) return;
  const ans = normalize(el('cardAnswer').value);
  const corr = state.mode==="es-en"? state.current.en : state.current.es;
  const correct = normalize(corr);
  if(showOnly){ el('feedback').innerText = `Answer: ${corr}`; return; }
  state.studiedToday++;
  el('feedback').innerText = (ans && correct.split(/[;,/]/).map(x=>normalize(x)).includes(ans))
    ? `✅ Correct: ${corr}` : `❌ Correct answer: ${corr}`;
  save();
}
function setupFlash(){
  const ds = el('deckSelect'); ds.innerHTML = "";
  Object.keys(DECKS).forEach(name=>{ const opt = document.createElement('option'); opt.value=name; opt.textContent=name; ds.appendChild(opt); });
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

// ---- Verbs (with TTS) ----
function setupVerbEvents(container){
  container.querySelectorAll("[data-tts]").forEach(btn=>{ btn.addEventListener("click", ()=>{ const text = btn.getAttribute("data-tts") || ""; TTS.speakSpanish(text); }); });
}
function populateVerbs(){
  const sel = el('verbSelect'); sel.innerHTML="";
  VERBS.forEach(v=>{ const opt = document.createElement('option'); opt.value = v.inf; opt.textContent = `${v.inf} (${v.type})`; sel.appendChild(opt); });
  sel.onchange = renderVerbArea; el('tenseSelect').onchange = renderVerbArea; el('verbMode').onchange = renderVerbArea; renderVerbArea();
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
    a.appendChild(tbl); setupVerbEvents(a);
  }else if(mode==="write"){
    const persons = ["yo","tú","él/ella/usted","nosotros","vosotros","ellos/ustedes"];
    const keys = ["yo","tu","el","nos","vos","ellos"];
    keys.forEach((k,i)=>{
      const wrap = document.createElement('div'); wrap.style.marginBottom="8px";
      const target = (forms[k]||"");
      wrap.innerHTML = `<div><strong>${persons[i]}</strong> <button data-tts="${target}">🔈</button></div><input data-k="${k}" placeholder="Type form…">`;
      a.appendChild(wrap);
    });
    const btn = document.createElement('button'); btn.className="primary"; btn.textContent="Check";
    btn.onclick = ()=>{
      let correct=0,total=6;
      a.querySelectorAll("input").forEach(inp=>{
        const k = inp.getAttribute("data-k"); const want = (forms[k]||"").trim().toLowerCase();
        const got = (inp.value||"").trim().toLowerCase();
        if(got===want){ correct++; inp.style.borderColor = "var(--good)"; } else { inp.style.borderColor="var(--bad)"; inp.placeholder = `→ ${want}`; }
      });
      const p = document.createElement('div'); p.className="small"; p.textContent = `Score: ${correct}/{total}`.replace("{total}", total); a.appendChild(p);
    };
    a.appendChild(btn); setupVerbEvents(a);
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
      wrap.appendChild(btns); el('verbArea').appendChild(wrap);
    });
    setupVerbEvents(a);
  }
}

// ---- Tabs/Settings ----
function showTab(name){ ["flash","verbs","review","settings"].forEach(id=>{ el(id).style.display = (id===name) ? "" : "none"; });
  document.querySelectorAll(".tab").forEach(t=>{ t.classList.toggle("active", t.dataset.tab===name); }); }
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

// ---- Init ----
async function init(){
  await TTS.init();
  load(); setupTabs(); setupFlash(); setupReview();
  loadDeck(state.deck in DECKS ? state.deck : Object.keys(DECKS)[0]);
  populateVerbs(); updateStats();
}
init();
