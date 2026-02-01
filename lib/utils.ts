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

export async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}


export const getApdDateColor = (playerDateStr: string | Date, gameDateStr: string | Date) => {
  const gameDateObj = new Date(gameDateStr);
  const playerDateObj = new Date(playerDateStr);

  gameDateObj.setHours(0, 0, 0, 0);
  playerDateObj.setHours(0, 0, 0, 0);

  const diffTime = playerDateObj.getTime() - gameDateObj.getTime();
  // Converter para dias
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "text-destructive font-bold"; // text-red-500
  }

  // 2. AMARELO: Se a data for válida, mas expira dentro de 7 dias (Aviso)
  if (diffDays >= 0 && diffDays <= 7) {
    return "text-yellow-600 font-medium"; 
  }

  // 3. NORMAL: Caso contrário
  return "text-muted-foreground";
};