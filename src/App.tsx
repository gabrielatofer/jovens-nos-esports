// @ts-nocheck
import { useState } from "react";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwnXsqUWb0XScHn1WKPfyCI2yH5CTKqsBFWbCVC4fDL5lMUGgDyhcfNIvB3DcArEsJa/exec";

const RANKS = [
  { name:"Bronze",       icon:"🥉", color:"#cd7f32", bg:"#2a1800", at:0  },
  { name:"Prata",        icon:"🥈", color:"#94a3b8", bg:"#1a2030", at:3  },
  { name:"Ouro",         icon:"🥇", color:"#fbbf24", bg:"#2a1f00", at:6  },
  { name:"Platina",      icon:"💎", color:"#67e8f9", bg:"#001f2a", at:9  },
  { name:"Diamante",     icon:"👑", color:"#c084fc", bg:"#1a0030", at:12 },
  { name:"Global Elite", icon:"⭐", color:"#34d399", bg:"#002a1a", at:15 },
];

// ORDER: Perfil → Jogos → Sonhos → Saúde → Escola → Treino
const QUESTIONS = [
  // ── PERFIL
  { id:1,  section:"Perfil",          icon:"🎮", type:"radio", required:true,
    text:"Qual é a sua idade?",
    opts:["12 anos","13 anos","14 anos","15 anos","16 anos","17 anos","18 anos"] },
  { id:2,  section:"Perfil",          icon:"🎮", type:"radio", required:true,
    text:"Como você se identifica?",
    opts:["Menino","Menina","Não-binário","Prefiro não responder"] },
  // ── SEUS JOGOS
  { id:3,  section:"Seus Jogos",      icon:"🕹️", type:"radio", required:true,
    text:"Qual jogo você mais treina e quer evoluir?",
    opts:["CS2","Valorant","League of Legends","Free Fire","Fortnite","Rainbow Six Siege","Rocket League","Apex Legends","DOTA 2"] },
  { id:4,  section:"Seus Jogos",      icon:"🕹️", type:"radio", required:true,
    text:"Há quanto tempo você joga de forma focada para evoluir?",
    opts:["Menos de 6 meses","6 meses a 1 ano","1 a 2 anos","2 a 3 anos","Mais de 3 anos"] },
  { id:5,  section:"Seus Jogos",      icon:"🕹️", type:"radio", required:true,
    text:"Já participou de algum torneio ou campeonato?",
    opts:["Sim, online","Sim, presencial","Os dois","Não, mas quero muito","Não tenho interesse"] },
  // ── SONHOS
  { id:6,  section:"Sonhos",          icon:"🏆", type:"radio", required:true,
    text:"Você quer seguir carreira nos esports como jogador profissional?",
    opts:["🔥 Sim — ser proplayer é meu sonho","🤔 Sim, mas ainda é incerto","❓ Ainda não sei","🎮 Não, é só hobby"] },
  { id:7,  section:"Sonhos",          icon:"🏆", type:"check", required:false,
    text:"Qual papel nos esports te interessa? (pode marcar mais de um)",
    opts:["🎮 Jogador profissional","📺 Streamer / criador de conteúdo","🧠 Coach / analista","🎙️ Comentarista / narrador","💼 Staff / gestor de equipe","📣 Marketing / comunicação"] },
  { id:8,  section:"Sonhos",          icon:"🏆", type:"check", required:true,
    text:"O que mais te impede de evoluir nos jogos hoje?",
    sub:"Pode marcar mais de um",
    opts:["⏰ Falta de tempo (escola, família)","👪 Família não apoia ou não entende","🖥️ Equipamento ruim ou desatualizado","📶 Internet ruim ou instável","🏢 Sem estrutura — sem coach, time ou clube","📖 Não sei por onde começar para evoluir","💸 Falta de dinheiro para investir","😰 Insegurança — medo de não ser bom o suficiente","🧠 Dificuldade de manter foco e consistência","✅ Não vejo grandes barreiras"] },
  { id:9,  section:"Sonhos",          icon:"🏆", type:"radio", required:true,
    text:"Como sua família vê sua dedicação aos esports?",
    sub:"Pensa no que acontece no dia a dia lá em casa",
    opts:["🥰 Apoia totalmente — me incentiva e se interessa","🙂 Aceita, mas não se envolve muito","😐 Não entende muito bem, mas não proíbe","😕 Prefere que eu foque em outras coisas","😤 É contra — me pressiona para parar"] },
  // ── SAÚDE
  { id:10, section:"Saúde",           icon:"💪", type:"radio", required:true,
    text:"Quantas horas você dorme por noite nos dias de semana?",
    opts:["Menos de 5h","5 a 6h","6 a 7h","7 a 8h","Mais de 8h"] },
  { id:11, section:"Saúde",           icon:"💪", type:"radio", required:true,
    text:"Você pratica alguma atividade física?",
    opts:["Sim, academia","Sim, esporte coletivo","Sim, outro exercício","Às vezes, sem regularidade","Não pratico"] },
  // ── ESCOLA
  { id:12, section:"Escola",          icon:"📚", type:"radio", required:true,
    text:"Em qual turno você estuda?",
    opts:["Manhã","Tarde","Noite","Integral","Não estudo atualmente"] },
  { id:13, section:"Escola",          icon:"📚", type:"radio", required:true,
    text:"Nas férias escolares, sua rotina nos jogos muda?",
    sub:"Pensando nas últimas férias que você teve",
    opts:["🔥 Sim — nas férias é quando realmente treino de verdade","📈 Sim, jogo bem mais, mas a rotina é parecida","😐 Não muda muito — tenho rotina independente da escola","😅 Nas férias jogo menos, fico ocupado com outras coisas","🤷 Depende das férias"] },
  { id:14, section:"Escola",          icon:"📚", type:"check", required:false,
    text:"Você já fez alguma dessas coisas para ter mais tempo de jogo?",
    opts:["📝 Fiz lições correndo para ficar livre logo","🚫 Faltei à escola para jogar","😴 Dormi menos para jogar mais","👥 Abri mão de sair com amigos/família","🏃 Parei uma atividade (esporte, hobby)","✅ Nunca precisei sacrificar nada"] },
  { id:15, section:"Escola",          icon:"📚", type:"radio", required:true,
    text:"Você acredita que concluir o ensino médio é um fator determinante para se dedicar de vez aos esports?",
    sub:"Ou seja, você sente que sua entrada de verdade nos esports vai acontecer depois da escola?",
    opts:[
      "🎯 Sim — pretendo me dedicar de verdade após terminar o ensino médio",
      "🏫 Não — pretendo equilibrar escola e esports ao mesmo tempo",
      "🤔 Talvez — ainda não sei como vai ser",
      "🎮 Nunca pensei nisso dessa forma, apenas jogo",
    ] },

  // ── ROTINA DE TREINO
  { id:16, section:"Rotina de Treino",icon:"⚡", type:"radio", required:true,
    text:"Quantas horas você joga por dia em dias de semana?",
    opts:["Menos de 1h","1 a 2h","2 a 3h","3 a 4h","4 a 5h","Mais de 5h","Quase não jogo em dia de semana"] },
  { id:17, section:"Rotina de Treino",icon:"⚡", type:"radio", required:true,
    text:"E no fim de semana?",
    opts:["Menos de 2h","2 a 4h","4 a 6h","6 a 8h","8 a 10h","Mais de 10h — o dia inteiro 💀"] },
  { id:18, section:"Rotina de Treino",icon:"⚡", type:"check", required:true,
    text:"Qual é a sua rotina de treino para evoluir no jogo?",
    sub:"Marca tudo que se encaixa no que você faz",
    opts:[
      "🎲 Jogo sem rotina definida — ainda não sei como montar uma",
      "🔍 Busco na internet (YouTube, Reddit, fóruns) e monto minha própria rotina",
      "👀 Me baseio na rotina de algum jogador profissional que acompanho",
      "📋 Tenho uma rotina própria que fui construindo com o tempo",
      "👥 Monto a rotina junto com o time ou amigos que jogam comigo",
      "🧠 Tenho um coach ou mentor que define minha rotina",
      "📱 Uso algum app, site ou ferramenta para organizar meus treinos",
      "🤷 Nunca pensei em ter uma rotina — jogo quando tenho tempo",
    ] },
  { id:19, section:"Rotina de Treino",icon:"⚡", type:"check", required:false,
    text:"O que acha que te ajudaria a evoluir melhor e ter uma rotina mais consolidada?",
    sub:"Marca tudo que faria diferença pra você",
    opts:[
      "📚 Um curso online focado no meu jogo",
      "🤝 Mais contato com jogadores profissionais",
      "🏟️ Mais oportunidades de peneiras para times academy",
      "🧠 Um coach ou analista acompanhando meu desenvolvimento",
      "👥 Um time fixo para treinar junto",
      "🏢 Um clube ou centro de treinamento perto de onde moro",
      "📊 Uma plataforma que mostre minha evolução e sugira treinos",
      "💸 Bolsa ou apoio financeiro para me dedicar mais",
      "👪 Mais apoio e entendimento da minha família",
    ] },
];

const TOTAL = QUESTIONS.length;
const getRank = (n) => [...RANKS].reverse().find(r => n >= r.at) || RANKS[0];

export default function App() {
  const [phase, setPhase]           = useState("start");
  const [qi, setQi]                 = useState(0);
  const [answers, setAnswers]       = useState({});
  const [anim, setAnim]             = useState("in");
  const [dir, setDir]               = useState("fwd");
  const [reaction, setReaction]     = useState(null);
  const [rankFlash, setRankFlash]   = useState(false);
  const [sending, setSending]       = useState(false);
  const [email, setEmail]           = useState("");
  const [emailSent, setEmailSent]   = useState(false);
  const [expanded, setExpanded]     = useState({});

  const q        = QUESTIONS[qi];
  const answered = Object.keys(answers).length;
  const rank     = getRank(answered);
  const xpPct    = (answered / TOTAL) * 100;
  const C        = rank.color;
  const BG       = rank.bg;

  const showReaction = (e) => { setReaction(e); setTimeout(() => setReaction(null), 900); };

  const navigate = (nextQi, direction) => {
    setDir(direction); setAnim("out");
    setTimeout(() => { setQi(nextQi); setAnim("in"); }, 260);
  };

  const handleRadio = (val) => {
    setAnswers(a => ({ ...a, [q.id]: val }));
    showReaction(["⚡","🎯","💥","👾","🕹️","✨"][Math.floor(Math.random()*6)]);
    setTimeout(() => {
      if (qi < TOTAL - 1) navigate(qi + 1, "fwd");
      else finalize({ ...answers, [q.id]: val });
    }, 600);
  };

  const toggleCheck = (opt) => setAnswers(a => {
    const cur = a[q.id] || [];
    return { ...a, [q.id]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] };
  });

  const continueCheck = () => {
    showReaction("✅");
    setTimeout(() => {
      if (qi < TOTAL - 1) navigate(qi + 1, "fwd");
      else finalize(answers);
    }, 500);
  };

  const finalize = async (final) => {
    setSending(true);
    if (WEBHOOK_URL) {
      try {
        const payload = QUESTIONS.reduce((obj, q) => {
          obj[`Q${q.id}_${q.section.replace(/ /g,"_")}`] = Array.isArray(final[q.id])
            ? final[q.id].join(" | ") : final[q.id] || "";
          return obj;
        }, { timestamp: new Date().toLocaleString("pt-BR") });
        await fetch(WEBHOOK_URL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body:JSON.stringify(payload) });
      } catch(e) { console.warn(e); }
    }
    setSending(false);
    setPhase("done");
  };

  const sendEmail = async () => {
    if (!email.trim() || !email.includes("@")) return;
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body:JSON.stringify({ tipo:"contato", email:email.trim(), timestamp:new Date().toLocaleString("pt-BR") }) });
      } catch(e) { console.warn(e); }
    }
    setEmailSent(true);
  };

  const toggleExpand = (sec) => setExpanded(e => ({ ...e, [sec]: !e[sec] }));

  const sectionGroups = QUESTIONS.reduce((acc, q) => {
    if (!acc[q.section]) acc[q.section] = [];
    acc[q.section].push(q);
    return acc;
  }, {});

  const animClass = `qwrap ${anim === "in" ? "in" : dir === "fwd" ? "out-fwd" : "out-bwd"}`;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    body { background:#07080f; overflow-y:auto; }

    .shell { min-height:100vh; background:#07080f; display:flex; flex-direction:column; align-items:center; font-family:'DM Sans',sans-serif; color:#f1f5f9; padding-bottom:80px; }

    /* START */
    .start { display:flex; flex-direction:column; align-items:center; padding:36px 24px 48px; max-width:480px; width:100%; text-align:center; }
    .start-title { font-family:'Rajdhani',sans-serif; font-size:clamp(2rem,8vw,2.8rem); font-weight:700; color:#fff; line-height:1.1; margin-bottom:10px; }
    .start-title span { color:var(--rc); }
    .start-desc { font-size:.92rem; color:#cbd5e1; line-height:1.75; margin-bottom:28px; max-width:360px; }
    .rank-preview { width:100%; background:#0d0f1a; border:1px solid #1a1c2e; border-radius:12px; padding:16px 18px; margin-bottom:28px; }
    .rank-preview-label { font-size:.68rem; color:#475569; letter-spacing:.12em; text-transform:uppercase; margin-bottom:10px; font-family:'Rajdhani',sans-serif; }
    .rank-track { height:8px; background:#12141f; border-radius:99px; overflow:hidden; margin-bottom:10px; }
    .rank-track-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#cd7f32,#94a3b8,#fbbf24,#67e8f9,#c084fc,#34d399); width:100%; }
    .rank-icons { display:flex; justify-content:space-between; }
    .rank-icon-item { display:flex; flex-direction:column; align-items:center; gap:2px; font-size:.6rem; color:#475569; }
    .rank-icon-item span:first-child { font-size:.9rem; }

    /* HUD */
    .hud { width:100%; max-width:520px; padding:14px 20px 10px; position:sticky; top:0; background:rgba(7,8,15,.94); backdrop-filter:blur(14px); border-bottom:1px solid #12141f; z-index:50; }
    .hud-top { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
    .rank-badge { display:flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; border:1px solid var(--rc); background:var(--rb); font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.8rem; color:var(--rc); transition:all .3s; }
    .rank-badge.flash { animation:pulse .5s ease 3; }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1);box-shadow:0 0 20px var(--rc)} }
    .hud-q { margin-left:auto; font-size:.72rem; color:#64748b; font-family:'Rajdhani',sans-serif; }
    .xp-track { height:5px; background:#12141f; border-radius:99px; overflow:hidden; }
    .xp-fill { height:100%; border-radius:99px; background:var(--rc); transition:width .5s cubic-bezier(.34,1.56,.64,1); }

    /* CARD */
    .card { width:100%; max-width:520px; padding:22px 22px 80px; }
    .sec-tag { display:inline-flex; align-items:center; gap:6px; font-size:.7rem; font-weight:600; color:var(--rc); letter-spacing:.1em; text-transform:uppercase; margin-bottom:14px; }
    .qwrap { transition:opacity .26s, transform .26s; }
    .qwrap.in { opacity:1; transform:translateX(0); }
    .qwrap.out-fwd { opacity:0; transform:translateX(-28px); }
    .qwrap.out-bwd { opacity:0; transform:translateX(28px); }
    .q-text { font-family:'Rajdhani',sans-serif; font-size:clamp(1.25rem,4vw,1.55rem); font-weight:700; color:#fff; line-height:1.3; margin-bottom:6px; }
    .q-sub { font-size:.84rem; color:#94a3b8; margin-bottom:18px; line-height:1.55; }

    /* OPTIONS */
    .opts { display:flex; flex-direction:column; gap:9px; margin-bottom:22px; }
    .opt { width:100%; text-align:left; background:#0d0f1a; border:1.5px solid #1e2030; border-radius:10px; padding:14px 16px; font-size:.92rem; color:#e2e8f0; cursor:pointer; font-family:'DM Sans',sans-serif; transition:border-color .15s,background .15s,color .15s; display:flex; align-items:center; gap:10px; }
    .opt:hover { border-color:var(--rc); color:#fff; background:#13151f; }
    .opt.sel { border-color:var(--rc); color:#fff; background:var(--rb); }
    .opt:active { transform:scale(.99); }

    /* BUTTONS */
    .btn { width:100%; padding:15px; border-radius:11px; background:var(--rc); border:none; color:#07080f; font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:800; cursor:pointer; letter-spacing:.06em; transition:filter .15s,transform .1s,opacity .15s; margin-bottom:10px; }
    .btn:hover { filter:brightness(1.08); }
    .btn:active { transform:scale(.98); }
    .btn:disabled { opacity:.28; cursor:not-allowed; }
    .btn-back { background:none; border:1px solid #1e2030; color:#94a3b8; font-size:.82rem; cursor:pointer; padding:10px 18px; border-radius:8px; font-family:'DM Sans',sans-serif; transition:color .15s,border-color .15s; }
    .btn-back:hover { color:#f1f5f9; border-color:#334155; }

    /* REACTION */
    .reaction { position:fixed; top:40%; left:50%; transform:translate(-50%,-50%); font-size:4rem; z-index:999; pointer-events:none; animation:rpop .9s cubic-bezier(.34,1.56,.64,1) forwards; }
    @keyframes rpop { 0%{opacity:0;transform:translate(-50%,-50%) scale(.4)} 40%{opacity:1;transform:translate(-50%,-60%) scale(1.2)} 70%{opacity:1;transform:translate(-50%,-65%) scale(1)} 100%{opacity:0;transform:translate(-50%,-80%) scale(.8)} }

    /* DONE */
    .done { display:flex; flex-direction:column; align-items:center; padding:48px 22px 60px; max-width:520px; width:100%; }
    .done-xp-wrap { width:100%; background:#0d0f1a; border:1px solid #1a1c2e; border-radius:12px; padding:16px 18px; margin-bottom:24px; }
    .done-xp-label { display:flex; justify-content:space-between; font-size:.72rem; color:#64748b; font-family:'Rajdhani',sans-serif; margin-bottom:8px; }
    .done-xp-track { height:8px; background:#12141f; border-radius:99px; overflow:hidden; }
    .done-xp-fill { height:100%; background:linear-gradient(90deg,#cd7f32,#94a3b8,#fbbf24,#67e8f9,#c084fc,#34d399); border-radius:99px; animation:xpIn .8s cubic-bezier(.34,1.56,.64,1); }
    @keyframes xpIn { from{width:0} to{width:100%} }
    .trophy { font-size:4.5rem; margin-bottom:14px; animation:tIn .6s cubic-bezier(.34,1.56,.64,1); }
    @keyframes tIn { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
    .done-title { font-family:'Rajdhani',sans-serif; font-size:1.9rem; font-weight:700; color:var(--rc); margin-bottom:8px; }
    .done-sub { font-size:.9rem; color:#94a3b8; line-height:1.7; margin-bottom:28px; text-align:center; }

    /* EMAIL */
    .email-box { width:100%; background:#0d0f1a; border:1.5px solid var(--rc-alpha,#1a1c2e); border-radius:14px; padding:22px 20px; margin-bottom:20px; }
    .email-title { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:6px; }
    .email-sub { font-size:.82rem; color:#94a3b8; line-height:1.65; margin-bottom:16px; }
    .email-input { width:100%; background:#13151f; border:1.5px solid #1e2030; border-radius:10px; padding:13px 16px; color:#f1f5f9; font-size:.9rem; font-family:'DM Sans',sans-serif; outline:none; margin-bottom:10px; transition:border-color .15s; }
    .email-input:focus { border-color:var(--rc); }
    .email-input::placeholder { color:#334155; }
    .email-note { font-size:.68rem; color:#334155; text-align:center; margin-top:6px; }

    /* ANSWER SECTIONS */
    .ans-section { width:100%; background:#0c0d16; border:1px solid #1a1c2e; border-radius:12px; overflow:hidden; margin-bottom:10px; }
    .ans-header { display:flex; align-items:center; gap:10px; padding:14px 18px; cursor:pointer; transition:background .15s; }
    .ans-header:hover { background:#0f111a; }
    .ans-sec-label { font-family:'Rajdhani',sans-serif; font-size:.8rem; font-weight:700; color:var(--rc); text-transform:uppercase; letter-spacing:.1em; flex:1; }
    .ans-chevron { font-size:.8rem; color:#334155; transition:transform .2s; }
    .ans-chevron.open { transform:rotate(180deg); }
    .ans-body { border-top:1px solid #12141f; }
    .ans-row { padding:11px 18px; border-bottom:1px solid #0d0f1a; display:flex; gap:10px; }
    .ans-row:last-child { border-bottom:none; }
    .ans-q { font-size:.7rem; color:#334155; flex-shrink:0; width:18px; padding-top:1px; }
    .ans-v { font-size:.82rem; color:#cbd5e1; line-height:1.5; }
  `;

  const DONE_RANK = RANKS[RANKS.length - 1];

  return (
    <div className="shell" style={{ "--rc":C, "--rb":BG }}>
      <style>{css}</style>
      {reaction && <div className="reaction">{reaction}</div>}

      {/* ── START ── */}
      {phase === "start" && (
        <div className="start" style={{ "--rc":RANKS[0].color, "--rb":RANKS[0].bg }}>
          <div style={{ fontSize:"2.6rem", marginBottom:14 }}>🎮</div>
          <h1 className="start-title">Jovens nos<br/><span>Esports</span></h1>
          <p className="start-desc">
            Uma pesquisa sobre a rotina, os sonhos e os desafios de jovens jogadores entre <strong style={{color:"#f1f5f9"}}>12 e 18 anos</strong>. São 19 perguntas e leva menos de 5 minutos. Todas as respostas são <strong style={{color:"#f1f5f9"}}>anônimas</strong> e usadas apenas para fins de pesquisa.
          </p>

          <div className="rank-preview">
            <div className="rank-preview-label">Sua progressão durante a pesquisa</div>
            <div className="rank-track"><div className="rank-track-fill" /></div>
            <div className="rank-icons">
              {RANKS.map(r => (
                <div key={r.name} className="rank-icon-item">
                  <span>{r.icon}</span>
                  <span style={{ color:r.color }}>{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn" style={{ "--rc":RANKS[0].color, background:RANKS[0].color, maxWidth:320, width:"100%" }} onClick={() => setPhase("play")}>
            COMEÇAR →
          </button>
          <p style={{ fontSize:".8rem", color:"#94a3b8", marginTop:12, letterSpacing:".04em" }}>🔒 Respostas anônimas · apenas para pesquisa acadêmica</p>
        </div>
      )}

      {/* ── PLAY ── */}
      {phase === "play" && (
        <>
          <div className="hud" style={{ "--rc":C, "--rb":BG }}>
            <div className="hud-top">
              <div className={`rank-badge${rankFlash?" flash":""}`} style={{ "--rc":C, "--rb":BG }}>{rank.icon} {rank.name}</div>
              <div className="hud-q">{qi+1} / {TOTAL}</div>
            </div>
            <div className="xp-track"><div className="xp-fill" style={{ width:`${xpPct}%`, "--rc":C }} /></div>
          </div>

          <div className="card" style={{ "--rc":C, "--rb":BG }}>
            <div className={animClass}>
              <div className="sec-tag" style={{ "--rc":C }}>{q.icon} {q.section}</div>
              <div className="q-text">{q.text}</div>
              {q.sub && <div className="q-sub">{q.sub}</div>}
              {!q.sub && <div style={{ marginBottom:18 }} />}

              {/* RADIO */}
              {q.type === "radio" && (
                <div className="opts">
                  {q.opts.map(opt => (
                    <button key={opt} className={`opt${answers[q.id]===opt?" sel":""}`}
                      style={{ "--rc":C, "--rb":BG }} onClick={() => handleRadio(opt)}>{opt}</button>
                  ))}
                </div>
              )}

              {/* CHECKBOX */}
              {q.type === "check" && (
                <>
                  <div className="opts">
                    {q.opts.map(opt => {
                      const sel = (answers[q.id]||[]).includes(opt);
                      return (
                        <button key={opt} className={`opt${sel?" sel":""}`}
                          style={{ "--rc":C, "--rb":BG }} onClick={() => toggleCheck(opt)}>
                          <span style={{ flexShrink:0 }}>{sel?"✅":"⬜"}</span>{opt}
                        </button>
                      );
                    })}
                  </div>
                  <button className="btn" style={{ "--rc":C, background:C }}
                    disabled={q.required && !(answers[q.id]?.length)}
                    onClick={continueCheck}>CONFIRMAR →</button>
                </>
              )}

              <div style={{ display:"flex", gap:12, alignItems:"center", marginTop:4 }}>
                {qi > 0 && <button className="btn-back" onClick={() => navigate(qi-1,"bwd")}>← voltar</button>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DONE ── */}
      {phase === "done" && (
        <div className="done" style={{ "--rc":DONE_RANK.color, "--rb":DONE_RANK.bg }}>

          {/* XP / Progress */}
          <div className="done-xp-wrap">
            <div className="done-xp-label">
              <span>Progresso</span>
              <span style={{ color:DONE_RANK.color }}>⭐ Global Elite — {TOTAL}/{TOTAL} respostas</span>
            </div>
            <div className="done-xp-track"><div className="done-xp-fill" style={{ width:"100%" }} /></div>
          </div>

          <div className="trophy">🏆</div>
          <div className="done-title" style={{ color:DONE_RANK.color }}>GG — Global Elite!</div>
          <p className="done-sub">Você completou a pesquisa! Suas respostas vão ajudar a entender melhor a realidade dos jovens nos esports. 🎮</p>

          {/* ── EMAIL FIRST ── */}
          <div className="email-box" style={{ "--rc":DONE_RANK.color, borderColor:`${DONE_RANK.color}44` }}>
            {!emailSent ? (
              <>
                <div style={{ fontSize:"1.3rem", marginBottom:8 }}>📬</div>
                <div className="email-title">Quer acompanhar o projeto?</div>
                <p className="email-sub">
                  Se quiser receber os resultados da pesquisa ou participar da próxima etapa — entrevistas e conversas mais aprofundadas — deixa seu e-mail aqui. Totalmente opcional, sem spam. 🤝
                </p>
                <input className="email-input" type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && sendEmail()}
                  style={{ "--rc":DONE_RANK.color }}
                  onFocus={e => e.target.style.borderColor=DONE_RANK.color}
                  onBlur={e => e.target.style.borderColor="#1e2030"} />
                <button onClick={sendEmail}
                  disabled={!email.trim()||!email.includes("@")}
                  style={{
                    width:"100%", padding:"13px", borderRadius:10,
                    background: email.trim()&&email.includes("@") ? DONE_RANK.color : "#1a1c2e",
                    border:"none",
                    color: email.trim()&&email.includes("@") ? "#07080f" : "#334155",
                    fontFamily:"'Rajdhani',sans-serif", fontSize:"1rem", fontWeight:800,
                    cursor: email.trim()&&email.includes("@") ? "pointer" : "not-allowed",
                    transition:"background .2s,color .2s", letterSpacing:".05em"
                  }}>QUERO PARTICIPAR →</button>
                <p className="email-note">Seu e-mail não será compartilhado com terceiros.</p>
              </>
            ) : (
              <div style={{ textAlign:"center", padding:"8px 0" }}>
                <div style={{ fontSize:"2rem", marginBottom:8 }}>✅</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"1rem", fontWeight:700, color:DONE_RANK.color, marginBottom:6 }}>E-mail registrado!</div>
                <p style={{ fontSize:".82rem", color:"#94a3b8", lineHeight:1.6 }}>Obrigada! Entraremos em contato quando a pesquisa estiver pronta. 🎮</p>
              </div>
            )}
          </div>

          {/* ── COLLAPSIBLE ANSWERS ── */}
          <div style={{ width:"100%", marginBottom:10 }}>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:".68rem", color:"#334155", letterSpacing:".16em", textTransform:"uppercase", marginBottom:12 }}>
              Suas respostas
            </div>
            {Object.entries(sectionGroups).map(([sec, qs]) => {
              const isOpen = !!expanded[sec];
              return (
                <div key={sec} className="ans-section" style={{ "--rc":DONE_RANK.color }}>
                  <div className="ans-header" onClick={() => toggleExpand(sec)}>
                    <span style={{ fontSize:"1rem" }}>{qs[0].icon}</span>
                    <span className="ans-sec-label" style={{ color:DONE_RANK.color }}>{sec}</span>
                    <span className={`ans-chevron${isOpen?" open":""}`}>▾</span>
                  </div>
                  {isOpen && (
                    <div className="ans-body">
                      {qs.map((q, i) => {
                        const val = answers[q.id];
                        const display = Array.isArray(val) ? val.join(", ") : val;
                        return display ? (
                          <div key={q.id} className="ans-row">
                            <span className="ans-q">{i+1}.</span>
                            <span className="ans-v">{display}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {sending && <p style={{ fontSize:".78rem", color:"#475569", marginTop:8 }}>Enviando... ⏳</p>}
        </div>
      )}
    </div>
  );
}
