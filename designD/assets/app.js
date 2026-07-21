
// hero slider
(function(){
  const sls=document.querySelectorAll('.hero .sl');
  if(!sls.length)return;
  const dots=document.querySelectorAll('.hero .dots button');
  const cps=document.querySelectorAll('[data-copy]');
  let i=0,t;
  function go(n){
    sls[i].classList.remove('on');dots[i]&&dots[i].classList.remove('on');
    i=(n+sls.length)%sls.length;
    sls[i].classList.add('on');dots[i]&&dots[i].classList.add('on');
    cps.forEach((c,k)=>{c.style.display=k===i?'':'none';});
  }
  dots.forEach((d,k)=>d.addEventListener('click',()=>{go(k);clearInterval(t);t=setInterval(()=>go(i+1),6000);}));
  t=setInterval(()=>go(i+1),6000);
})();
// tabs
document.querySelectorAll('.tabs').forEach(tb=>{
  const bts=tb.querySelectorAll('button');
  bts.forEach(b=>b.addEventListener('click',()=>{
    bts.forEach(x=>x.classList.remove('on'));b.classList.add('on');
    const f=b.dataset.f;
    document.querySelectorAll('.nlist a').forEach(r=>{
      r.style.display=(f==='all'||r.dataset.c===f)?'':'none';
    });
  }));
});
// mobile nav
(function(){
  const b=document.querySelector('.menu-btn'),m=document.querySelector('.mnav');
  if(!b||!m)return;
  b.addEventListener('click',()=>m.classList.add('open'));
  m.querySelector('.x').addEventListener('click',()=>m.classList.remove('open'));
})();
// scroll fx
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.fx').forEach(el=>io.observe(el));
// countup
const io2=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;io2.unobserve(e.target);
  const el=e.target,n=parseFloat(el.dataset.n),dur=1400,st=performance.now();
  (function f(now){const p=Math.min((now-st)/dur,1),v=n*(1-Math.pow(1-p,3));
   el.textContent=String(Math.round(v));
   if(p<1)requestAnimationFrame(f);})(st);
}),{threshold:.5});
document.querySelectorAll('[data-n]').forEach(el=>io2.observe(el));

// promo carousel（カード型・無限ループ・中央寄せトラック）
(function(){
  var p=document.querySelector('.promo'); if(!p) return;
  var vp=p.querySelector('.promo-vp'), track=p.querySelector('.ptrack');
  var reals=[].slice.call(track.children);
  var N=reals.length; if(!N) return;
  var dots=p.querySelectorAll('.promo-dots button');
  var CL=Math.min(2,N), t, animating=false;
  // 両端にクローンを差し込み無限ループ化
  for(var k=0;k<CL;k++){ track.insertBefore(reals[N-CL+k].cloneNode(true), track.children[k]); }
  for(var k=0;k<CL;k++){ track.appendChild(reals[k].cloneNode(true)); }
  var cards=[].slice.call(track.children);
  var pos=CL;
  function move(animate){
    track.style.transition = animate ? '' : 'none';
    var c=cards[pos];
    var x=Math.round(vp.offsetWidth/2 - (c.offsetLeft + c.offsetWidth/2));
    track.style.transform='translateX('+x+'px)';
    cards.forEach(function(cc,k){ cc.classList.toggle('on',k===pos); });
    var real=((pos-CL)%N+N)%N;
    dots.forEach(function(d,k){ d.classList.toggle('on',k===real); });
    if(!animate){ track.offsetHeight; }
  }
  track.addEventListener('transitionend',function(e){
    if(e.propertyName!=='transform') return;
    if(pos<CL){ pos+=N; move(false); } else if(pos>=CL+N){ pos-=N; move(false); }
    animating=false;
  });
  function go(delta){ if(animating) return; animating=true; pos+=delta; move(true); }
  function toReal(r){ var target=CL+(((r%N)+N)%N); if(target!==pos) go(target-pos); }
  dots.forEach(function(d,k){ d.addEventListener('click',function(e){e.preventDefault();toReal(k);reset();}); });
  var pv=p.querySelector('.promo-ar.prev'), nx=p.querySelector('.promo-ar.next');
  if(pv)pv.addEventListener('click',function(e){e.preventDefault();go(-1);reset();});
  if(nx)nx.addEventListener('click',function(e){e.preventDefault();go(1);reset();});
  cards.forEach(function(cc){ cc.addEventListener('click',function(e){ if(cc!==cards[pos]){ e.preventDefault(); go(cards.indexOf(cc)-pos); reset(); } }); });
  function reset(){ clearInterval(t); t=setInterval(function(){go(1);},5500); }
  window.addEventListener('resize',function(){ move(false); });
  move(false); reset();
  window.addEventListener('load',function(){ move(false); });
})();
// ---- demo forms (入力→確認→完了・送信はしない) ----
(function(){
  function labelText(fl){ var l=fl.querySelector('label'); if(!l) return fl.dataset.label||''; var c=l.cloneNode(true); c.querySelectorAll('.req,.opt').forEach(function(x){x.remove();}); return (c.textContent||'').trim(); }
  function fieldValue(fl){
    var sel=fl.querySelector('select'); if(sel) return sel.value ? sel.options[sel.selectedIndex].text : '';
    var rc=fl.querySelectorAll('input[type=radio],input[type=checkbox]');
    if(rc.length){ var vs=[]; rc.forEach(function(i){ if(i.checked){ var lb=i.closest('label'); vs.push(lb?lb.textContent.trim():i.value); } }); return vs.join('、'); }
    var ta=fl.querySelector('textarea'); if(ta) return ta.value.trim();
    var inp=fl.querySelector('input'); if(inp) return inp.value.trim();
    return '';
  }
  function isReq(fl){ return fl.dataset.req!=null; }
  var reEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll('form.dform').forEach(function(f){
    var vIn=f.querySelector('.dform-input'), vCf=f.querySelector('.dform-confirm'), vDn=f.querySelector('.dform-done');
    var ind=f.querySelectorAll('.steps-ind div');
    function step(n){ ind.forEach(function(d,i){ d.classList.toggle('on',i===n); d.classList.toggle('done',i<n); }); }
    function top(){ try{ f.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){} }
    // ラジオ/チェックの選択見た目
    f.querySelectorAll('.radios,.checks').forEach(function(g){ g.addEventListener('change',function(){ g.querySelectorAll('label').forEach(function(lb){ lb.classList.toggle('sel', !!lb.querySelector('input:checked')); }); }); });
    var bC=f.querySelector('[data-act=confirm]'); if(bC) bC.addEventListener('click',function(){
      var ok=true, first=null;
      f.querySelectorAll('.field').forEach(function(fl){
        fl.classList.remove('err'); var em=fl.querySelector('.emsg');
        var val=fieldValue(fl);
        if(isReq(fl) && !val){ fl.classList.add('err'); if(em&&!em.dataset.k) em.textContent='入力してください'; ok=false; first=first||fl; return; }
        var mail=fl.querySelector('input[type=email]');
        if(mail && mail.value.trim() && !reEmail.test(mail.value.trim())){ fl.classList.add('err'); if(em) em.textContent='メールアドレスの形式をご確認ください'; ok=false; first=first||fl; return; }
      });
      if(!ok){ if(first) first.scrollIntoView({behavior:'smooth',block:'center'}); return; }
      var cl=f.querySelector('.confirm-list'); cl.innerHTML='';
      f.querySelectorAll('.field').forEach(function(fl){
        var k=labelText(fl), v=fieldValue(fl);
        var row=document.createElement('div'); row.className='crow';
        row.innerHTML='<span class="k"></span><span class="v'+(v?'':' empty')+'"></span>';
        row.querySelector('.k').textContent=k; row.querySelector('.v').textContent=v||'（未入力）';
        cl.appendChild(row);
      });
      vIn.style.display='none'; vCf.style.display=''; vDn.style.display='none'; step(1); top();
    });
    var bB=f.querySelector('[data-act=back]'); if(bB) bB.addEventListener('click',function(){ vIn.style.display=''; vCf.style.display='none'; step(0); top(); });
    var bS=f.querySelector('[data-act=submit]'); if(bS) bS.addEventListener('click',function(){ vCf.style.display='none'; vDn.style.display=''; step(2); top(); });
  });
})();
// soon page name
(function(){
  const el=document.getElementById('soon-name');
  if(el&&location.hash)el.textContent=decodeURIComponent(location.hash.slice(1));
})();
