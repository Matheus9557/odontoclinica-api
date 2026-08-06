const CRO_REGEX = /^[0-9]{6,7}-[A-Z]{2}$/;

export function isValidCro(cro: string): boolean {
  return CRO_REGEX.test(cro.trim());
}