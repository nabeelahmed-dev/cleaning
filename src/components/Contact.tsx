"use client";

import { useState } from "react";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { services, site } from "@/lib/site";
import { BubbleField, type Bubble } from "./BubbleField";

// Kept to the edges and the gap between columns so they don't crowd the form.
const contactBubbles: Bubble[] = [
  { position: "left-[4%] top-[18%]", size: "h-32 w-32 opacity-60", parallax: -120, depth: 64, delay: "0s" },
  { position: "bottom-[12%] right-[5%]", size: "h-20 w-20 opacity-70", parallax: -60, depth: 40, delay: "-3s" },
  { position: "left-[44%] top-[10%]", size: "h-10 w-10 opacity-70", parallax: -40, depth: 24, delay: "-5s" },
  { position: "left-[30%] bottom-[8%]", size: "h-14 w-14 opacity-60", parallax: -90, depth: 48, delay: "-2s" },
  { position: "right-[2%] top-[12%]", size: "h-8 w-8 opacity-70", parallax: -30, depth: 16, delay: "-6s" },
  { position: "left-[12%] bottom-[30%]", size: "h-6 w-6 opacity-60", parallax: -20, depth: 12, delay: "-4s" },
];

const field =
  "w-full rounded-2xl border border-azure/15 bg-mist px-4 py-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/40 focus:border-azure focus:ring-4 focus:ring-azure/15";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      data-pointer-field
      className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#0a34c2_0%,#1a5cff_50%,#5aa2ff_100%)] py-24 sm:py-32"
    >
      <BubbleField bubbles={contactBubbles} />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ice">
            Get a free quote
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Ready for a cleaner, brighter space?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Tell us a little about your home or business and we will send a fixed,
            no-obligation price.
          </p>

          <ul className="mt-10 space-y-5 text-white">
            {[
              { icon: Phone, label: site.phone, href: site.phoneHref },
              { icon: Mail, label: site.email, href: `mailto:${site.email}` },
              { icon: MapPin, label: site.area },
              { icon: Clock, label: site.hours },
            ].map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {href ? (
                  <a href={href} className="text-sm font-medium hover:underline">
                    {label}
                  </a>
                ) : (
                  <span className="text-sm font-medium">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="rounded-[2rem] bg-white p-7 shadow-[0_40px_90px_-40px_rgb(6_26_92/0.9)] sm:p-10">
          {sent ? (
            <div className="flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-azure text-white">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-ink">Almost done</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/65">
                Your email app should have opened with your request filled in.
                Press send there to reach us, or call {site.phone}.
              </p>
            </div>
          ) : (
            // No backend: the form opens the visitor's email app with the
            // request written out, addressed to the business.
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const body = [
                  `Name: ${data.get("name")}`,
                  `Phone: ${data.get("phone")}`,
                  `Email: ${data.get("email")}`,
                  `Service: ${data.get("service")}`,
                  "",
                  `${data.get("message")}`,
                ].join("\n");
                window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
                  `Quote request: ${data.get("service")}`,
                )}&body=${encodeURIComponent(body)}`;
                setSent(true);
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-ink/70">Name</span>
                <input required name="name" autoComplete="name" placeholder="Your name" className={field} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-ink/70">Phone</span>
                <input required name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" className={field} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-ink/70">Email</span>
                <input required name="email" type="email" autoComplete="email" placeholder="you@example.com" className={field} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-ink/70">Service</span>
                <select name="service" className={field} defaultValue={services[0].title}>
                  {services.map((service) => (
                    <option key={service.title}>{service.title}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-ink/70">
                  About your space
                </span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Size, number of rooms, anything we should know"
                  className={`${field} resize-none`}
                />
              </label>
              <button
                type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-azure px-7 py-4 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:bg-royal active:scale-[0.98] sm:col-span-2"
              >
                Get my free quote
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
