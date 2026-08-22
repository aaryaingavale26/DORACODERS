import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}
