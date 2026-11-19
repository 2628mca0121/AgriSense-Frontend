/* AgriSense static edition: HTML + CSS + vanilla JavaScript; no backend / frameworks / build step. */
(() => {
'use strict';
const {CROPS, MANDIS, LOCATIONS, STATES, DEMO_MANDI} = window.AGRI_DATA;
const translations = window.AGRI_TRANSLATIONS;
const $ = (s) => document.querySelector(s);
const txt = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const n = (x) => {const y = Number(x); return Number.isFinite(y) && y > 0 ? y : 0};
const rupees = (v) => '₹' + Math.round(Number(v)||0).toLocaleString('en-IN');
const numstr = (v) => Math.round(Number(v)||0).toLocaleString('en-IN');
const getStore = (key, fallback) => {try {const s=localStorage.getItem(key);return s===null?fallback:JSON.parse(s)} catch{return fallback}};
const putStore = (key, value) => {try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
const cropById = id => CROPS.find(c => c.id === id);
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const NAV = [['home','🏠','nav_home'],['compare','⚖️','nav_compare'],['mandi','₹','nav_mandi'],['weather','🌤️','nav_weather'],['plan','📋','nav_plan']];
const EXTRA = {
  hi: {farmDesk:'आपकी खेती · आपकी योजना',frontend:'केवल फ्रंटएंड · सर्वर नहीं',heroOver:'आपके खेत के लिए स्मार्ट जानकारी',heroFoot:'मौसम लाइव है (इंटरनेट पर), मंडी भाव सिर्फ उदाहरण हैं।',exploreTools:'आप क्या करना चाहेंगे?',demoNotice:'महत्वपूर्ण: मंडी के सभी भाव सिर्फ उदाहरण (Demo) हैं। ये आज के सरकारी या लाइव रेट नहीं हैं। खरीद/बिक्री का फैसला इन पर न करें।',browserStore:'योजनाएं केवल इसी ब्राउज़र में सेव होंगी। ब्राउज़र डेटा साफ़ करने पर मिट सकती हैं।',weatherWait:'लाइव मौसम लोड हो रहा है…',weatherFail:'लाइव मौसम अभी उपलब्ध नहीं है। इंटरनेट जाँचें और फिर से कोशिश करें। कोई नकली पूर्वानुमान नहीं दिखाया गया है।',refresh:'रीफ़्रेश',next:'आगे देखें',summary:'संक्षिप्त विवरण',availableSamples:'उपलब्ध उदाहरण भाव',samplePrice:'उदाहरण औसत भाव',allMandis:'सभी मंडियां',sampleRegion:'नमूना डेटा में 22 राज्य/केंद्र शासित प्रदेश और 38 मंडियाँ हैं; ये भारत की सभी मंडियां नहीं हैं।',noSamples:'चुने गए फिल्टर पर उदाहरण भाव नहीं मिला। दूसरा राज्य या फसल चुनें।',noCropSamples:'इस राज्य में इस फसल का उदाहरण भाव नहीं है। अपना अनुमानित बिक्री भाव भरें।',chartRevenue:'फसल अनुसार तुलना',typePrice:'अपना भाव दर्ज करें',understand:'मुनाफ़ा = उपज × बिक्री भाव − खर्च। ये अनुमान हैं, भविष्यवाणी नहीं।',switchState:'दूसरा राज्य',demoTrend:'सिंथेटिक 30-दिन का ट्रेंड — वास्तविक पुराना डेटा नहीं',demoChart:'ग्राफ केवल उदाहरण आंकड़ों से बना है',localOnly:'लोकल स्टोरेज',chooseMandi:'मंडी चुनें',noMandi:'चुने गए स्थान पर कोई रिकॉर्ड नहीं मिला',searchMandi:'मंडी का नाम खोजें',priceData:'मंडी भाव का उदाहरण',sourceExplain:'स्रोत: AgriSense में शामिल बनावटी उदाहरण रिकॉर्ड (सरकारी डेटा नहीं)',seeWeather:'मौसम देखें',chooseLoc:'स्थान चुनें',searchIndia:'भारत के शहर/ज़िले का नाम लिखें',searchResults:'खोज परिणाम',noLocation:'कोई भारतीय स्थान नहीं मिला',searchError:'लोकेशन खोजने में समस्या हुई। इंटरनेट जाँचें।',weatherDetails:'आज का मौसम',feelsNote:'डेटा Open-Meteo से सीधे आपके ब्राउज़र में आता है।',saveSuccess:'योजना ब्राउज़र में सेव हो गई।',saveFailed:'ब्राउज़र में सेव नहीं हो सका (शायद स्टोरेज ब्लॉक है)।',exportPlans:'CSV डाउनलोड',exportEmpty:'डाउनलोड करने के लिए कोई योजना नहीं',requiredValid:'कृपया सही नाम, 0 से बड़ा क्षेत्र और सभी गैर-ऋणात्मक संख्याएं भरें।',planFresh:'नई योजना',listen:'सुनें',stopVoice:'रोकें',personalPrice:'अनुमानित भाव',comparisonInfo:'कम से कम दो फसलें चाहिए। बाकी सभी 39 फसलें उपलब्ध हैं।',records:'रिकॉर्ड',bestMandi:'सबसे अधिक उदाहरण भाव',demoHighlights:'कुछ उदाहरण मंडी भाव',priceNotKnown:'भाव दर्ज नहीं किया गया',selectRow:'मंडी चुनने के लिए पंक्ति पर क्लिक करें',offline:'ऑफ़लाइन भी चलता है (मौसम/स्थान खोज के अलावा)',quitEdit:'बदलाव रद्द',all:'सभी',riskInfo:'जोखिम = उपलब्ध मंडियों के उदाहरण भावों का अंतर, कोई वास्तविक बाजार जोखिम रेटिंग नहीं।',dataDisclaimer:'मंडी/ट्रेंड: डेमो · मौसम: Open-Meteo जब उपलब्ध हो · योजनाएं: ब्राउज़र में',noPriceRec:'कमाई की तुलना के लिए हर फसल का बिक्री भाव भरें।',costTotal:'खर्च (₹; पूरे खेत के लिए)',approx:'लगभग',checkPrice:'लाइव सरकारी भाव इस फ्रंटएंड में उपलब्ध नहीं हैं।',planningTip:'आंकड़े बदलते ही नीचे अनुमान अपने आप बदल जाएगा।'},
  en: {farmDesk:'Your farm · Your plan',frontend:'Frontend only · no server',heroOver:'Smarter insights for your farm',heroFoot:'Weather is live when online; mandi prices are illustrative only.',exploreTools:'Explore your farm tools',demoNotice:'Important: ALL mandi prices are simulated DEMO values, not today’s official or live rates. Do not make trading decisions from them.',browserStore:'Plans are saved only in this browser. Clearing site data can erase them.',weatherWait:'Loading live weather…',weatherFail:'Live weather is unavailable. Check your internet connection and retry. No fake forecast has been displayed.',refresh:'Refresh',next:'See details',summary:'Quick summary',availableSamples:'Available demo prices',samplePrice:'Illustrative average price',allMandis:'All mandis',sampleRegion:'Sample data covers 22 states/UTs and 38 mandis, not every mandi in India.',noSamples:'No illustrative price matches these filters. Try another state or crop.',noCropSamples:'No example price for this crop in this state. Enter your expected selling price.',chartRevenue:'Crop-wise comparison',typePrice:'Enter your own price',understand:'Profit = yield × selling price − cost. Estimates, not forecasts.',switchState:'Change state',demoTrend:'Synthetic 30-day trend — NOT observed historical prices',demoChart:'This chart is based on illustrative data only',localOnly:'Local browser storage',chooseMandi:'Choose mandi',noMandi:'No records match this location',searchMandi:'Search mandi name',priceData:'Illustrative market prices',sourceExplain:'Source: simulated AgriSense example records (not government data)',seeWeather:'Check weather',chooseLoc:'Choose location',searchIndia:'Enter an Indian city or district',searchResults:'Search results',noLocation:'No Indian locations found',searchError:'Location search failed. Check your connection.',weatherDetails:'Current conditions',feelsNote:'Data comes directly from Open-Meteo to your browser.',saveSuccess:'Plan saved in this browser.',saveFailed:'Could not save in your browser (storage may be blocked).',exportPlans:'Export CSV',exportEmpty:'No saved plans to export',requiredValid:'Enter a valid name, area greater than zero, and non-negative amounts.',planFresh:'New plan',listen:'Listen',stopVoice:'Stop',personalPrice:'Expected price',comparisonInfo:'At least two crops are needed. All 39 catalog crops are available.',records:'records',bestMandi:'Highest illustrative price',demoHighlights:'Example mandi prices',priceNotKnown:'No price entered',selectRow:'Click a row to inspect its mandi',offline:'Works offline except weather / location lookup',quitEdit:'Cancel editing',all:'All',riskInfo:'Risk uses the spread of the example prices only; it is not a real market-risk rating.',dataDisclaimer:'Mandi/trend: demo · Weather: Open-Meteo when available · Plans: browser-only',noPriceRec:'Enter a selling price for every crop to compare earnings.',costTotal:'Cost (₹; total for entire farm)',approx:'approx.',checkPrice:'Live government rates are not available in this frontend-only edition.',planningTip:'The estimate updates automatically when you change the numbers.'}
};
const t = (key, vars={}) => { let str = (translations[state.lang]||translations.en)[key] ?? (EXTRA[state.lang]||EXTRA.en)[key] ?? translations.en[key] ?? EXTRA.en[key] ?? key; for(const [k,v] of Object.entries(vars))str = str.split('{'+k+'}').join(String(v)); return str;};
const cName = c => c?.[state.lang] || c?.en || '';
const pName = p => p?.[state.lang] || p?.en || p?.name || '';
const headline = (title,sub='',badge='') => `<div class="page-header"><div><h1>${txt(title)}</h1><p>${txt(sub)}</p></div>${badge}</div>`;
const badge = (val,variant='demo') => `<span class="badge ${variant}">${txt(val)}</span>`;
const label = (title, content) => `<label class="field"><span class="label">${txt(title)}</span>${content}</label>`;
const input = (key,value='',type='number') => `<input class="input" name="${txt(key)}" type="${type}" ${type==='number'?'min="0" step="any" inputmode="decimal"':''} value="${txt(value)}" autocomplete="off">`;
const option = (value,name,sel) => `<option value="${txt(value)}"${value===sel?' selected':''}>${txt(name)}</option>`;
const btn = (text,action,kind='ghost',attrs='') => `<button type="button" class="btn ${kind}" data-action="${txt(action)}" ${attrs}>${txt(text)}</button>`;
const id = (x) => document.getElementById(x);
const blankForm = () => ({cropName:'',area:'',seed:'',fertilizer:'',irrigation:'',labour:'',other:'',yieldPerAcre:'',price:''});
const empty = blankForm();
const saved = getStore('agrisense_compared_crops',['wheat','rice','maize']);
const picked = Array.isArray(saved) ? [...new Set(saved.filter(x=>typeof x==='string'&&cropById(x)))]:[];
const langValue = getStore('agrisense_static_lang', 'hi');
const locValue = getStore('agrisense_static_place', LOCATIONS[0]);
const state = {
 lang:['hi','en'].includes(langValue)?langValue:'hi',
 place:locValue&&typeof locValue.lat==='number'&&typeof locValue.lon==='number'?locValue:LOCATIONS[0],
 page:'home', picked:picked.length>=2?picked:['wheat','rice','maize'],
 compareEdits:getStore('agrisense_compare_edits',{}), compareSearch:'',
 mandiCrop:'wheat', mandiState:'',mandiDistrict:'',mandiMarket:'',mandiQuery:'',selectedMandi:'',
 geoQuery:'',geoResults:[],geoStatus:'',geoLoading:false,
 weather:null,weatherStatus:'idle',weatherPlace:'',
 plans:getStore('agrisense_plans',[]), form:blankForm(), planMessage:'',
 editId:'',toastHandle:null
};
if(!Array.isArray(state.plans)) state.plans=[];
state.mandiState=''; // Show available sample records on first visit; filters are user-controlled.
const stateNames = Object.values(STATES).sort((a,b)=>a.localeCompare(b));
const routePage = () => {const hash=location.hash.slice(1).replace(/^\//,'').split(/[?&]/)[0];return NAV.some(x=>x[0]===hash)?hash:'home'};
const navLink = ([key,icon,k], mobile=false) => `<a class="nav-link ${state.page===key?'active':''}" href="#${key}" aria-current="${state.page===key?'page':'false'}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${txt(t(k))}</span></a>`;
function renderShell() {
 document.documentElement.lang=state.lang;
 document.title = `${t('nav_'+state.page)} · AgriSense`;
 id('brandTagline').textContent=t('tagline');id('navHeading').textContent=t('farmDesk');
 id('sideFootTitle').textContent=state.lang==='hi'?'बेहतर खेती, बेहतर फैसले':'Smarter decisions.';
 id('sideFootText').textContent=state.lang==='hi'?'हर फसल, हर योजना के लिए।':'Made for your fields, crop by crop.';
 id('sideCaption').textContent=t('frontend');
 id('sideNav').innerHTML=NAV.map(e=>navLink(e)).join('');
 id('bottomNav').innerHTML=NAV.map(e=>navLink(e,true)).join('');
 id('topTitle').textContent=t('nav_'+state.page);
 id('topEyebrow').textContent=t('farmDesk');
 const locs=LOCATIONS.some(p=>p.id===state.place.id)?LOCATIONS:[state.place,...LOCATIONS];
 id('locationTop').innerHTML=`<span aria-hidden="true">📍</span><select id="globalLocation" aria-label="${txt(t('location'))}">${locs.map(p=>option(p.id,pName(p),state.place.id)).join('')}</select>`;
 document.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===state.lang);b.setAttribute('aria-pressed',String(b.dataset.lang===state.lang))});
 id('footerNote').textContent=t('dataDisclaimer');
}
function render(){state.page=routePage();renderShell();const views={home:renderHome,compare:renderCompare,mandi:renderMandi,weather:renderWeather,plan:renderPlan};id('view').innerHTML=views[state.page]();if(state.page==='weather'||state.page==='home')ensureWeather();}
function toast(message){const el=id('toast');el.textContent=message;el.classList.add('visible');clearTimeout(state.toastHandle);state.toastHandle=setTimeout(()=>el.classList.remove('visible'),3300)}
function speak(text) {
 if(!('speechSynthesis' in window)){toast(t('voiceUnsupported'));return}
 if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();return}
 const u=new SpeechSynthesisUtterance(text);u.lang=state.lang==='hi'?'hi-IN':'en-IN';u.rate=.9;window.speechSynthesis.speak(u);
}
const localSamples = (crop, region) => DEMO_MANDI.filter(r=>r.crop===crop && (!region || r.state===region));
const visibleSamples = (crop, region) => {const local=localSamples(crop,region);return {rows:local.length?local:localSamples(crop,''),nationalFallback:!!region&&!local.length};};
function avg(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}
function risk(rows){if(rows.length<2)return {key:'unknown',pct:null};const prices=rows.map(r=>r.modal);const pct=(Math.max(...prices)-Math.min(...prices))*100/avg(prices);return {key:pct<7?'low':pct<12?'medium':'high',pct:Math.round(pct*10)/10};}
function riskBadge(r) {let variant=r.key==='high'?'warning':r.key==='unknown'?'soft':'live';return badge(`${t('riskLabel')}: ${t(r.key)}${r.pct!==null?' · '+r.pct+'%':''}`,variant)}
const cardHeader = (title,action='') => `<div class="card-header"><h2>${txt(title)}</h2>${action}</div>`;
function metrics(items){return items.map(([a,b,kind])=>`<div class="metric"><div class="metric-name">${txt(a)}</div><div class="metric-num num ${kind||''}">${txt(b)}</div></div>`).join('')}
function shortcuts(){const cfg=[['mandi','🌾','amber','ov_mandi','priceData'],['compare','⚖️','green','ov_compare','ov_compare_d'],['weather','☀️','blue','ov_weather','wxSub'],['plan','📋','purple','ov_plan','planSub']];return cfg.map(([page,ico,color,k,sub])=>`<a class="shortcut ${color}" href="#${page}"><div class="shortcut-icon">${ico}</div><div><h3>${txt(t(k))} <span aria-hidden="true">↗</span></h3><p>${txt(t(sub))}</p></div></a>`).join('')}
function renderHome(){
 const sampleCrops=['wheat','rice','maize','mustard','soybean'];
 const rows=sampleCrops.map(cid=>{const m=visibleSamples(cid,state.place.state);return {c:cropById(cid),records:m.rows,nationalFallback:m.nationalFallback}}).filter(x=>x.records.length);
 const temp=state.weatherStatus==='ok'?`${Math.round(state.weather.current.temp)}°C`:state.weatherStatus==='loading'?t('loading'):'—';
 const weatherDescription=state.weatherStatus==='ok'?`${t(wxType(state.weather.current.code).key)} · ${pName(state.place)}`:state.weatherStatus==='error'?t('weatherFail'):t('weatherWait');
 const highest=rows.length?[...rows].sort((a,b)=>avg(b.records.map(x=>x.modal))-avg(a.records.map(x=>x.modal)))[0]:null;
 return `<div class="stack">
  <section class="hero"><div class="hero-copy"><div class="eyebrow">✦ ${txt(t('heroOver'))}</div><h1>${txt(t('welcome'))} 🌱</h1><p>${txt(t('welcomeSub'))}</p><div class="hero-cta"><a class="btn light" href="#compare">${txt(t('nav_compare'))} →</a><a class="btn outline-light" href="#plan">${txt(t('goPlan'))}</a></div></div><div class="hero-art" aria-hidden="true"><div class="farm-visual"><div class="sun"></div><div class="hills"></div><div class="plants">🌾</div></div></div></section>
  <div class="alert">⚠️ ${txt(t('demoNotice'))}</div>
  <section><div class="section-heading"><h2>${txt(t('exploreTools'))}</h2><span class="badge soft">${txt(t('offline'))}</span></div><div class="grid4">${shortcuts()}</div></section>
  <div class="grid2"><section class="card">${cardHeader(t('demoHighlights'),badge(t('demoData')))}${rows.length?`<div class="row-list">${rows.map(x=>`<div class="list-item"><div class="crop-icon">${x.c.emoji}</div><div class="grow"><b>${txt(cName(x.c))}</b><div class="fine">${txt(x.nationalFallback ? t('allStates')+' (Demo)' : (state.place.state||t('allStates')))} · ${x.records.length} ${txt(t('records'))}</div></div><div class="amount num">${rupees(avg(x.records.map(q=>q.modal)))}</div></div>`).join('')}</div>`:`<div class="empty-state">${txt(t('noSamples'))}</div>`}<div class="inner-spacer">${btn(t('viewAll')+' →','open-mandi')}</div></section>
  <section class="card">${cardHeader(t('weatherSummary'),state.weatherStatus==='ok'?badge(t('liveData'),'live'):'')}<div class="weather-hero"><div><span class="eyebrow">📍 ${txt(pName(state.place))}</span><div class="temp num">${txt(temp)}</div><div class="muted small">${txt(weatherDescription)}</div></div><div class="temp-icon" aria-hidden="true">${state.weatherStatus==='ok'?wxType(state.weather.current.code).emoji:'🌤️'}</div></div><div class="inner-spacer">${btn(t('seeWeather')+' →','open-weather')}</div></section></div>
  <section class="advice-card"><div class="line-between"><h2>💡 ${txt(t('insightTitle'))}</h2>${badge(t('demoData'))}</div><p>${highest?txt(t('insightHigh',{crop:cName(highest.c),price:numstr(avg(highest.records.map(q=>q.modal)))})):txt(t('noSamples'))}</p><p class="small muted">${txt(t('insightNote'))} ${txt(t('heroFoot'))}</p></section>
 </div>`;
}
function comparisonRows() {
 return state.picked.map(cid=>{
  const c=cropById(cid);if(!c)return null;
  const selection=visibleSamples(cid,state.place.state);const samples=selection.rows;
  const priceAvg=Math.round(avg(samples.map(s=>s.modal)));
  const e=state.compareEdits[cid]||{};
  const y=own(e,'yield')?e.yield:c.yield;
  const price=own(e,'price')?e.price:priceAvg||'';
  const cost=own(e,'cost')?e.cost:c.cost;
  const revenue=n(y)*n(price);
  return {c,samples,nationalFallback:selection.nationalFallback,avg:priceAvg,y,price,cost,revenue,profit:revenue-n(cost),risk:risk(samples)};
 }).filter(Boolean);
}
function optionsForCompare() {
 const q=state.compareSearch.trim().toLocaleLowerCase();
 const remaining=CROPS.filter(c=>!state.picked.includes(c.id)&&(c.hi+' '+c.en+' '+c.group).toLocaleLowerCase().includes(q));
 return option('',remaining.length?t('addCrop'):t('noCropMatch'),'')+remaining.map(c=>option(c.id,c.emoji+' '+cName(c),'')).join('');
}
function barChart(rows) {
 if(!rows.length)return `<div class="empty-state">${txt(t('noData'))}</div>`;
 const max=Math.max(1,...rows.flatMap(r=>[r.revenue,n(r.cost),Math.max(0,r.profit)]));
 const bar=(v,type)=>`<div class="bar ${type}" style="height:${Math.max(0,(Math.max(0,v)/max)*100)}%" title="${txt(type+': '+rupees(v))}"></div>`;
 return `<div class="bar-chart" role="img" aria-label="${txt(t('chartTitle'))}">${rows.map(r=>`<div class="bar-col"><div class="bar-group">${bar(r.revenue,'rev')}${bar(n(r.cost),'cost')}${bar(r.profit,'profit')}</div><div class="bar-name">${txt(cName(r.c))}</div><div class="bar-val num">${rupees(r.profit)}</div></div>`).join('')}</div><div class="legend"><span>${txt(t('revenue'))}</span><span>${txt(t('cost'))}</span><span>${txt(t('profit'))}</span></div>`;
}
function getRecommendation(rows) {
 if(rows.length<2||rows.some(r=>!n(r.price)||!n(r.y))) return {text:t('noPriceRec'),explanation:[]};
 const sorted=[...rows].sort((a,b)=>b.profit-a.profit), top=sorted[0];
 let recommendation=t('rec_top',{crop:cName(top.c),profit:numstr(top.profit)});
 if(top.profit<=0) recommendation=t('rec_loss');
 else if(top.risk.key==='high') {
  const alt=sorted.slice(1).find(r=>!['unknown','high'].includes(r.risk.key)&&r.profit>0&&r.profit>=top.profit*.9);
  if(alt) recommendation=t('rec_risk',{crop:cName(top.c),alt:cName(alt.c)});
 }
 const explanation=rows.map(r=>t('explainLine',{crop:cName(r.c),rev:numstr(r.revenue),cost:numstr(n(r.cost)),profit:numstr(r.profit),risk:t(r.risk.key)}));
 return {text:recommendation,explanation};
}
function renderCompare() {
 const rows=comparisonRows();const rec=getRecommendation(rows);
 return `<div class="stack">
 ${headline(t('cmp_title'),t('cmp_sub'),badge(t('demoData')))}
 <div class="alert">⚠️ ${txt(t('demoNotice'))}</div>
 <section class="card"><div class="line-between"><h2>${txt(t('pickCrops'))}</h2>${badge(t('selectedCount',{count:state.picked.length,total:CROPS.length}),'soft')}</div><p class="muted small">${txt(t('comparisonInfo'))}</p><div class="selected-chips">${state.picked.map(cid=>{const c=cropById(cid);return `<button type="button" class="chip" data-action="remove-crop" data-crop="${txt(cid)}" ${state.picked.length<=2?'disabled':''} aria-label="${txt(t('removeCrop')+': '+cName(c))}">${c.emoji} ${txt(cName(c))}<span class="x" aria-hidden="true">×</span></button>`}).join('')}</div><div class="grid2">${label(t('searchCrop'),`<input class="input" id="compareSearch" type="search" value="${txt(state.compareSearch)}" placeholder="${txt(t('searchCrop'))}">`)}${label(t('addCrop'),`<select id="cropAddSelect" class="input" ${state.picked.length===CROPS.length?'disabled':''}>${optionsForCompare()}</select>`)}</div><p class="fine inner-spacer">${txt(t('demoAssump'))}</p></section>
 <section class="compare-cards">${rows.map(r=>`<article class="card"><div class="crop-card-head"><div class="crop-title"><span class="crop-big">${r.c.emoji}</span><span>${txt(cName(r.c))}</span></div>${riskBadge(r.risk)}</div><p class="small muted">${txt(r.nationalFallback?t('allStates')+' · '+t('samplePrice'):t('samplePrice'))}: <strong class="num">${r.avg?rupees(r.avg):t('na')}</strong> / ${txt(t('quintals'))}</p>${!r.samples.length?`<p class="alert small">${txt(t('noCropSamples'))}</p>`:''}<div class="form3 inner-spacer">${label(t('yieldQ'),`<input type="number" min="0" step="any" class="input" data-comp-key="yield" data-crop="${txt(r.c.id)}" value="${txt(r.y)}">`)}${label(t('priceQ'),`<input type="number" min="0" step="any" class="input" data-comp-key="price" data-crop="${txt(r.c.id)}" placeholder="${txt(t('typePrice'))}" value="${txt(r.price)}">`)}${label(t('costAcre'),`<input type="number" min="0" step="any" class="input" data-comp-key="cost" data-crop="${txt(r.c.id)}" value="${txt(r.cost)}">`)}</div><div class="stats-list"><div class="stat-line"><span class="muted">${txt(t('revAcre'))}</span><b>${rupees(r.revenue)}</b></div><div class="stat-line"><span class="muted">${txt(t('profitAcre'))}</span><b class="${r.profit>=0?'positive':'negative'}">${rupees(r.profit)}</b></div></div></article>`).join('')}</section>
 <section class="card">${cardHeader(t('chartTitle'))}${barChart(rows)}<p class="fine">${txt(t('riskInfo'))} ${txt(t('demoChart'))}</p></section>
 <section class="advice-card"><div class="line-between"><h2>💡 ${txt(t('whichCrop'))}</h2>${btn(t('listen'),'speak-rec','small')}</div><p id="recommendationText">${txt(rec.text)}</p><div class="mini-line"></div><h3>${txt(t('explainTitle'))}</h3><div class="small">${rec.explanation.map(x=>`<p>• ${txt(x)}</p>`).join('')}</div><p class="fine">${txt(t('rec_how'))}</p></section>
 </div>`;
}
function mandiFilterRows(){const crop=state.mandiCrop,region=state.mandiState,district=state.mandiDistrict,market=state.mandiMarket,query=state.mandiQuery.toLocaleLowerCase().trim();return DEMO_MANDI.filter(r=>r.crop===crop&&(!region||r.state===region)&&(!district||r.district===district)&&(!market||r.mandi===market)&&(!query||(r.mandi+' '+r.district).toLocaleLowerCase().includes(query))).sort((a,b)=>b.modal-a.modal)}
const getDistricts = () => [...new Set(MANDIS.filter(r=>!state.mandiState||r.state===state.mandiState).map(r=>r.district))].sort();
const getMarketOptions = () => MANDIS.filter(r=>(!state.mandiState||r.state===state.mandiState)&&(!state.mandiDistrict||r.district===state.mandiDistrict));
function syntheticTrend(price,market,crop) {const seed=[...market+crop].reduce((x,c)=>x+c.charCodeAt(0),0)%7;return Array.from({length:30},(_,i)=>({day:i+1,value:Math.max(1,Math.round(price*(1+.035*Math.sin((i+seed)/4)+.015*Math.sin((i+seed)/1.7)) /10)*10)}));}
function lineSvg(data){
 if(data.length<2)return '';
 const vals=data.map(x=>x.value), low=Math.min(...vals)*.97,high=Math.max(...vals)*1.03;
 const points=data.map((d,i)=>[45+(i/(data.length-1))*650,20+(1-(d.value-low)/Math.max(1,high-low))*175]);
 const path=points.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 return `<svg class="spark-svg" viewBox="0 0 740 245" role="img" aria-label="${txt(t('demoTrend'))}" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="245" fill="#fff"/><g stroke="#e8eee9">${[40,95,150,205].map(y=>`<line x1="45" x2="700" y1="${y}" y2="${y}"/>`).join('')}</g><g fill="#64776c" font-size="13">${[0,1,2,3].map(i=>`<text x="3" y="${44+i*54}">${txt(numstr(Math.round(high-(high-low)*i/3)))}</text>`).join('')}<text x="45" y="233">1</text><text x="362" y="233">15</text><text x="684" y="233">30</text></g><path d="${path}" fill="none" stroke="#2d9161" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${points[29][0]}" cy="${points[29][1]}" r="5" fill="#186441"/></svg>`;
}
function renderMandi(){
 const districts=getDistricts(),mandis=getMarketOptions(),all=mandiFilterRows(),shown=all.slice(0,60),active=all.find(x=>x.mandi===state.selectedMandi)||all[0];
 const c=cropById(state.mandiCrop);
 const df=label(t('state'),`<select class="input" id="mandiState">${option('',t('allStates'),state.mandiState)}${stateNames.map(x=>option(x,x,state.mandiState)).join('')}</select>`);
 const dist=label(t('district'),`<select class="input" id="mandiDistrict">${option('',t('allDistricts'),state.mandiDistrict)}${districts.map(x=>option(x,x,state.mandiDistrict)).join('')}</select>`);
 const market=label(t('mandi'),`<select class="input" id="mandiMarket">${option('',t('allMandis'),state.mandiMarket)}${mandis.map(m=>option(m.mandi,m.mandi,state.mandiMarket)).join('')}</select>`);
 return `<div class="stack">${headline(t('mandiTitle'),t('mandiSub'),badge(t('demoData')))}<div class="alert">⚠️ ${txt(t('demoNotice'))}<div class="fine" style="color:inherit;margin-top:4px">${txt(t('sampleRegion'))}</div></div><section class="card"><div class="filter-grid">${label(t('pickCrop'),`<select id="mandiCrop" class="input">${CROPS.map(x=>option(x.id,x.emoji+' '+cName(x),state.mandiCrop)).join('')}</select>`)}${df}${dist}${market}</div><div class="inner-spacer grid2">${label(t('searchMandi'),`<input id="mandiQuery" type="search" class="input" placeholder="${txt(t('searchMandi'))}" value="${txt(state.mandiQuery)}">`)}<div class="field"><span class="label">${txt(t('source'))}</span>${badge(t('demoData'))}<p class="fine">${txt(t('sourceExplain'))}</p></div></div></section><div class="grid3">${metrics([[t('availableSamples'),String(all.length)],[t('samplePrice'),all.length?rupees(avg(all.map(r=>r.modal))):'—'],[t('bestMandi'),active?rupees(all[0].modal):'—']])}</div><section class="card">${cardHeader(c.emoji+' '+cName(c)+' · '+t('mandiTitle'),badge(t('demoData')))}${all.length?`<p class="fine">${txt(t('selectRow'))} · ${shown.length}/${all.length} ${txt(t('records'))}</p><div class="table-wrap"><table class="data-table"><thead><tr><th>${txt(t('mandi'))}</th><th>${txt(t('district'))}</th><th>${txt(t('state'))}</th><th>${txt(t('min'))}</th><th>${txt(t('max'))}</th><th>${txt(t('modal'))}</th><th>${txt(t('source'))}</th></tr></thead><tbody>${shown.map(r=>`<tr tabindex="0" data-mandi-row="${txt(r.mandi)}" class="${active?.mandi===r.mandi?'selected':''}"><td><b>${txt(r.mandi)}</b></td><td>${txt(r.district)}</td><td>${txt(r.state)}</td><td class="num">${rupees(r.min)}</td><td class="num">${rupees(r.max)}</td><td class="num"><b>${rupees(r.modal)}</b></td><td>${badge(t('demoData'))}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty-state"><div class="emoji">🌾</div><p>${txt(t('noSamples'))}</p></div>`}</section>
 ${active?`<div class="grid2"><section class="card">${cardHeader(t('compareMandis'))}<div class="cost-bars">${all.slice(0,10).map(r=>`<div class="cost-row"><span title="${txt(r.mandi)}">${txt(r.mandi.length>16?r.mandi.slice(0,15)+'…':r.mandi)}</span><div class="cost-track"><div class="cost-fill" style="width:${Math.max(0,(r.modal/Math.max(1,all[0].modal))*100)}%"></div></div><b class="num">${rupees(r.modal)}</b></div>`).join('')}</div><p class="fine inner-spacer">${txt(t('demoChart'))}</p></section><section class="card">${cardHeader(t('trendTitle'),badge(t('demoData')))}<p class="small muted">${txt(active.mandi)} · ${txt(active.district)}</p>${lineSvg(syntheticTrend(active.modal,active.mandi,c.id))}<div class="alert">${txt(t('demoTrend'))}</div></section></div>`:''}</div>`;
}
function wxType(code){if(code===0)return {key:'wx_clear',emoji:'☀️'};if(code<=3)return {key:'wx_cloud',emoji:'⛅'};if(code<=48)return {key:'wx_fog',emoji:'🌫️'};if(code<=57)return {key:'wx_drizzle',emoji:'🌦️'};if(code<=67)return {key:'wx_rain',emoji:'🌧️'};if(code<=77)return {key:'wx_snow',emoji:'❄️'};if(code<=82)return {key:'wx_showers',emoji:'🌦️'};return {key:'wx_storm',emoji:'⛈️'};}
function adviceFor(w){if(!w||!w.days?.length)return [];
 const rain=w.days.reduce((s,d)=>s+(d.rain||0),0),maxR=Math.max(...w.days.map(d=>d.rain||0));const a=[];
 if(rain>=15||maxR>=10)a.push('adv_rain');else if(rain>=2)a.push('adv_lightrain');
 if(Math.max(...w.days.map(d=>d.max))>=38)a.push('adv_heat');
 if(Math.min(...w.days.map(d=>d.min))<=5)a.push('adv_cold');
 if(w.current.wind>=25)a.push('adv_wind');
 return a.length?a:['adv_ok'];}
async function ensureWeather(force=false){
 const key=state.place.lat+'|'+state.place.lon;
 if(!force && state.weatherPlace===key && ['loading','ok','error'].includes(state.weatherStatus))return;
 state.weatherPlace=key;state.weather=null;state.weatherStatus='loading';
 const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(state.place.lat)}&longitude=${encodeURIComponent(state.place.lon)}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=3`;
 try {
  const response=await fetch(url);if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();if(!data.current||!Array.isArray(data.daily?.time))throw new Error('Invalid forecast');
  const w={source:'Open-Meteo',current:{temp:data.current.temperature_2m,humidity:data.current.relative_humidity_2m,wind:data.current.wind_speed_10m,precip:data.current.precipitation,code:data.current.weather_code},days:data.daily.time.map((date,i)=>({date,max:data.daily.temperature_2m_max[i],min:data.daily.temperature_2m_min[i],rain:data.daily.precipitation_sum[i],prob:data.daily.precipitation_probability_max[i],code:data.daily.weather_code[i]}))};
  if(state.weatherPlace!==key)return;
  state.weather=w;state.weatherStatus='ok';
 } catch {if(state.weatherPlace!==key)return;state.weather=null;state.weatherStatus='error';}
 if(['weather','home'].includes(state.page)) render();
}
function weatherSummary(){const w=state.weather;if(state.weatherStatus==='loading'||state.weatherStatus==='idle')return `<div class="empty-state">⏳ ${txt(t('weatherWait'))}</div>`;
 if(state.weatherStatus==='error')return `<div class="alert">${txt(t('weatherFail'))}<div class="inner-spacer">${btn(t('retry'),'refresh-weather','primary')}</div></div>`;
 if(!w)return '';
 const cur=w.current;
 return `<div class="grid2"><section class="card"><div class="weather-hero"><div><span class="eyebrow">📍 ${txt(pName(state.place))}</span><div class="temp num">${Math.round(cur.temp)}°C</div><p class="muted">${txt(t(wxType(cur.code).key))}</p></div><div class="temp-icon">${wxType(cur.code).emoji}</div></div><div class="inner-spacer grid3">${metrics([[t('humidity'),Math.round(cur.humidity)+'%'],[t('wind'),numstr(cur.wind)+' km/h'],[t('rain'),cur.precip+' mm']])}</div></section><section class="card">${cardHeader(t('forecast3'))}<div class="forecast-days">${w.days.map(d=>`<div class="forecast-day"><div class="small muted">${txt(new Date(d.date+'T12:00:00').toLocaleDateString(state.lang==='hi'?'hi-IN':'en-IN',{weekday:'short',day:'numeric',month:'short'}))}</div><div class="emoji">${wxType(d.code).emoji}</div><b class="num">${Math.round(d.max)}° / ${Math.round(d.min)}°</b><div class="fine">🌧️ ${Math.round(d.prob||0)}%</div></div>`).join('')}</div></section></div><section class="advice-card"><div class="line-between"><h2>🌱 ${txt(t('advisory'))}</h2>${btn(t('listen'),'speak-weather','small')}</div><div class="tip-list inner-spacer">${adviceFor(w).map(k=>`<div class="tip">${txt(t(k))}</div>`).join('')}</div><p class="fine">${txt(t('advisoryNote'))}</p></section>`;
}
function renderWeather(){return `<div class="stack">${headline(t('wxTitle'),t('wxSub'),badge('Open-Meteo · '+(state.weatherStatus==='ok'?t('liveData'):t('loading')),'live'))}<section class="card"><div class="line-between"><h2>📍 ${txt(t('chooseLoc'))}</h2>${btn(t('refresh'),'refresh-weather','small')}</div><div class="grid2 inner-spacer">${label(t('searchPlace'),`<input type="search" class="input" id="geoQuery" autocomplete="off" placeholder="${txt(t('searchIndia'))}" value="${txt(state.geoQuery)}">`)}<div class="field"><span class="label">${txt(t('location'))}</span>${btn(t('search'),'search-location','primary')}</div></div><div id="geoResultBox">${geoBox()}</div><p class="fine inner-spacer">${txt(t('feelsNote'))}</p></section>${weatherSummary()}</div>`}
function geoBox(){if(state.geoLoading)return `<p class="fine">${txt(t('loading'))}</p>`;if(state.geoStatus)return `<p class="fine">${txt(state.geoStatus)}</p>`;return `<div class="search-results">${state.geoResults.map((r,i)=>`<button type="button" data-action="choose-location" data-index="${i}"><span><b>${txt(r.name)}</b><br><span class="fine">${txt(r.admin)}</span></span><span>↗</span></button>`).join('')}</div>`;}
async function searchLocations(){const query=state.geoQuery.trim();if(query.length<2){toast(t('searchIndia'));return}
 state.geoLoading=true;state.geoResults=[];state.geoStatus='';if(id('geoResultBox'))id('geoResultBox').innerHTML=geoBox();
 try {const url=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&countryCode=IN&format=json&language=en`;
 const response=await fetch(url);if(!response.ok)throw Error();const j=await response.json();
 if(state.geoQuery.trim()!==query)return;
 state.geoResults=(j.results||[]).filter(r=>r.country_code==='IN').map(r=>({name:r.name,en:r.name,hi:r.name,id:`geo-${r.id}`,state:r.admin1||'',district:r.admin2||'',admin:[r.admin2,r.admin1,r.country].filter(Boolean).join(', '),lat:r.latitude,lon:r.longitude}));
 if(!state.geoResults.length)state.geoStatus=t('noLocation');
 }catch{state.geoStatus=t('searchError');}
 state.geoLoading=false;if(state.page==='weather'&&id('geoResultBox'))id('geoResultBox').innerHTML=geoBox();
}
const COST_KEYS=['seed','fertilizer','irrigation','labour','other'];
const PLAN_KEYS=['area',...COST_KEYS,'yieldPerAcre','price'];
function calcPlan(f){const cost=COST_KEYS.reduce((s,k)=>s+n(f[k]),0),production=n(f.area)*n(f.yieldPerAcre),revenue=production*n(f.price);return {cost,production,revenue,profit:revenue-cost,breakEven:production>0?cost/production:null};}
function planNumbers(form){const r=calcPlan(form);return metrics([[t('totalCost'),rupees(r.cost)],[t('production'),numstr(r.production)+' '+t('quintals')],[t('revenueEst'),rupees(r.revenue)],[t('profitLoss'),(r.profit<0?'−':'')+rupees(Math.abs(r.profit)),r.profit>=0?'positive':'negative'],[t('breakEven'),r.breakEven===null?'—':rupees(r.breakEven)+' / '+t('quintals')]]);}
function costBars(){const r=calcPlan(state.form);if(!r.cost)return `<div class="empty-state">${rupees(0)}</div>`;return `<div class="cost-bars">${COST_KEYS.map(k=>`<div class="cost-row"><span>${txt(t(k))}</span><div class="cost-track"><div class="cost-fill" style="width:${n(state.form[k])/r.cost*100}%"></div></div><b class="num">${rupees(n(state.form[k]))}</b></div>`).join('')}</div>`;}
function renderPlan(){
 return `<div class="stack">${headline(t('planTitle'),t('planSub'),badge(t('localOnly'),'soft'))}<div class="alert info">💾 ${txt(t('browserStore'))}</div><div class="split-65"><section class="card"><div class="line-between"><h2>🧮 ${txt(state.editId?t('updatePlan'):t('planFresh'))}</h2>${state.editId?btn(t('cancelEdit'),'cancel-edit','small'):''}</div><form id="planForm" class="inner-spacer" autocomplete="off"><div class="grid2">${label(t('cropName'),input('cropName',state.form.cropName,'text'))}${label(t('area'),input('area',state.form.area))}${PLAN_KEYS.filter(k=>k!=='area').map(k=>label(t(k),input(k,state.form[k]))).join('')}</div><p class="fine">${txt(t('planningTip'))}</p><div class="actions inner-spacer"><button type="submit" class="btn primary">${txt(state.editId?t('updatePlan'):t('savePlan'))}</button>${state.editId?btn(t('cancelEdit'),'cancel-edit'):''}</div><p id="planMsg" class="small" role="status">${txt(state.planMessage)}</p></form></section><section class="stack"><section class="card">${cardHeader(t('costBreakdown'))}<div id="planCostBars">${costBars()}</div></section><section class="card"><div class="line-between"><h2>${txt(t('profitLoss'))}</h2>${btn(t('listen'),'speak-plan','small')}</div><p class="fine">${txt(t('estimateNote'))}</p><div class="inner-spacer" id="planPreview">${planNumbers(state.form)}</div></section></section></div><section class="card"><div class="card-header"><div><h2>${txt(t('savedPlans'))} <span class="badge soft">${state.plans.length}</span></h2><p>${txt(t('storedLocal'))}</p></div>${btn('⬇ '+t('exportPlans'),'export-plans','small')}</div>${state.plans.length?`<div class="saved-grid">${state.plans.map(p=>{const r=calcPlan(p);return `<div class="saved-plan"><div class="line-between"><div><h3>${txt(p.cropName)}</h3><div class="small muted">${txt(p.area)} ${txt(t('acres'))}</div></div><div class="actions">${btn(t('edit'),'edit-plan','small',`data-id="${txt(p._id)}"`)}${btn(t('delete'),'delete-plan','danger small',`data-id="${txt(p._id)}"`)}</div></div><div class="grid3"><div><span class="fine">${txt(t('totalCost'))}</span><b>${rupees(r.cost)}</b></div><div><span class="fine">${txt(t('revenueEst'))}</span><b>${rupees(r.revenue)}</b></div><div><span class="fine">${txt(t('profitLoss'))}</span><b class="${r.profit>=0?'positive':'negative'}">${r.profit<0?'−':''}${rupees(Math.abs(r.profit))}</b></div></div></div>`}).join('')}</div>`:`<div class="empty-state"><div class="emoji">📋</div><p>${txt(t('noPlans'))}</p></div>`}</section></div>`;
}
function savePlan(){
 const form={...state.form,cropName:state.form.cropName.trim()};
 const validName=form.cropName.length>0&&form.cropName.length<=60;
 const validNums=PLAN_KEYS.every(k=>form[k]===''||(Number.isFinite(Number(form[k]))&&Number(form[k])>=0&&Number(form[k])<=1e9));
 if(!validName||!validNums||!(Number(form.area)>0)){state.planMessage=t('requiredValid');if(id('planMsg'))id('planMsg').textContent=state.planMessage;toast(state.planMessage);return;}
 const now=new Date().toISOString();const uuid=window.crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(16).slice(2);
 const obj={...form,_id:state.editId||uuid,createdAt:state.plans.find(p=>p._id===state.editId)?.createdAt||now,updatedAt:now};
 const next=state.editId?state.plans.map(p=>p._id===state.editId?obj:p):[obj,...state.plans];
 if(!putStore('agrisense_plans',next)){state.planMessage=t('saveFailed');toast(state.planMessage);return}
 state.plans=next;state.form=blankForm();state.editId='';state.planMessage=t('saved');render();toast(t('saveSuccess'));
}
function exportPlans(){
 if(!state.plans.length){toast(t('exportEmpty'));return}
 const columns=['cropName',...PLAN_KEYS,'createdAt'];
 const csv=[columns.join(','),...state.plans.map(p=>columns.map(k=>'"'+String(p[k]??'').replaceAll('"','""')+'"').join(','))].join('\r\n');
 const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='AgriSense_My_Plans.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function changePlace(p){state.place=p;putStore('agrisense_static_place',p);state.mandiState='';state.mandiDistrict='';state.mandiMarket='';state.selectedMandi='';state.weatherPlace='';state.weatherStatus='idle';state.geoResults=[];state.geoStatus='';render();}
function route(p){location.hash='#'+p;if(state.page===p)render();}
function wire(){
 window.addEventListener('hashchange',()=>{state.geoStatus='';state.geoResults=[];render();window.scrollTo({top:0,behavior:'instant'})});
 document.addEventListener('click',event=>{
  const el=event.target.closest('[data-action]');if(!el)return;
  const action=el.dataset.action;
  if(action==='open-mandi')return route('mandi');
  if(action==='open-weather')return route('weather');
  if(action==='remove-crop'){
   if(state.picked.length<=2)return;
   state.picked=state.picked.filter(x=>x!==el.dataset.crop);putStore('agrisense_compared_crops',state.picked);render();return;
  }
  if(action==='speak-rec') {const r=getRecommendation(comparisonRows());return speak(r.text+' '+r.explanation.join('. '));}
  if(action==='refresh-weather')return ensureWeather(true).then(()=>state.page==='weather'&&render());
  if(action==='search-location')return searchLocations();
  if(action==='choose-location'){const chosen=state.geoResults[Number(el.dataset.index)];if(chosen)changePlace(chosen);return;}
  if(action==='speak-weather'){const w=state.weather;if(!w)return;speak(pName(state.place)+'. '+Math.round(w.current.temp)+'°C, '+t(wxType(w.current.code).key)+'. '+adviceFor(w).map(k=>t(k)).join(' '));return;}
  if(action==='speak-plan'){const r=calcPlan(state.form);speak(t('planSpeak',{crop:state.form.cropName||'—',area:state.form.area||0,cost:numstr(r.cost),rev:numstr(r.revenue),word:t(r.profit>=0?'profitWord':'lossWord'),profit:numstr(Math.abs(r.profit))}));return;}
  if(action==='cancel-edit'){state.form=blankForm();state.editId='';state.planMessage='';render();return;}
  if(action==='edit-plan'){const p=state.plans.find(x=>x._id===el.dataset.id);if(!p)return;state.form={...blankForm(),...p};state.editId=p._id;state.planMessage='';render();window.scrollTo({top:0,behavior:'smooth'});return;}
  if(action==='delete-plan'){
   const p=state.plans.find(x=>x._id===el.dataset.id);if(!p||!window.confirm(t('confirmDelete')))return;
   const remaining=state.plans.filter(x=>x._id!==p._id);
   if(!putStore('agrisense_plans',remaining)){toast(t('saveFailed'));return}
   state.plans=remaining;if(state.editId===p._id){state.editId='';state.form=blankForm();}render();toast(t('deleted'));return;
  }
  if(action==='export-plans')return exportPlans();
 });
 document.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='globalLocation'){const chosen=[state.place,...LOCATIONS].find(x=>x.id===el.value);if(chosen)changePlace(chosen);return;}
  if(el.id==='cropAddSelect'){if(cropById(el.value)&&!state.picked.includes(el.value)){state.picked.push(el.value);putStore('agrisense_compared_crops',state.picked);state.compareSearch='';render();}return;}
  if(el.dataset.compKey){const cid=el.dataset.crop,k=el.dataset.compKey;if(!cropById(cid)||!['yield','price','cost'].includes(k))return;
   state.compareEdits[cid]??={};state.compareEdits[cid][k]=el.value;putStore('agrisense_compare_edits',state.compareEdits);render();return;}
  if(el.id==='mandiCrop'){state.mandiCrop=el.value;state.selectedMandi='';render();return}
  if(el.id==='mandiState'){state.mandiState=el.value;state.mandiDistrict='';state.mandiMarket='';state.selectedMandi='';render();return}
  if(el.id==='mandiDistrict'){state.mandiDistrict=el.value;state.mandiMarket='';state.selectedMandi='';render();return}
  if(el.id==='mandiMarket'){state.mandiMarket=el.value;state.selectedMandi=el.value;render();return}
  if(el.id==='mandiQuery'){state.mandiQuery=el.value;state.selectedMandi='';render();return}
 });
 document.addEventListener('input',event=>{
  const el=event.target;
  if(el.id==='compareSearch'){state.compareSearch=el.value;if(id('cropAddSelect'))id('cropAddSelect').innerHTML=optionsForCompare();return}
  if(el.id==='geoQuery'){state.geoQuery=el.value;return}
  if(el.closest('#planForm')&&el.name&&(['cropName',...PLAN_KEYS].includes(el.name))){state.form[el.name]=el.value;
   if(id('planCostBars'))id('planCostBars').innerHTML=costBars();
   if(id('planPreview'))id('planPreview').innerHTML=planNumbers(state.form);
   return;
  }
 });
 document.addEventListener('submit',event=>{if(event.target.id==='planForm'){event.preventDefault();savePlan();}});
 document.addEventListener('keydown',event=>{
  if(event.target.id==='geoQuery'&&event.key==='Enter'){event.preventDefault();searchLocations();}
  if(event.target.id==='mandiQuery'&&event.key==='Enter'){event.preventDefault();state.mandiQuery=event.target.value;render();}
  const row=event.target.closest?.('tr[data-mandi-row]');if(row && (event.key==='Enter'||event.key===' ')){event.preventDefault();state.selectedMandi=row.dataset.mandiRow;render()}
 });
 document.addEventListener('click',event=>{const row=event.target.closest('tr[data-mandi-row]');if(row){state.selectedMandi=row.dataset.mandiRow;render();}});
 document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.dataset.lang===state.lang)return;state.lang=btn.dataset.lang;putStore('agrisense_static_lang',state.lang);window.speechSynthesis?.cancel();render();
 }));
}
wire();render();
})();
