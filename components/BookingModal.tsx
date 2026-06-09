"use client";

import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";

type ModalCtx = { open: () => void; close: () => void };
const Ctx = createContext<ModalCtx>({ open: () => {}, close: () => {} });
export const useBookingModal = () => useContext(Ctx);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Ctx.Provider value={{ open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
            />

            {/* Centering container */}
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-3">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-[640px] max-h-[88svh] overflow-y-auto rounded-2xl bg-[#0e0d0b] border border-white/8 px-6 pb-10 pt-5 shadow-2xl"
            >
              {/* Close */}
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/50 transition hover:border-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <BookingForm onSuccess={() => setIsOpen(false)} />
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function BookNowButton({ className }: { className?: string }) {
  const { open } = useBookingModal();
  return (
    <button
      onClick={open}
      className={className ?? "rounded-full bg-salon-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black transition hover:brightness-110"}
    >
      Book Now
    </button>
  );
}
