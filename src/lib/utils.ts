import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a string by converting to lowercase, decomposing Unicode characters,
 * stripping diacritics/accents, and trimming whitespace.
 * Example: "Jesús" -> "jesus", "Acuña" -> "acuna", "Domínguez" -> "dominguez"
 */
export function normalizeDiacritics(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

