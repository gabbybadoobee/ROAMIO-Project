import type { ReactNode } from "react";
type Props = { name: "search" | "pin" | "users" | "calendar" | "heart" | "star" | "arrow" | "menu" | "close" | "sliders" | "check" | "home" | "sun" | "mountain" | "building" | "leaf"; size?: number; filled?: boolean; className?: string };
const paths: Record<Props["name"], ReactNode> = {
 search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
 pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
 calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
 heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
 star: <path d="m12 2 3.1 6.3 7 1-5 4.9 1.2 6.9L12 17.8l-6.3 3.3 1.2-6.9-5-4.9 7-1L12 2Z"/>,
 arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
 menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
 close: <><path d="M5 5l14 14M19 5 5 19"/></>,
 sliders: <><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="white"/><circle cx="16" cy="17" r="2" fill="white"/></>,
 check: <path d="m4 12 5 5L20 6"/>,
 home: <><path d="m3 10 9-7 9 7v11H3V10Z"/><path d="M9 21v-8h6v8"/></>,
 sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
 mountain: <><path d="m2 20 8-14 5 8 2-3 5 9H2Z"/></>,
 building: <><path d="M4 21V3h11v18M15 9h5v12M8 7h3M8 11h3M8 15h3M3 21h19"/></>,
 leaf: <><path d="M21 3C11 3 4 8 4 16a5 5 0 0 0 5 5c8 0 13-7 12-18Z"/><path d="M4 20c5-7 8-9 14-13"/></>
};
export function Icon({ name, size=20, filled=false, className="" }: Props) { return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>; }
