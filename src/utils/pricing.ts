/**
 * Currency and billing utility functions for Colls Records (Tanzania market, TZS)
 */

export function formatTZS(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'TZS 0';
  }
  return `TZS ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function calculateBookingTotal(
  basePriceTZS: number,
  hours: number = 1,
  discountPercentage: number = 0
): number {
  const subtotal = Math.max(0, basePriceTZS * Math.max(1, hours));
  const discount = (subtotal * Math.min(100, Math.max(0, discountPercentage))) / 100;
  return Math.round(subtotal - discount);
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateTanzanianPhone(phone: string): boolean {
  if (!phone) return false;
  // Accepts +255XXXXXXXXX, 07XXXXXXXX, 06XXXXXXXX, 255XXXXXXXXX
  const cleaned = phone.replace(/[\s\-]/g, '');
  const tzRegex = /^(\+?255|0)[67]\d{8}$/;
  return tzRegex.test(cleaned);
}
