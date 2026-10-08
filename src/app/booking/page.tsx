import type { Metadata } from "next";
import { CalendarDays, ClipboardList, MapPin } from "lucide-react";
import { Animations } from "@/components/Animations";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Book a Clean | ${site.legalName}`,
};

const stages = [
  { icon: ClipboardList, label: "Cleaning details" },
  { icon: CalendarDays, label: "Date & time" },
  { icon: MapPin, label: "Location" },
];

export default function BookingPage() {
  return (
    <>
      <Nav base="/" />
      <main className="bg-mist">
        <section className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#0a34c2_0%,#1a5cff_45%,#5aa2ff_100%)] pb-28 pt-36 text-center text-white sm:pt-44">
          <span aria-hidden className="bubble absolute left-[8%] top-[30%] h-20 w-20 animate-float opacity-60" />
          <span aria-hidden className="bubble absolute right-[10%] top-[22%] h-28 w-28 animate-float opacity-60 [animation-delay:-4s]" />
          <span aria-hidden className="bubble absolute bottom-[18%] right-[32%] h-10 w-10 animate-float opacity-70 [animation-delay:-2s]" />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
            <p data-reveal className="text-xs font-semibold uppercase tracking-[0.3em] text-ice">
              Book online
            </p>
            <h1 data-reveal className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Your space is about to get cleaner
            </h1>
            <p data-reveal className="mt-5 text-base text-white/80 sm:text-lg">
              We just need a few details.
            </p>

            <ul data-stagger className="mt-10 flex justify-center gap-8 sm:gap-14">
              {stages.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-medium text-white/90">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The form overlaps the blue band above it */}
        <div className="relative mx-auto -mt-14 max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
          <BookingForm />
        </div>
      </main>
      <Footer base="/" />
      <Animations />
    </>
  );
}
