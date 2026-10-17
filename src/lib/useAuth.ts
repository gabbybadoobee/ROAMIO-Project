"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
export function useAuth() {
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
   const client=getSupabase(); if(!client){setLoading(false);return;}
   let active=true;
   client.auth.getUser().then(({data})=>{if(active){setUser(data.user);setLoading(false);}}).catch(()=>{if(active)setLoading(false);});
   const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{if(active){setUser(session?.user??null);setLoading(false);}});
   return ()=>{active=false;subscription.unsubscribe();};
 },[]);
 return {user,loading};
}
