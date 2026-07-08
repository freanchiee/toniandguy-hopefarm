// Run: npx tsx lib/sales.test.ts
import assert from "node:assert";
import { computeTicketMoney, incentiveAmount, splitPackage, paymentsCover, primaryPaymentMode } from "./sales";

// No GST, no discount
let m = computeTicketMoney({ chargedPrices: [700, 300], discount_type: "none", discount_value: 0, is_gst: false, gst_rate: 18 });
assert.equal(m.subtotal, 1000);
assert.equal(m.tax_amount, 0);
assert.equal(m.grand_total, 1000);

// GST 18% on 1000 = 180, split 90/90
m = computeTicketMoney({ chargedPrices: [1000], discount_type: "none", discount_value: 0, is_gst: true, gst_rate: 18 });
assert.equal(m.tax_amount, 180);
assert.equal(m.cgst_amount, 90);
assert.equal(m.sgst_amount, 90);
assert.equal(m.grand_total, 1180);

// Odd tax splits remainder to SGST (cgst+sgst === tax)
m = computeTicketMoney({ chargedPrices: [505], discount_type: "none", discount_value: 0, is_gst: true, gst_rate: 18 });
assert.equal(m.tax_amount, 91); // round(90.9)
assert.equal(m.cgst_amount, 45);
assert.equal(m.sgst_amount, 46);
assert.equal(m.cgst_amount + m.sgst_amount, m.tax_amount);

// Percent discount then GST
m = computeTicketMoney({ chargedPrices: [1000], discount_type: "percent", discount_value: 10, is_gst: true, gst_rate: 18 });
assert.equal(m.discount_amount, 100);
assert.equal(m.taxable_amount, 900);
assert.equal(m.tax_amount, 162);
assert.equal(m.grand_total, 1062);

// Amount discount clamped to subtotal
m = computeTicketMoney({ chargedPrices: [500], discount_type: "amount", discount_value: 9999, is_gst: false, gst_rate: 0 });
assert.equal(m.discount_amount, 500);
assert.equal(m.grand_total, 0);

// Incentive off menu price
assert.equal(incentiveAmount(1000, 5), 50);
assert.equal(incentiveAmount(700, 7.5), 53); // round(52.5)

// Package split
assert.deepEqual(splitPackage(3500, 5000), { redeemed: 3500, remainder: 0 });
assert.deepEqual(splitPackage(3500, 2000), { redeemed: 2000, remainder: 1500 });

// Payment coverage + mode
assert.equal(paymentsCover(1180, 0, { cash: 1180, card: 0, upi: 0, wallet: 0 }), true);
assert.equal(paymentsCover(1180, 500, { cash: 680, card: 0, upi: 0, wallet: 0 }), true);
assert.equal(paymentsCover(1180, 0, { cash: 500, card: 0, upi: 0, wallet: 0 }), false);
assert.equal(primaryPaymentMode(0, { cash: 1180, card: 0, upi: 0, wallet: 0 }), "cash");
assert.equal(primaryPaymentMode(500, { cash: 680, card: 0, upi: 0, wallet: 0 }), "split");
assert.equal(primaryPaymentMode(1180, { cash: 0, card: 0, upi: 0, wallet: 0 }), "package");

console.log("✓ all sales money checks passed");
