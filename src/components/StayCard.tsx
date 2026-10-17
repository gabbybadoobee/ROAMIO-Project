"use client";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { formatPeso, type Stay } from "@/data/stays";
export function StayCard({ stay, saved, onToggleSaved }: { stay: Stay; saved: boolean; onToggleSaved: (id: number)=>void }) {
 return <article className="group min-w-0">
   <div className="relative overflow-hidden rounded-[22px] bg-[#e5e7e6] aspect-[1.08]">
    <Link href={`/stays/${stay.slug}`} aria-label={`View ${stay.title}`} className="block h-full w-full"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]" src={stay.image} alt={`Representative photo for fictional ${stay.title}`} loading="lazy" /></Link>
    {stay.isGuestFavorite && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-navy shadow-sm">Guest favorite</span>}
    <button type="button" className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full shadow-md transition hover:scale-110 ${saved?"bg-coral text-white":"bg-white/95 text-navy"}`} aria-label={saved?`Remove ${stay.title} from saved stays`:`Save ${stay.title}`} aria-pressed={saved} onClick={()=>onToggleSaved(stay.id)}><Icon name="heart" filled={saved} size={19}/></button>
   </div>
   <div className="pt-3.5">
     <div className="flex items-start justify-between gap-2"><Link href={`/stays/${stay.slug}`} className="text-[15px] font-bold tracking-tight text-navy hover:text-coral">{stay.title}</Link><span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-navy"><Icon name="star" filled size={13} className="text-[#FFAA4B]"/>{stay.rating.toFixed(2)}</span></div>
     <p className="mt-1 text-[13px] text-slate-500">{stay.location}</p>
     <p className="mt-1 text-[13px] text-slate-500">{stay.guests} guests · {stay.bedrooms} bedroom{stay.bedrooms>1?"s":""}</p>
     <p className="mt-2 text-[15px]"><span className="font-extrabold text-navy">{formatPeso(stay.price)}</span><span className="text-[13px] text-slate-500"> / night</span></p>
   </div>
 </article>;
}
