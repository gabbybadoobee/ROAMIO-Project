"use client";
import Link from "next/link";
import { useState } from "react";
import { formatPeso, type Stay } from "@/data/stays";
import { getSupabase, isBackendConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
const dayMs=86400000;
function todayManila(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}
function nightsBetween(a:string,b:string){return Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/dayMs);}
export function BookingPanel({stay}:{stay:Stay}){
 const {user,loading}=useAuth(); const [checkin,setCheckin]=useState("");const [checkout,setCheckout]=useState("");const [guests,setGuests]=useState(1);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const [success,setSuccess]=useState(false);
 const min=todayManila();const nights=checkin&&checkout?nightsBetween(checkin,checkout):0;const valid=checkin>=min&&nights>0&&nights<=30&&guests>=1&&guests<=stay.guests;
 async function reserve(){
  setMessage("");setSuccess(false);if(!valid){setMessage("Select future dates (1–30 nights) and a valid guest count.");return;}
  const client=getSupabase();if(!client){setMessage("Connect Supabase to enable real database reservations.");return;}
  if(!user){setMessage("Please sign in to make a reservation.");return;}
  setBusy(true);
  const {data,error}=await client.rpc("create_demo_booking",{p_property_id:stay.id,p_checkin:checkin,p_checkout:checkout,p_guests:guests});
  setBusy(false);if(error){setMessage(error.message);return;}
  setSuccess(true);setMessage(`Reservation confirmed. Reference: ${String(data).slice(0,8)}. No payment was collected.`);
 }
 return <aside className="self-start rounded-3xl border border-slate-200 p-7 shadow-card">
  <p className="text-2xl font-extrabold text-navy">{formatPeso(stay.price)} <span className="text-sm font-normal text-slate-500">/ night</span></p>
  <p className="mt-2 text-sm text-slate-500">Fictional property · Test reservations only · No payment collected</p>
  <div className="mt-5 grid grid-cols-2 gap-2"><label className="text-xs font-bold text-navy">CHECK IN<input aria-label="Booking check-in" className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" type="date" min={min} value={checkin} onChange={e=>{setCheckin(e.target.value);setMessage("");}}/></label><label className="text-xs font-bold text-navy">CHECK OUT<input aria-label="Booking check-out" className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" type="date" min={checkin||min} value={checkout} onChange={e=>{setCheckout(e.target.value);setMessage("");}}/></label></div>
  <label className="mt-4 block text-xs font-bold text-navy">GUESTS<select aria-label="Booking guests" className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" value={guests} onChange={e=>setGuests(Number(e.target.value))}>{Array.from({length:stay.guests},(_,i)=><option key={i+1} value={i+1}>{i+1} guest{i!==0?"s":""}</option>)}</select></label>
  {valid&&<div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm text-navy"><span>{formatPeso(stay.price)} × {nights} nights</span><strong>{formatPeso(stay.price*nights)}</strong></div>}
  {!isBackendConfigured&&<p className="mt-3 rounded-lg bg-ivory p-3 text-xs text-slate-600">Preview mode: dates and price are interactive. Configure Supabase and apply the SQL migration to save bookings.</p>}
  {isBackendConfigured&&!loading&&!user&&<Link className="mt-3 block text-sm font-bold text-teal underline" href="/auth">Sign in to reserve</Link>}
  <button type="button" disabled={!valid||!user||!isBackendConfigured||busy||loading} onClick={reserve} className="mt-5 w-full rounded-xl bg-coral px-5 py-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{busy?"Checking availability...":!isBackendConfigured?"Connect backend to reserve":!user?"Sign in to reserve":"Reserve test stay"}</button>
  {message&&<p role="status" className={`mt-3 text-sm ${success?"text-teal":"text-red-700"}`}>{message}</p>}
  {success&&<Link href="/trips" className="mt-2 block text-sm font-bold text-teal underline">View my trips →</Link>}
  <p className="mt-3 text-center text-xs text-slate-400">Database availability checked only on reservation submission</p>
 </aside>;
}
