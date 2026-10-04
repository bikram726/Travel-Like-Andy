() => {
  const rgba = value => {
    const n = value.match(/[\d.]+/g);
    return n ? [Number(n[0]),Number(n[1]),Number(n[2]),n[3] === undefined ? 1 : Number(n[3])] : [0,0,0,0];
  };
  const mix = (front, back) => front.slice(0,3).map((n,i) => n*front[3]+back[i]*(1-front[3]));
  const lum = color => color.map(n => n/255).map(n => n <= .04045 ? n/12.92 : ((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
  const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const lowContrast = [];
  const root = document.documentElement;
  const scope = document.querySelector('[class^="tla-"][class$="-wrap"]');
  for (const el of document.querySelectorAll('p,label,a,button,h1,h2,h3,figcaption,[class*="eyebrow"],[class*="fact-value"],[class*="fact-label"]')) {
    if (!(scope?.contains(el) || el.closest('.tla-footer'))) continue;
    const style = getComputedStyle(el), r = el.getBoundingClientRect();
    if (!r.width || !r.height || style.visibility === 'hidden') continue;
    if (!el.textContent.trim()) continue;
    const chain = [];
    for (let parent=el; parent; parent=parent.parentElement) chain.unshift(parent);
    let bg=[255,255,255], opacity=1, hasImage=false;
    for (const parent of chain) {
      const s=getComputedStyle(parent);
      bg=mix(rgba(s.backgroundColor),bg);
      opacity*=Number(s.opacity);
      if (s.backgroundImage !== 'none') hasImage=true;
    }
    if (hasImage || el.closest('.tlah-card')) continue; // Home cards use a sibling image/overlay; inspect them visually. Audit intended reveal colors before animations finish.
    const contrast=ratio(mix(rgba(style.color),bg),bg);
    const large=Number.parseFloat(style.fontSize)>=24 || (Number.parseFloat(style.fontSize)>=18.667&&Number(style.fontWeight)>=700);
    if (contrast < (large?3:4.5)) lowContrast.push({text:el.textContent.trim().slice(0,65),contrast:Number(contrast.toFixed(2)),color:style.color,bg,font:style.fontSize});
  }
  const h1=document.querySelector('h1'), header=document.querySelector('header');
  return {
    width:innerWidth,client:root.clientWidth,scroll:root.scrollWidth,overflow:root.scrollWidth-root.clientWidth,
    viewportVariable:getComputedStyle(root).getPropertyValue('--tla-viewport-width'),
    h1Top:h1?Math.round(h1.getBoundingClientRect().top+scrollY):null,
    headerHeight:header?Math.round(header.getBoundingClientRect().height):null,
    h1Count:document.querySelectorAll('h1').length,
    pending:document.body.innerText.includes('REGISTRATION PENDING'),
    lowContrast,
    fields:[...document.querySelectorAll('form input:not([type="hidden"]):not([type="checkbox"]),form select,form textarea')].filter(e=>!e.closest('.h-captcha')).map(e=>({id:e.id,font:getComputedStyle(e).fontSize,height:Math.round(e.getBoundingClientRect().height)})),
    buttons:[...document.querySelectorAll('[class*="-btn"]')].filter(e=>scope?.contains(e)).map(e=>({text:e.textContent.trim(),height:Math.round(e.getBoundingClientRect().height),width:Math.round(e.getBoundingClientRect().width)})),
    unloadedImages:[...document.images].filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.alt)
  };
}
