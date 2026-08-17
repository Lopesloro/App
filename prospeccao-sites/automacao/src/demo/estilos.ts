// CSS dos modelos de demo. Um bloco base compartilhado (esqueleto, acessibilidade,
// botão flutuante) + um bloco POR VARIANTE que muda de verdade a cara do site:
// tipografia, cores, layout do hero, formato dos serviços. As demos não podem
// parecer irmãs — cada variante tem identidade própria (nota 13 do vault).

export const CSS_BASE = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}}
body{font-family:var(--fonte-corpo);color:var(--tinta);background:var(--fundo);line-height:1.6;-webkit-font-smoothing:antialiased}
img,svg{max-width:100%;display:block}
a{color:inherit}
.container{max-width:1080px;margin-inline:auto;padding-inline:clamp(16px,4vw,32px)}
.pular{position:absolute;left:-999px;top:0;background:var(--tinta);color:var(--fundo);padding:8px 16px;z-index:99}
.pular:focus{left:8px}
:focus-visible{outline:3px solid var(--acento);outline-offset:2px}

/* Topo */
.topo{position:sticky;top:0;z-index:50;background:var(--fundo-topo);backdrop-filter:blur(8px);border-bottom:1px solid var(--linha)}
.topo .container{display:flex;align-items:center;gap:20px;min-height:64px}
.marca{font-family:var(--fonte-titulo);font-size:1.15rem;font-weight:700;letter-spacing:var(--espaco-marca,0)}
.nav-links{display:flex;gap:24px;margin-left:auto;font-size:.95rem}
.nav-links a{text-decoration:none;opacity:.85}
.nav-links a:hover{opacity:1;color:var(--acento)}
.botao-topo{margin-left:12px}
.menu-mobile{display:none;margin-left:auto}
@media (max-width:719px){
  .nav-links,.botao-topo{display:none}
  .menu-mobile{display:block;position:relative}
  .menu-mobile summary{list-style:none;cursor:pointer;padding:10px;border:1px solid var(--linha);border-radius:10px;font-size:.9rem}
  .menu-mobile summary::-webkit-details-marker{display:none}
  .menu-mobile[open] .menu-itens{position:absolute;right:0;top:calc(100% + 8px);background:var(--fundo);border:1px solid var(--linha);border-radius:12px;min-width:200px;padding:8px;box-shadow:0 12px 32px rgba(0,0,0,.18)}
  .menu-itens a{display:block;padding:12px 16px;text-decoration:none;border-radius:8px}
  .menu-itens a:hover{background:var(--suave)}
}

/* Botões */
.botao{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;text-decoration:none;
  padding:14px 26px;border-radius:var(--raio-botao);background:var(--acento);color:var(--sobre-acento);
  border:2px solid var(--acento);transition:transform .15s ease,box-shadow .15s ease;font-size:1rem}
.botao:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.16)}
.botao.fantasma{background:transparent;color:var(--tinta);border-color:var(--linha-forte)}
.botao.fantasma:hover{border-color:var(--acento);color:var(--acento)}
.acoes{display:flex;flex-wrap:wrap;gap:14px;margin-top:28px}

/* Seções */
section{padding-block:clamp(56px,9vw,104px)}
.rotulo-secao{font-size:.8rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--acento);margin-bottom:12px}
h1{font-family:var(--fonte-titulo);font-size:clamp(2.1rem,5.4vw,3.6rem);line-height:1.12;font-weight:var(--peso-h1,700);letter-spacing:var(--espaco-h1,-0.01em)}
h2{font-family:var(--fonte-titulo);font-size:clamp(1.5rem,3.4vw,2.2rem);line-height:1.2;margin-bottom:16px;font-weight:var(--peso-h2,700)}
.intro-secao{max-width:640px;color:var(--tinta-suave);margin-bottom:40px}
.hero p.descricao{max-width:600px;font-size:clamp(1.02rem,2vw,1.2rem);color:var(--tinta-suave);margin-top:18px}

/* Serviços (estruturas por variante ficam no CSS da variante) */
.grade-servicos{display:grid;gap:20px}
.servico h3{font-family:var(--fonte-titulo);font-size:1.12rem;margin-bottom:6px;font-weight:var(--peso-h2,700)}
.servico p{color:var(--tinta-suave);font-size:.97rem}

/* Sobre + métricas */
.metricas{display:flex;flex-wrap:wrap;gap:clamp(20px,5vw,56px);margin-top:36px}
.metrica strong{display:block;font-family:var(--fonte-titulo);font-size:clamp(1.6rem,4vw,2.4rem);color:var(--acento)}
.metrica span{font-size:.9rem;color:var(--tinta-suave)}

/* Depoimentos */
.grade-depoimentos{display:grid;gap:20px}
@media (min-width:720px){.grade-depoimentos{grid-template-columns:1fr 1fr}}
blockquote{background:var(--suave);border-radius:var(--raio-cartao);padding:26px}
blockquote p{font-size:1.02rem}
blockquote footer{margin-top:14px;font-size:.88rem;color:var(--tinta-suave)}
.nota-ilustrativa{margin-top:18px;font-size:.8rem;color:var(--tinta-suave)}

/* Contato */
.grade-contato{display:grid;gap:28px;margin-top:8px}
@media (min-width:820px){.grade-contato{grid-template-columns:1.2fr 1fr;align-items:start}}
.bloco-contato{background:var(--suave);border-radius:var(--raio-cartao);padding:28px}
.bloco-contato dt{font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tinta-suave);margin-top:18px}
.bloco-contato dt:first-child{margin-top:0}
.bloco-contato dd{font-size:1.05rem;margin-top:4px}

/* Rodapé */
.rodape{border-top:1px solid var(--linha);padding-block:32px;font-size:.88rem;color:var(--tinta-suave)}
.rodape .container{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between}

/* WhatsApp flutuante */
.zap-flutuante{position:fixed;right:18px;bottom:18px;z-index:60;width:58px;height:58px;border-radius:50%;
  background:#25d366;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 28px rgba(0,0,0,.28)}
.zap-flutuante svg{width:30px;height:30px;fill:#fff}
.zap-flutuante:hover{transform:scale(1.06)}
`;

export const CSS_VARIANTES: Record<string, string> = {
  /* ── v01 · Minimal claro: ar, precisão, uma cor só ─────────────────── */
  'v01-minimal-claro': `
:root{
  --fundo:#fbfaf7;--fundo-topo:rgba(251,250,247,.85);--tinta:#22302e;--tinta-suave:#5c6b68;
  --acento:#0e7568;--sobre-acento:#ffffff;--suave:#f1efe9;--linha:#e6e2d8;--linha-forte:#c9c3b4;
  --raio-botao:999px;--raio-cartao:18px;
  --fonte-titulo:'Avenir Next','Segoe UI',ui-sans-serif,system-ui,sans-serif;
  --fonte-corpo:'Avenir Next','Segoe UI',ui-sans-serif,system-ui,sans-serif;
  --peso-h1:600;--peso-h2:600;--espaco-h1:-0.02em}
.hero{text-align:center;padding-block:clamp(72px,12vw,140px)}
.hero .container{max-width:760px}
.hero p.descricao{margin-inline:auto}
.hero .acoes{justify-content:center}
.selo{display:inline-block;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;color:var(--acento);
  border:1px solid var(--linha-forte);border-radius:999px;padding:6px 16px;margin-bottom:22px}
.arco-hero{margin:56px auto 0;max-width:520px;opacity:.9}
.servicos .grade-servicos{gap:0;border-top:1px solid var(--linha)}
.servicos .servico{display:grid;gap:6px;padding-block:26px;border-bottom:1px solid var(--linha)}
@media (min-width:720px){.servicos .servico{grid-template-columns:260px 1fr;gap:32px}}
.sobre{background:var(--suave)}
blockquote{background:#fff;border:1px solid var(--linha)}
`,

  /* ── v02 · Premium escuro: serifa, dourado, autoridade ─────────────── */
  'v02-premium-escuro': `
:root{
  --fundo:#12151a;--fundo-topo:rgba(18,21,26,.88);--tinta:#e9e5da;--tinta-suave:#a8a396;
  --acento:#c9a227;--sobre-acento:#15130b;--suave:#191d24;--linha:#272c35;--linha-forte:#3a404c;
  --raio-botao:4px;--raio-cartao:6px;
  --fonte-titulo:Georgia,'Times New Roman',serif;
  --fonte-corpo:'Segoe UI',ui-sans-serif,system-ui,sans-serif;
  --peso-h1:500;--peso-h2:500;--espaco-h1:0;--espaco-marca:.06em}
.marca{text-transform:uppercase;font-weight:500}
.hero{padding-block:clamp(80px,13vw,150px);position:relative;overflow:hidden}
.hero .container{position:relative}
.filete{width:64px;height:2px;background:var(--acento);margin-bottom:28px}
.hero h1{max-width:15ch}
.hero p.descricao{border-left:1px solid var(--linha-forte);padding-left:22px}
.ornamento-v02{position:absolute;right:-40px;top:50%;transform:translateY(-50%);opacity:.5;pointer-events:none}
.servicos .grade-servicos{gap:0}
@media (min-width:720px){.servicos .grade-servicos{grid-template-columns:1fr 1fr;gap:0 64px}}
.servicos .servico{padding-block:30px;border-top:1px solid var(--linha);display:grid;grid-template-columns:56px 1fr;gap:18px}
.servicos .numero{font-family:var(--fonte-titulo);color:var(--acento);font-size:1.4rem}
.sobre{background:var(--suave)}
.depoimentos .grade-depoimentos{grid-template-columns:1fr}
blockquote{background:transparent;border:0;border-left:2px solid var(--acento);border-radius:0;padding:8px 0 8px 28px}
blockquote p{font-family:var(--fonte-titulo);font-size:clamp(1.2rem,2.6vw,1.6rem);line-height:1.45;font-style:italic}
.bloco-contato{border:1px solid var(--linha)}
.zap-flutuante{background:#1f8f56}
`,

  /* ── v03 · Vibrante comercial: energia, botão grande, WhatsApp em tudo ─ */
  'v03-vibrante-comercial': `
:root{
  --fundo:#fffdf8;--fundo-topo:rgba(255,253,248,.9);--tinta:#292018;--tinta-suave:#6d5f52;
  --acento:#e85d10;--sobre-acento:#ffffff;--suave:#fdf3e7;--linha:#f0e2cf;--linha-forte:#d8c3a5;
  --raio-botao:14px;--raio-cartao:20px;
  --fonte-titulo:ui-sans-serif,system-ui,'Segoe UI',sans-serif;
  --fonte-corpo:ui-sans-serif,system-ui,'Segoe UI',sans-serif;
  --peso-h1:800;--peso-h2:800;--espaco-h1:-0.02em}
.faixa-urgencia{background:#292018;color:#ffe9d2;text-align:center;font-size:.88rem;padding:9px 16px;font-weight:600}
.hero{position:relative;overflow:hidden;padding-block:clamp(64px,10vw,120px)}
.blob-hero{position:absolute;right:-120px;top:-60px;width:480px;pointer-events:none}
.selo{display:inline-flex;align-items:center;gap:8px;background:#e7f7ec;color:#116b39;font-weight:700;font-size:.85rem;
  border-radius:999px;padding:8px 18px;margin-bottom:20px}
.selo::before{content:"";width:9px;height:9px;border-radius:50%;background:#1eae5c}
.hero .container{position:relative}
.botao{box-shadow:0 6px 0 rgba(41,32,24,.14)}
.botao:hover{box-shadow:0 8px 0 rgba(41,32,24,.14)}
.botao.zap{background:#1eae5c;border-color:#1eae5c}
@media (min-width:720px){.servicos .grade-servicos{grid-template-columns:repeat(2,1fr)}}
.servicos .servico{background:#fff;border:1px solid var(--linha);border-radius:var(--raio-cartao);padding:26px;
  box-shadow:0 6px 20px rgba(41,32,24,.06)}
.icone-servico{width:46px;height:46px;border-radius:14px;background:var(--suave);display:flex;align-items:center;
  justify-content:center;margin-bottom:16px;color:var(--acento)}
.sobre{background:var(--suave)}
blockquote{background:#fff;border:1px solid var(--linha)}
.barra-zap{display:none}
@media (max-width:719px){
  .barra-zap{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:55;background:#1eae5c;color:#fff;
    justify-content:center;gap:10px;padding:15px;font-weight:700;text-decoration:none}
  .zap-flutuante{display:none}
  body{padding-bottom:54px}}
`,

  /* ── v04 · Editorial serifado: revista, papel, ritmo de leitura ────── */
  'v04-editorial-serifado': `
:root{
  --fundo:#f7f2e8;--fundo-topo:rgba(247,242,232,.9);--tinta:#2b241d;--tinta-suave:#6b5f50;
  --acento:#9a3f12;--sobre-acento:#fdf9f1;--suave:#efe7d7;--linha:#ddd2bd;--linha-forte:#b8a98c;
  --raio-botao:2px;--raio-cartao:2px;
  --fonte-titulo:Georgia,'Times New Roman',serif;
  --fonte-corpo:Georgia,'Times New Roman',serif;
  --peso-h1:500;--peso-h2:500}
.topo{border-bottom:3px double var(--linha-forte)}
.nav-links{font-family:ui-sans-serif,system-ui,sans-serif;text-transform:uppercase;font-size:.78rem;letter-spacing:.12em}
.hero{text-align:center;padding-block:clamp(64px,10vw,120px);border-bottom:3px double var(--linha-forte)}
.chapeu{font-family:ui-sans-serif,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.28em;font-size:.8rem;
  color:var(--acento);margin-bottom:24px}
.hero h1{max-width:18ch;margin-inline:auto}
.hero h1::after{content:"";display:block;width:88px;height:1px;background:var(--linha-forte);margin:30px auto 0}
.hero p.descricao{margin-inline:auto;font-style:italic}
.hero .acoes{justify-content:center}
.rotulo-secao{font-family:ui-sans-serif,system-ui,sans-serif;letter-spacing:.28em}
.servicos .grade-servicos{gap:0}
.servicos .servico{display:grid;gap:8px;padding-block:34px;border-bottom:1px solid var(--linha)}
@media (min-width:760px){.servicos .servico{grid-template-columns:80px 240px 1fr;gap:32px;align-items:baseline}}
.servicos .numero{font-size:2rem;color:var(--linha-forte);font-variant-numeric:tabular-nums}
.sobre{background:var(--suave)}
.sobre .container>p:first-of-type::first-letter{font-size:3.1em;float:left;line-height:.82;padding-right:12px;color:var(--acento)}
blockquote{background:transparent;border:0;padding:0 0 0 26px;border-left:3px double var(--linha-forte)}
blockquote p{font-style:italic;font-size:1.15rem}
.bloco-contato{background:transparent;border:1px solid var(--linha-forte)}
`,

  /* ── v05 · Blocos coloridos: leve, arredondado, organizado ─────────── */
  'v05-blocos-coloridos': `
:root{
  --fundo:#fcfbff;--fundo-topo:rgba(252,251,255,.9);--tinta:#241f36;--tinta-suave:#5d5678;
  --acento:#6d3ae3;--sobre-acento:#ffffff;--suave:#f2effc;--linha:#e6e1f5;--linha-forte:#c9bfe8;
  --raio-botao:999px;--raio-cartao:26px;
  --fonte-titulo:'Trebuchet MS',ui-rounded,ui-sans-serif,system-ui,sans-serif;
  --fonte-corpo:'Trebuchet MS',ui-sans-serif,system-ui,sans-serif;
  --peso-h1:700;--peso-h2:700}
.hero{padding-block:clamp(56px,9vw,110px)}
.cartao-hero{background:linear-gradient(135deg,#efe9ff 0%,#e5f4ff 55%,#eafbf1 100%);border-radius:36px;
  padding:clamp(36px,7vw,80px);position:relative;overflow:hidden}
.bolhas{position:absolute;right:-40px;bottom:-60px;opacity:.65;pointer-events:none}
.cartao-hero .selo{display:inline-block;background:#fff;border-radius:999px;padding:8px 18px;font-size:.85rem;
  font-weight:700;color:var(--acento);box-shadow:0 4px 14px rgba(36,31,54,.08);margin-bottom:20px}
.grade-servicos{grid-template-columns:1fr}
@media (min-width:640px){.servicos .grade-servicos{grid-template-columns:repeat(2,1fr)}}
.servicos .servico{border-radius:var(--raio-cartao);padding:28px}
.servicos .servico:nth-child(4n+1){background:#f3edff}
.servicos .servico:nth-child(4n+2){background:#e9f5ff}
.servicos .servico:nth-child(4n+3){background:#eafaf0}
.servicos .servico:nth-child(4n+4){background:#fff2ec}
.icone-servico{width:52px;height:52px;border-radius:50%;background:#fff;display:flex;align-items:center;
  justify-content:center;margin-bottom:18px;color:var(--acento);box-shadow:0 4px 12px rgba(36,31,54,.1)}
.sobre .container{background:var(--suave);border-radius:36px;padding:clamp(32px,6vw,64px)}
blockquote{box-shadow:0 6px 20px rgba(36,31,54,.06);background:#fff}
`,

  /* ── v06 · Foto imersiva: tela cheia, tipografia fina, contraste ───── */
  'v06-foto-imersiva': `
:root{
  --fundo:#f5f4f2;--fundo-topo:rgba(16,18,20,.55);--tinta:#1c1e20;--tinta-suave:#585d61;
  --acento:#1c1e20;--sobre-acento:#f5f4f2;--suave:#eae8e4;--linha:#ddd9d3;--linha-forte:#b9b3aa;
  --raio-botao:0;--raio-cartao:0;
  --fonte-titulo:'Helvetica Neue',ui-sans-serif,system-ui,sans-serif;
  --fonte-corpo:'Helvetica Neue',ui-sans-serif,system-ui,sans-serif;
  --peso-h1:300;--peso-h2:400;--espaco-h1:.04em;--espaco-marca:.22em}
.topo{position:fixed;left:0;right:0;border-bottom:0;color:#f5f4f2;backdrop-filter:none;
  background:linear-gradient(180deg,rgba(12,14,16,.72),rgba(12,14,16,0))}
.topo .botao{background:transparent;border-color:rgba(245,244,242,.55);color:#f5f4f2}
.topo .botao:hover{background:#f5f4f2;color:#1c1e20}
.topo .menu-mobile summary{border-color:rgba(245,244,242,.4)}
.topo .menu-mobile[open] .menu-itens{background:#1c1e20;border-color:#333}
.hero{min-height:96vh;display:flex;align-items:flex-end;color:#f5f4f2;position:relative;padding-block:0;overflow:hidden;
  background:
    radial-gradient(1200px 640px at 78% 12%,rgba(214,192,158,.34),transparent 60%),
    radial-gradient(900px 700px at 12% 88%,rgba(84,110,122,.5),transparent 65%),
    linear-gradient(178deg,#23282c 0%,#191c1f 48%,#101214 100%)}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.14),rgba(0,0,0,.5) 82%)}
.hero .container{position:relative;z-index:1;padding-bottom:clamp(56px,10vw,110px);padding-top:140px}
.hero h1{text-transform:uppercase;letter-spacing:.1em;max-width:16ch}
.hero p.descricao{color:#cfcbc4}
.hero .selo{font-size:.75rem;letter-spacing:.34em;text-transform:uppercase;color:#d6c09e;display:block;margin-bottom:26px}
.hero .botao{background:transparent;border-color:#f5f4f2;color:#f5f4f2}
.hero .botao:hover{background:#f5f4f2;color:#1c1e20}
.hero .botao.fantasma{border-color:rgba(245,244,242,.5)}
h2{text-transform:uppercase;letter-spacing:.1em}
.servicos .grade-servicos{gap:0;border-top:1px solid var(--linha-forte)}
@media (min-width:760px){.servicos .grade-servicos{grid-template-columns:repeat(2,1fr)}}
.servicos .servico{padding:34px 28px 34px 0;border-bottom:1px solid var(--linha)}
@media (min-width:760px){.servicos .servico:nth-child(odd){border-right:1px solid var(--linha);padding-right:40px}
  .servicos .servico:nth-child(even){padding-left:40px}}
.servicos .numero{font-size:.8rem;letter-spacing:.3em;color:var(--tinta-suave);display:block;margin-bottom:10px}
.sobre{background:#1c1e20;color:#e8e6e1}
.sobre .rotulo-secao{color:#d6c09e}
.sobre .intro-secao,.sobre .metrica span{color:#a3a09a}
.sobre .metrica strong{color:#d6c09e}
blockquote{background:transparent;border:1px solid var(--linha-forte);border-radius:0}
.zap-flutuante{border-radius:0}
`,
};
