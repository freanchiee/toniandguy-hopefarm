import { BookingForm } from "@/components/BookingForm";

export default function BookPage() {
  return (
    <main className="flex min-h-screen items-center bg-salon-black px-5 py-28 md:px-8">
      <section className="section-shell">
        <BookingForm />
      </section>
    </main>
  );
}
