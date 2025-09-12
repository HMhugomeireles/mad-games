import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function fmtDate(date?: string | Date | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(d);
}

export function fmtTime(date?: string | Date | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { timeStyle: "short" }).format(d);
}

export function toIso(date?: string, time?: string) {
  if (!date || !time) return undefined;
  // Constrói ISO local (YYYY-MM-DDTHH:mm:00)
  const iso = `${date}T${time}:00`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function normalizeMac(input: string) {
  const s = input.toLowerCase().replace(/[^a-f0-9]/g, "");
  return s;
}