"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabase, isBackendConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
export default function AuthPage(){
 const {user}=useAuth();const [mode,setMode]=useState<"login"|"signup">("login");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [status,setStatus]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setStatus("");const client=getSupabase();if(!client)return;setBusy(true);
 const {error}=mode==="signup"?await client.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+"/auth"}}):await client.auth.signInWithPassword({email,password});setBusy(false);
 setStatus(error?error.message:mode==="signup"?"Account submitted. Check your email for confirmation if enabled.":"Signed in successfully.");}
 async function logout(){await getSupabase()?.auth.signOut();setStatus("Signed out.");}
 return <main className="page-shell min-h-[65vh] py-16"><div className="mx-auto max-w-md rounded-3xl border border-slate-200 p-8 shadow-card"><h1 className="text-3xl font-black text-navy">Your ROAMIO account</h1><p className="mt-2 text-sm text-slate-500">Sign in to save favorites and reserve fictional demo stays.</p>
 {!isBackendConfigured?<p className="mt-6 rounded-xl bg-ivory p-4 text-sm">Authentication requires Supabase configuration. See README.md.</p>:user?<div className="mt-6 space-y-4"><p className="break-all text-sm">Signed in as <strong>{user.email}</strong></p><Link className="block font-bold text-teal underline" href="/trips">My trips</Link><button className="rounded-full bg-navy px-5 py-3 font-semibold text-white" onClick={logout}>Sign out</button></div>:<><div className="mt-6 flex gap-3"><button type="button" className={`rounded-full px-4 py-2 text-sm ${mode==="login"?"bg-navy text-white":"bg-ivory"}`} onClick={()=>setMode("login")}>Sign in</button><button type="button" className={`rounded-full px-4 py-2 text-sm ${mode==="signup"?"bg-navy text-white":"bg-ivory"}`} onClick={()=>setMode("signup")}>Create account</button></div><form onSubmit={submit} className="mt-5 space-y-4"><label className="block text-sm font-bold">Email<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal"/></label><label className="block text-sm font-bold">Password<input required type="password" minLength={6} autoComplete={mode==="signup"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 font-normal"/></label><button disabled={busy} className="w-full rounded-xl bg-coral p-4 font-bold text-white">{busy?"Working...":mode==="signup"?"Create account":"Sign in"}</button></form></>}
 {status&&<p role="status" className="mt-4 text-sm text-teal">{status}</p>}</div></main>;
}
