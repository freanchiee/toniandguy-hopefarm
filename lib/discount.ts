export type DiscountConfig = {
  weekday_min: number; weekday_max: number;
  weekend_min: number; weekend_max: number;
};

const DEFAULTS: DiscountConfig = {
  weekday_min: 25, weekday_max: 35,
  weekend_min: 10, weekend_max: 15,
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calcDiscount(date: Date, cfg: DiscountConfig = DEFAULTS): number {
  const day = date.getDay(); // 0=Sun, 6=Sat
  const isWeekend = day === 0 || day === 6;
  return isWeekend
    ? randomInt(cfg.weekend_min, cfg.weekend_max)
    : randomInt(cfg.weekday_min, cfg.weekday_max);
}

export function buildWhatsAppMessage({
  name,
  service,
  stylist,
  date,
  time,
  discount,
  bookingId,
}: {
  name: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  discount: number;
  bookingId: string;
}): string {
  const day = new Date(date).getDay();
  const isWeekend = day === 0 || day === 6;
  const periodLabel = isWeekend ? "weekend" : "weekday";

  return `✂️ *Booking Confirmed — Toni & Guy Hopefarm*

Hi ${name}! Your appointment is locked in.

📋 *Details*
• Service: ${service}
• Stylist: ${stylist}
• Date: ${new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
• Time: ${time}

🎉 *${discount}% ${periodLabel} discount applied!*
Show this message at the salon to redeem.

Ref: #${bookingId.slice(0, 8).toUpperCase()}

📍 *Find us here:*
https://maps.app.goo.gl/nFqNAeWzgR4XLTne9

To cancel, reply CANCEL ${bookingId.slice(0, 8).toUpperCase()}

_Toni & Guy Hopefarm, Whitefield Bangalore_
_9:00 AM – 9:00 PM · Mon–Sun_`;
}

export function buildSalonAlertMessage({
  name,
  phone,
  service,
  stylist,
  date,
  time,
  discount,
  bookingId,
}: {
  name: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  discount: number;
  bookingId: string;
}): string {
  return `📥 *New Booking — Online*

👤 *${name}*
📱 ${phone}
📋 ${service}
💇 ${stylist}
📅 ${new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} at ${time}
🎁 ${discount}% discount granted (online booking)
🔖 Ref: #${bookingId.slice(0, 8).toUpperCase()}`;

}

export function buildReminderMessage({
  name,
  service,
  stylist,
  date,
  time,
}: {
  name: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
}): string {
  return `⏰ *Reminder — Toni & Guy Hopefarm*

Hi ${name}! Your appointment is tomorrow.

📋 ${service} with ${stylist}
🕐 ${new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at ${time}

📍 Hopefarm, Whitefield Bangalore

See you tomorrow! Reply CANCEL to cancel.`;
}
