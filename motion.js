/* Decola Acre — camada de movimento (home e /peru).
   Só enfeita: se der erro aqui, o site continua funcionando. */
(function(){
  'use strict';
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('mo');

  function quandoVisivel(el, fn, opt){
    if(!('IntersectionObserver' in window)){ fn(); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ fn(); io.disconnect(); } }); }, opt || {threshold:.2});
    io.observe(el);
  }
  function marcaOn(sel, opt){ document.querySelectorAll(sel).forEach(function(el){ quandoVisivel(el, function(){ el.classList.add('mo-on'); }, opt); }); }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, at){ var e=document.createElementNS(SVGNS, tag); for(var k in at) e.setAttribute(k, at[k]); return e; }

  /* 1. barra de progresso */
  try {
    var bar = document.createElement('div'); bar.className='mo-progresso'; document.body.appendChild(bar);
    var tick=false;
    window.addEventListener('scroll', function(){
      if(tick) return; tick=true;
      requestAnimationFrame(function(){
        var d=document.documentElement, max=d.scrollHeight-d.clientHeight;
        bar.style.transform='scaleX('+(max>0?Math.min(1,d.scrollTop/max):0)+')'; tick=false;
      });
    }, {passive:true});
  } catch(e){}

  /* 2. grifos que se pintam */
  try { marcaOn('.pe-grifo,.grifo', {threshold:.6}); } catch(e){}

  /* 3. faixa de destinos correndo (home) */
  try {
    var alvo = document.getElementById('banner-carousel');
    if(alvo && !document.querySelector('.mo-ticker')){
      var nomes = ['Cusco <b>🇵🇪</b>','Porto de Galinhas','Gramado','Machu Picchu <b>🇵🇪</b>','Rio de Janeiro','Foz do Iguaçu','Salvador','Jericoacoara','Vale Sagrado <b>🇵🇪</b>','Bonito','Florianópolis','Fortaleza','Natal','Maceió','São Paulo'];
      var html = nomes.map(function(n){ return '<span class="mo-ticker-item">'+n+'<i>✈</i></span>'; }).join('');
      var t = document.createElement('div'); t.className='mo-ticker'; t.setAttribute('aria-hidden','true');
      t.innerHTML = '<div class="mo-ticker-trilho">'+html+html+'</div>';
      alvo.parentNode.insertBefore(t, alvo);
    }
  } catch(e){}

  /* 4. vídeo do topo: zoom lento + avião em loop com rastro tracejado (home) */
  try {
    var v = document.querySelector('video');
    if(v && !calmo && window.CSS && CSS.supports && CSS.supports('offset-path','path("M0 0 L1 1")')){
      v.classList.add('mo-hero-video');
      var caixa = v.parentElement;
      var montar = function(){
        var w=caixa.clientWidth, h=caixa.clientHeight;
        var d='M '+(-60)+' '+(h*.78)+' C '+(w*.28)+' '+(h*.95)+', '+(w*.55)+' '+(h*.12)+', '+(w+60)+' '+(h*.2);
        var old=caixa.querySelector('.mo-rota-hero'); if(old) old.remove();
        var oa=caixa.querySelector('.mo-aviao'); if(oa) oa.remove();
        var s=svgEl('svg',{'class':'mo-rota-hero',viewBox:'0 0 '+w+' '+h,preserveAspectRatio:'none'});
        s.appendChild(svgEl('path',{d:d})); var texto=caixa.lastElementChild; caixa.insertBefore(s, texto);
        var a=document.createElement('div'); a.className='mo-aviao';
        a.innerHTML='<svg viewBox="0 0 24 24" width="34" height="34"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#FFF8E7"/></svg>';
        a.style.offsetPath='path("'+d+'")'; caixa.insertBefore(a, texto);
      };
      montar(); var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt=setTimeout(montar,250); });
    }
  } catch(e){}

  /* 5. cartões em cascata + hover */
  try {
    var grades = [];
    document.querySelectorAll('#pacotes ~ div [style*="grid-template-columns:repeat(auto-fit,minmax(220px"], #pacotes [style*="grid-template-columns:repeat(auto-fit,minmax(220px"]').forEach(function(g){ grades.push(g); });
    ['.pe-fotos','.pe-ways','#como-funciona','.dias','.ir','.hero-meta'].forEach(function(s){ var g=document.querySelector(s); if(g) grades.push(g); });
    grades.forEach(function(g){
      Array.prototype.forEach.call(g.children, function(c,i){
        c.removeAttribute('data-reveal'); c.style.opacity=''; c.style.transform='';
        c.style.transitionDelay=(i*0.09)+'s'; c.classList.remove('reveal');
        if(c.querySelector('img')){ c.classList.add('mo-card'); var im=c.querySelector('img'); if(im.parentElement!==c) im.parentElement.style.overflow='hidden'; }
      });
      g.classList.add('mo-cascata');
      quandoVisivel(g, function(){ g.classList.add('mo-on'); setTimeout(function(){ Array.prototype.forEach.call(g.children,function(c){ c.style.transitionDelay=''; }); }, 1600); }, {threshold:.12});
    });
    document.querySelectorAll('.dia').forEach(function(c){ c.classList.add('mo-card'); });
  } catch(e){}

  /* 6. números que contam (hero do /peru) */
  try {
    document.querySelectorAll('.hm .v').forEach(function(el){
      var m = el.textContent.match(/^(~?)([\d.]+)(\s*\w*)$/); if(!m) return;
      var fim = parseInt(m[2].replace(/\./g,''),10); if(!fim) return;
      var fmt=function(n){ return m[1]+n.toLocaleString('pt-BR')+m[3]; };
      if(calmo) return;
      el.textContent=fmt(0);
      quandoVisivel(el, function(){
        var t0=performance.now(), dur=1600;
        (function passo(t){ var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3); el.textContent=fmt(Math.round(fim*e/ (fim>=1000?25:1))*(fim>=1000?25:1)); if(p<1) requestAnimationFrame(passo); else el.textContent=fmt(fim); })(t0);
      });
    });
  } catch(e){}

  /* 7. perfil de altitude Rio Branco → Cusco (desenha a estrada subindo os Andes) */
  try {
    document.querySelectorAll('[data-perfil-alt]').forEach(function(box){
      // km aproximado x altitude aproximada (m)
      var P=[[0,150],[340,250],[572,190],[700,350],[770,650],[830,1800],[870,3300],[905,4725],[945,3900],[990,3500],[1050,3400]];
      var R=[[0,'Rio Branco','~150 m'],[572,'Puerto Maldonado','~190 m'],[905,'Abra Pirhuayani','4.725 m'],[1050,'Cusco','3.400 m']];
      var estreito=box.clientWidth<620, W=estreito?600:1000,H=estreito?340:300,top=estreito?70:58,base=H-28, X=function(k){return 24+k/1050*(W-48);}, Y=function(a){return base-(a/4725)*(base-top);};
      var s=svgEl('svg',{viewBox:'0 0 '+W+' '+(H+8),role:'img','aria-label':'Perfil de altitude da estrada de Rio Branco a Cusco'});
      var defs=svgEl('defs',{}), gr=svgEl('linearGradient',{id:'mo-grad',x1:0,y1:0,x2:0,y2:1});
      gr.appendChild(svgEl('stop',{offset:'0','stop-color':'#FFCB05','stop-opacity':'.45'})); gr.appendChild(svgEl('stop',{offset:'1','stop-color':'#FFCB05','stop-opacity':'0'}));
      defs.appendChild(gr); s.appendChild(defs);
      var d=P.map(function(p,i){ return (i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1); }).join(' ');
      s.appendChild(svgEl('path',{'class':'area',d:d+' L'+X(1050)+' '+base+' L'+X(0)+' '+base+' Z'}));
      s.appendChild(svgEl('line',{x1:X(0),y1:base,x2:X(1050),y2:base,stroke:'rgba(255,248,231,.25)'}));
      var linha=svgEl('path',{'class':'linha',d:d}); s.appendChild(linha);
      var rots=R.map(function(r,i){
        var g=svgEl('g',{'class':'rotulo'}), x=X(r[0]), y=Y(P.filter(function(p){return p[0]===r[0];})[0][1]);
        var anc = i===0?'start':(i===R.length-1?'end':'middle');
        g.appendChild(svgEl('line',{x1:x,y1:y,x2:x,y2:base}));
        g.appendChild(svgEl('circle',{cx:x,cy:y,r:6,fill:'#FFF8E7',stroke:'#0A5F2C','stroke-width':3}));
        var ty = y-34 < 16 ? y+30 : y-34;
        if(r[0]===905) ty = y-30;
        if(estreito && r[0]===1050){ ty = y+40; }
        var t1=svgEl('text',{x:x,y:ty,'text-anchor':anc,'class':'m'}); t1.textContent=r[2];
        var t2=svgEl('text',{x:x,y:ty+17,'text-anchor':anc}); t2.textContent=r[1];
        if(r[0]===572){ t1.setAttribute('y',y-(estreito?62:46)); t2.setAttribute('y',y-(estreito?38:29)); }
        if(estreito){ t2.setAttribute('y', parseFloat(t1.getAttribute('y'))+24); }
        g.appendChild(t1); g.appendChild(t2); s.appendChild(g); return {g:g,k:r[0]};
      });
      var carro=svgEl('g',{}); var bola=svgEl('circle',{r:9,fill:'#E4322B',stroke:'#FFF8E7','stroke-width':3}); carro.appendChild(bola); s.appendChild(carro);
      box.appendChild(s);
      var L=linha.getTotalLength();
      var animar=function(){
        if(calmo){ linha.style.strokeDasharray=''; rots.forEach(function(r){r.g.classList.add('mo-on');}); var pf=linha.getPointAtLength(L); bola.setAttribute('cx',pf.x); bola.setAttribute('cy',pf.y); box.classList.add('mo-on'); return; }
        box.classList.add('mo-on');
        var t0=performance.now(), dur=3400;
        (function passo(t){
          var p=Math.min(1,(t-t0)/dur), e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2, len=L*e;
          linha.style.strokeDasharray=len+' '+L;
          var pt=linha.getPointAtLength(len); bola.setAttribute('cx',pt.x); bola.setAttribute('cy',pt.y);
          rots.forEach(function(r){ if(X(r.k)<=pt.x+2) r.g.classList.add('mo-on'); });
          if(p<1) requestAnimationFrame(passo);
        })(t0);
      };
      linha.style.strokeDasharray='0 '+L;
      quandoVisivel(box, animar, {threshold:.35});
    });
  } catch(e){}

  /* 8. fogos no cartão do Réveillon */
  try {
    if(!calmo) document.querySelectorAll('.pe-rev,.rev').forEach(function(card){
      var cv=document.createElement('canvas'); cv.className='mo-fogos'; card.insertBefore(cv, card.firstChild);
      var cx=cv.getContext('2d'), parts=[], rodando=false, ult=0, dpr=Math.min(2,window.devicePixelRatio||1);
      var CORES=['#FFCB05','#FFF8E7','#E4322B','#FFE680','#9BE3B4'];
      function tam(){ cv.width=card.clientWidth*dpr; cv.height=card.clientHeight*dpr; }
      function estoura(){
        var x=(0.45+Math.random()*0.5)*cv.width, y=(0.08+Math.random()*0.35)*cv.height, c=CORES[Math.floor(Math.random()*CORES.length)], n=34;
        for(var i=0;i<n;i++){ var a=Math.PI*2*i/n, v=(1.4+Math.random()*1.6)*dpr; parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,v:1,c:c}); }
      }
      function quadro(t){
        if(!rodando) return;
        if(t-ult>1300){ estoura(); ult=t; }
        cx.globalCompositeOperation='destination-out'; cx.fillStyle='rgba(0,0,0,.22)'; cx.fillRect(0,0,cv.width,cv.height);
        cx.globalCompositeOperation='lighter';
        parts=parts.filter(function(p){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.035*dpr; p.vx*=0.985; p.vy*=0.985; p.v-=0.012;
          if(p.v<=0) return false; cx.globalAlpha=p.v*0.9; cx.fillStyle=p.c; cx.beginPath(); cx.arc(p.x,p.y,1.8*dpr,0,7); cx.fill(); return true; });
        cx.globalAlpha=1; requestAnimationFrame(quadro);
      }
      tam(); window.addEventListener('resize', tam);
      if('IntersectionObserver' in window){
        new IntersectionObserver(function(es){ es.forEach(function(e){ var vis=e.isIntersecting; if(vis && !rodando){ rodando=true; requestAnimationFrame(quadro); } else if(!vis){ rodando=false; } }); }, {threshold:.15}).observe(card);
      }
    });
  } catch(e){}

  /* 9. montanhas em camadas no topo do /peru, com leve parallax */
  try {
    var hero = document.querySelector('header.hero');
    if(hero && !hero.querySelector('.mo-montanhas')){
      var m=document.createElement('div'); m.className='mo-montanhas'; m.setAttribute('aria-hidden','true');
      m.innerHTML=
        '<svg viewBox="0 0 1200 120" preserveAspectRatio="none" data-v=".18"><path d="M0 120 L0 70 L120 40 L210 75 L330 22 L430 70 L560 30 L690 78 L820 18 L930 64 L1060 34 L1200 66 L1200 120Z" fill="#0B8A3D" opacity=".55"/></svg>'+
        '<svg viewBox="0 0 1200 120" preserveAspectRatio="none" data-v=".08"><path d="M0 120 L0 92 L150 62 L260 92 L400 56 L520 94 L650 60 L780 96 L900 58 L1030 90 L1200 70 L1200 120Z" fill="#0A5F2C"/></svg>'+
        '<svg viewBox="0 0 1200 120" preserveAspectRatio="none" data-v="0"><path d="M0 120 L0 108 Q300 92 600 106 T1200 100 L1200 120Z" fill="#FFCB05"/></svg>';
      hero.appendChild(m);
      var wrap=hero.querySelector('.wrap'); if(wrap){ wrap.style.position='relative'; wrap.style.zIndex='1'; wrap.style.paddingBottom='96px'; }
      if(!calmo){
        var camadas=m.querySelectorAll('svg'), pend=false;
        window.addEventListener('scroll', function(){ if(pend) return; pend=true; requestAnimationFrame(function(){ var y=window.scrollY; if(y<900) camadas.forEach(function(c){ c.style.transform='translate3d(0,'+(y*parseFloat(c.getAttribute('data-v'))).toFixed(1)+'px,0)'; }); pend=false; }); }, {passive:true});
      }
    }
  } catch(e){}
})();
