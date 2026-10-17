"use client";
import { useEffect, useMemo, useState } from "react";
import { StayCard } from "@/components/StayCard";
import { Icon } from "@/components/icons";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { stays, type StayCategory } from "@/data/stays";
type Category = "All stays" | StayCategory;
const categories: { name:Category; icon:"home"|"sun"|"mountain"|"building"|"leaf" }[] = [{name:"All stays",icon:"home"},{name:"Beachfront",icon:"sun"},{name:"Mountain",icon:"mountain"},{name:"City",icon:"building"},{name:"Countryside",icon:"leaf"}];
export function Explore(){
 const {user}=useAuth();
 const [location,setLocation]=useState("");
 const [guests,setGuests]=useState(1);
 const [checkin,setCheckin]=useState("");
 const [checkout,setCheckout]=useState("");
 const [category,setCategory]=useState<Category>("All stays");
 const [maxPrice,setMaxPrice]=useState(10000);
 const [sort,setSort]=useState("featured");
 const [saved,setSaved]=useState<number[]>([]);
 const [filtersOpen,setFiltersOpen]=useState(false);
 const [applied,setApplied]=useState({location:"",guests:1,checkin:"",checkout:""});
 const [dateError,setDateError]=useState("");
 useEffect(()=>{
  let active=true;
  if(user){const client=getSupabase();client?.from("favorites").select("property_id").eq("user_id",user.id).then(({data,error})=>{if(active&&!error)setSaved((data||[]).map(r=>Number(r.property_id)));});}
  else {try{const stored=JSON.parse(localStorage.getItem("roamio-favorites")||"[]");if(active&&Array.isArray(stored))setSaved(stored.filter((x:unknown)=>typeof x==="number"));}catch{if(active)setSaved([]);}}
  return ()=>{active=false;};
 },[user]);
 async function toggleSaved(id:number){const before=saved;const exists=before.includes(id);const after=exists?before.filter(x=>x!==id):[...before,id];setSaved(after);
  if(user){const client=getSupabase();if(!client)return;const {error}=exists?await client.from("favorites").delete().eq("user_id",user.id).eq("property_id",id):await client.from("favorites").insert({user_id:user.id,property_id:id});if(error){setSaved(before);alert(`Unable to save favorite: ${error.message}`);}}else{localStorage.setItem("roamio-favorites",JSON.stringify(after));}}
 const results=useMemo(()=>{
  const term=applied.location.trim().toLowerCase();
  const rows=stays.filter(s=>(!term||`${s.title} ${s.location} ${s.province}`.toLowerCase().includes(term))&&s.guests>=applied.guests&&(category==="All stays"||s.category===category)&&s.price<=maxPrice);
  if(sort==="price-low")rows.sort((a,b)=>a.price-b.price);
  if(sort==="price-high")rows.sort((a,b)=>b.price-a.price);
  if(sort==="rating")rows.sort((a,b)=>b.rating-a.rating);
  return rows;
 },[applied,category,maxPrice,sort]);
 const submit=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault(); if(checkin&&checkout&&checkout<=checkin){setDateError("Check-out must be after check-in.");return;}setDateError("");setApplied({location,guests,checkin,checkout});document.getElementById("stays")?.scrollIntoView({behavior:"smooth"});};
 const clear=()=>{setLocation("");setGuests(1);setCheckin("");setCheckout("");setApplied({location:"",guests:1,checkin:"",checkout:""});setCategory("All stays");setMaxPrice(10000);setSort("featured");setDateError("");};
 return <>
  <section className="relative overflow-hidden bg-ivory" id="home"><div className="page-shell grid gap-10 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-12 lg:pb-28 lg:pt-20">
    <div className="relative z-10"><span className="eyebrow"><span className="inline-block size-2 rounded-full bg-coral"/> DISCOVER THE PHILIPPINES</span>
    <h1 className="mt-6 max-w-[650px] text-[clamp(3.1rem,6vw,5.3rem)] font-black leading-[1.08] tracking-[-.065em] text-navy">Go places.<br/><span className="text-coral">Feel at home.</span></h1>
    <p className="mt-6 max-w-[500px] text-[17px] leading-8 text-slate-600">From surfside hideaways to cozy mountain cabins, find a little place that feels like yours.</p>
    <div className="mt-8 flex items-center gap-4"><div className="flex -space-x-3"><span className="avatar bg-[#F6CFAC]">☀️</span><span className="avatar bg-[#A4CEC5]">🌴</span><span className="avatar bg-[#DBC6E8]">🏡</span></div><p className="text-sm text-slate-600"><strong className="text-navy">Explore local escapes</strong><br/>Made for the way you roam</p></div>
    </div>
    <div className="relative h-[330px] sm:h-[420px] lg:h-[500px]"><div className="absolute inset-y-4 right-0 left-8 rotate-[3deg] rounded-[44px] bg-[#E8B9A6]"/><img className="relative h-full w-full rounded-[44px] object-cover shadow-card" src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85" alt="Tropical modern villa with pool"/><div className="absolute bottom-5 left-[-12px] rounded-2xl bg-white px-4 py-3 shadow-card sm:left-[-25px]"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Your next escape</p><p className="mt-1 text-base font-extrabold text-navy">Somewhere unforgettable ✨</p></div></div>
  </div></section>
  <div className="page-shell relative z-10 -mt-8 sm:-mt-11"><form onSubmit={submit} aria-label="Search demonstration stays" className="rounded-[24px] border border-slate-100 bg-white p-3 shadow-[0_20px_65px_rgba(23,43,54,.12)]"><div className="grid gap-2 md:grid-cols-[1.7fr_1fr_1fr_.7fr_auto] md:items-end">
   <label className="search-field"><span className="field-label"><Icon name="pin" size={15}/> WHERE</span><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Where to?" aria-label="Destination" /></label>
   <label className="search-field"><span className="field-label"><Icon name="calendar" size={15}/> CHECK IN</span><input type="date" value={checkin} onChange={e=>setCheckin(e.target.value)} aria-label="Check-in date" /></label>
   <label className="search-field"><span className="field-label"><Icon name="calendar" size={15}/> CHECK OUT</span><input type="date" min={checkin||undefined} value={checkout} onChange={e=>setCheckout(e.target.value)} aria-label="Check-out date" /></label>
   <label className="search-field"><span className="field-label"><Icon name="users" size={15}/> GUESTS</span><select value={guests} onChange={e=>setGuests(Number(e.target.value))} aria-label="Number of guests">{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1} guest{i>0?"s":""}</option>)}</select></label>
   <button type="submit" className="flex min-h-[60px] items-center justify-center gap-2 rounded-[16px] bg-coral px-7 font-bold text-white transition hover:bg-[#ed584c]"><Icon name="search"/> Search</button>
  </div>{dateError&&<p role="alert" className="px-3 pb-1 pt-2 text-sm font-semibold text-red-600">{dateError}</p>}</form><p className="mt-2 text-center text-xs text-slate-500">Date range is validated here; booking availability is checked against Supabase when reserving.</p></div>
  <section className="page-shell pb-20 pt-20" id="stays"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="eyebrow">FIND YOUR KIND OF GETAWAY</span><h2 className="mt-3 section-heading">Stays worth the journey<span className="text-coral">.</span></h2><p className="mt-2 text-slate-500">Explore curated demo listings across the Philippines.</p></div><p className="text-sm font-semibold text-slate-500">{results.length} {results.length===1?"stay":"stays"} found</p></div>
   <div className="mt-8 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{categories.map(c=><button key={c.name} onClick={()=>setCategory(c.name)} type="button" aria-pressed={category===c.name} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${category===c.name?"border-navy bg-navy text-white":"border-slate-200 bg-white text-slate-600 hover:border-navy"}`}><Icon name={c.icon} size={16}/>{c.name}</button>)}</div><div className="flex gap-2"><button type="button" onClick={()=>setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy"><Icon name="sliders" size={16}/> Filters</button><select aria-label="Sort properties" value={sort} onChange={e=>setSort(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></div></div>
   {filtersOpen&&<div className="mt-4 flex flex-wrap items-center gap-5 rounded-2xl bg-ivory px-6 py-4"><label className="flex flex-1 flex-col gap-2 text-sm font-semibold text-navy">Maximum demo nightly price: ₱{maxPrice.toLocaleString("en-PH")}<input type="range" min="2000" max="10000" step="500" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="accent-coral"/></label><button onClick={clear} type="button" className="text-sm font-bold text-coral underline">Reset filters</button></div>}
   {(applied.checkin||applied.checkout)&&<p className="mt-5 rounded-xl bg-ivory p-3 text-sm text-slate-600"><strong>Date selection:</strong> {applied.checkin||"No check-in"} to {applied.checkout||"No checkout"}. Availability is checked on the reservation form, not in these demo search results.</p>}
   {results.length?<div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{results.map(s=><StayCard key={s.id} stay={s} saved={saved.includes(s.id)} onToggleSaved={toggleSaved}/>)}</div>:<div className="mt-8 rounded-3xl bg-ivory py-16 text-center"><p className="text-xl font-bold text-navy">No matching stays just yet.</p><p className="mt-2 text-slate-500">Try another destination, category, price, or guest count.</p><button onClick={clear} type="button" className="mt-5 rounded-full bg-navy px-6 py-3 font-bold text-white">Clear filters</button></div>}
  </section>
  <section id="destinations" className="bg-ivory py-20"><div className="page-shell"><span className="eyebrow">A LITTLE WANDERLUST</span><h2 className="section-heading mt-3">Where to next<span className="text-coral">?</span></h2><div className="mt-8 grid gap-5 md:grid-cols-3">{[{name:"Siargao",line:"Island days, easy pace",img:"https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85"},{name:"Baguio",line:"Cabin weather and coffee",img:"https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=85"},{name:"Palawan",line:"Your tropical reset",img:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85"}].map(d=><button onClick={()=>{setLocation(d.name);setApplied({location:d.name,guests:1,checkin:"",checkout:""});document.getElementById("stays")?.scrollIntoView({behavior:"smooth"});}} className="group relative h-60 overflow-hidden rounded-[24px] text-left" key={d.name}><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={d.img} alt="Travel destination inspiration"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/><div className="absolute bottom-6 left-6 text-white"><h3 className="text-2xl font-extrabold">{d.name}</h3><p className="text-sm text-white/80">{d.line}</p></div></button>)}</div></div></section>
  <section id="how-it-works" className="page-shell py-20"><span className="eyebrow">SIMPLE BY DESIGN</span><h2 className="section-heading mt-3">Your escape, made easy<span className="text-coral">.</span></h2><div className="mt-9 grid gap-8 md:grid-cols-3">{[{n:"01",h:"Find your place",p:"Explore sample escapes by destination, style, and nightly price."},{n:"02",h:"Pick your favorites",p:"Tap the heart on listings you love while browsing this demo."},{n:"03",h:"Imagine your stay",p:"Explore listing details now. Real booking and payments come in later phases."}].map(s=><div key={s.n} className="rounded-3xl bg-ivory p-7"><span className="text-3xl font-black text-coral">{s.n}</span><h3 className="mt-5 text-lg font-extrabold text-navy">{s.h}</h3><p className="mt-2 leading-7 text-slate-600">{s.p}</p></div>)}</div></section>
 </>;
}
