// Pure money pipeline for service sale tickets. Integer rupees throughout.
// Server-authoritative — the client form only previews; the API recomputes here.

export type DiscountType = "none" | "percent" | "amount";

export type TicketMoney = {
  subtotal: number;
  discount_amount: number;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  tax_amount: number;
  grand_total: number;
};

export function computeTicketMoney(opts: {
  chargedPrices: number[];
  discount_type: DiscountType;
  discount_value: number;
  is_gst: boolean;
  gst_rate: number;
}): TicketMoney {
  const subtotal = opts.chargedPrices.reduce((s, p) => s + Math.max(0, Math.round(p)), 0);

  let discount_amount = 0;
  if (opts.discount_type === "amount") discount_amount = Math.round(opts.discount_value);
  else if (opts.discount_type === "percent") discount_amount = Math.round((subtotal * opts.discount_value) / 100);
  discount_amount = Math.max(0, Math.min(discount_amount, subtotal));

  const taxable_amount = subtotal - discount_amount;

  let tax_amount = 0, cgst_amount = 0, sgst_amount = 0;
  if (opts.is_gst && opts.gst_rate > 0) {
    tax_amount = Math.round((taxable_amount * opts.gst_rate) / 100);
    cgst_amount = Math.floor(tax_amount / 2);
    sgst_amount = tax_amount - cgst_amount; // remainder to SGST so cgst+sgst === tax
  }

  return { subtotal, discount_amount, taxable_amount, cgst_amount, sgst_amount, tax_amount, grand_total: taxable_amount + tax_amount };
}

export function incentiveAmount(menu_price: number, pct: number): number {
  return Math.round((Math.max(0, menu_price) * Math.max(0, pct)) / 100);
}

// package covers up to its balance; remainder is split (cash/card/etc)
export function splitPackage(chargedPrice: number, packageBalance: number): { redeemed: number; remainder: number } {
  const redeemed = Math.max(0, Math.min(Math.round(chargedPrice), Math.round(packageBalance)));
  return { redeemed, remainder: Math.round(chargedPrice) - redeemed };
}

// payments (incl. package) must cover the grand total within ₹1 rounding
export function paymentsCover(grandTotal: number, packagePaid: number, p: { cash: number; card: number; upi: number; wallet: number }): boolean {
  const paid = packagePaid + p.cash + p.card + p.upi + p.wallet;
  return Math.abs(paid - grandTotal) <= 1;
}

export function primaryPaymentMode(packagePaid: number, p: { cash: number; card: number; upi: number; wallet: number }): string {
  const buckets = [["package", packagePaid], ["cash", p.cash], ["card", p.card], ["upi", p.upi], ["wallet", p.wallet]].filter(([, v]) => (v as number) > 0) as [string, number][];
  if (buckets.length === 0) return "cash";
  if (buckets.length === 1) return buckets[0][0];
  return "split";
}
