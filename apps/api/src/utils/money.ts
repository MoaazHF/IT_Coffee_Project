export const TAX_BPS = 500;

export const calculateTaxCents = (subtotalCents: number): number =>
  Math.round((subtotalCents * TAX_BPS) / 10000);

export const calculateTotalCents = (subtotalCents: number): number =>
  subtotalCents + calculateTaxCents(subtotalCents);
