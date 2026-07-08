export function isValidCro(cro: string): boolean {
  return /^[0-9]{6,7}-[A-Z]{2}$/.test(cro);
}