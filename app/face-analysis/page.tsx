import type { Metadata } from "next";
import { FaceAnalysisWidget } from "@/components/FaceAnalysisWidget";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "AI Haircut Finder | Toni & Guy Hopefarm Whitefield",
  description:
    "Upload a selfie and get AI haircut suggestions tailored to your face shape — for men and women. Free AI face-shape style match by Toni & Guy Hopefarm, Whitefield Bangalore. Your photo is never stored.",
  keywords: [
    "ai haircut finder", "haircut for my face shape", "face shape haircut suggestion",
    "ai hairstyle recommendation india", "best haircut for face shape bangalore",
    "toni and guy whitefield ai style match",
  ],
  alternates: { canonical: `${SITE_URL}/face-analysis` },
  openGraph: {
    title: "AI Haircut Finder | Toni & Guy Hopefarm Whitefield",
    description: "Upload a selfie, get your top 3 haircuts by face shape — for men & women. Free AI style match. Photo never stored.",
    url: `${SITE_URL}/face-analysis`,
  },
};

export default function FaceAnalysisPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <FaceAnalysisWidget />
      </div>
    </main>
  );
}
