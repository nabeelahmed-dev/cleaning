"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { booking, services, site } from "@/lib/site";
import { icons } from "./icons";

const field =
  "w-full rounded-2xl border border-azure/15 bg-mist px-4 py-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/40 focus:border-azure focus:ring-4 focus:ring-azure/15";

const tile =
  "flex h-full cursor-pointer items-center gap-3 rounded-2xl border border-azure/15 bg-mist px-4 py-3.5 text-sm font-medium text-ink/80 transition-[background-color,border-color,color,box-shadow] duration-300 hover:border-azure/50 peer-checked:border-azure peer-checked:bg-azure peer-checked:text-white peer-checked:shadow-[0_14px_30px_-16px_rgb(10_52_194/0.8)] peer-focus-visible:ring-4 peer-focus-visible:ring-azure/25";

function Step({
  number,
  title,
  note,
  children,
}: {
  number: number;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-reveal
      className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-50px_rgb(10_52_194/0.7)] sm:p-9"
    >
      <div className="flex items-baseline gap-4">
        <span className="bg-gradient-to-b from-azure to-ice bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          0{number}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
      </div>
      {note && <p className="mt-2 text-sm leading-relaxed text-ink/60">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-xs font-semibold text-ink/70">{children}</span>;
}

export function BookingForm() {
  const [service, setService] = useState<string>(services[0].title);
  const [frequency, setFrequency] = useState<string>(booking.frequencies[0]);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [arrival, setArrival] = useState<string>(booking.arrivalWindows[0]);
  const [sent, setSent] = useState(false);
  const dateInput = useRef<HTMLInputElement>(null);

  // Apartments are sized by rooms; offices and commercial spaces by floor area.
  const kind = service.includes("Apartment") ? "apartment" : "commercial";
  const sizeFields = kind === "apartment" ? booking.apartmentSize : booking.commercialSize;
  // Keyed by kind as well, because both sets have a "Floor area" with different bands.
  const detailKey = (label: string) => `${kind}/${label}`;
  const detailValue = (label: string, options: readonly string[]) =>
    details[detailKey(label)] ?? options[0];

  // Bookings can't be made for a past date. Set in the browser so the server
  // render and the visitor's local date never disagree.
  useEffect(() => {
    if (!dateInput.current) return;
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    dateInput.current.min = local.toISOString().slice(0, 10);
  }, []);

  const prettyDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not chosen yet";

  const summary = [
    { label: "Service", value: service },
    { label: "Frequency", value: frequency },
    ...sizeFields.map((size) => ({ label: size.label, value: detailValue(size.label, size.options) })),
    { label: "Extras", value: extras.length ? extras.join(", ") : "None" },
    { label: "Date", value: prettyDate },
    { label: "Arrival", value: arrival },
  ];

  if (sent) {
    return (
      <div
        role="status"
        className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] bg-white px-8 py-16 text-center shadow-[0_30px_70px_-50px_rgb(10_52_194/0.7)]"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-azure text-white">
          <Check className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold text-ink">Almost done</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
          Your email app should have opened with your booking request filled in.
          Press send there to reach us, or call {site.phone}. We will confirm the
          time and price with you before the booking is final.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 text-sm font-semibold text-azure hover:underline"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    // No backend or payment: the form opens the visitor's email app with the
    // booking request written out, addressed to the business.
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const text = (name: string) => String(data.get(name) ?? "").trim();
        const body = [
          "BOOKING REQUEST",
          ...summary.map((row) => `${row.label}: ${row.value}`),
          "",
          "CONTACT",
          `Name: ${text("firstName")} ${text("lastName")}`,
          `Email: ${text("email")}`,
          `Phone: ${text("phone")}`,
          "",
          "LOCATION",
          [text("address"), text("unit")].filter(Boolean).join(", "),
          `${text("city")}, ${text("state")} ${text("zip")}`,
          "",
          "COMMENTS",
          text("comments") || "None",
        ].join("\n");
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          `Booking request: ${service}`,
        )}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
      className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start"
    >
      <div className="space-y-6">
        <Step number={1} title="Choose your service">
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((item) => {
              const Icon = icons[item.icon];
              return (
                <label key={item.title} className="block">
                  <input
                    type="radio"
                    name="service"
                    value={item.title}
                    checked={service === item.title}
                    onChange={() => setService(item.title)}
                    className="peer sr-only"
                  />
                  <span className={tile}>
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                    {item.title}
                  </span>
                </label>
              );
            })}
          </div>
        </Step>

        <Step
          number={2}
          title="How often?"
          note="Scheduling is flexible. Tell us if you need to change or pause a recurring clean."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {booking.frequencies.map((option) => (
              <label key={option} className="block">
                <input
                  type="radio"
                  name="frequency"
                  value={option}
                  checked={frequency === option}
                  onChange={() => setFrequency(option)}
                  className="peer sr-only"
                />
                <span className={`${tile} justify-center text-center`}>{option}</span>
              </label>
            ))}
          </div>
        </Step>

        <Step
          number={3}
          title="Tell us about your space"
          note={`Bigger than the options here? Call or text ${site.phone} for a custom quote.`}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {sizeFields.map((size) => (
              <label key={size.label} className="block">
                <Label>{size.label}</Label>
                <select
                  className={field}
                  value={detailValue(size.label, size.options)}
                  onChange={(event) =>
                    setDetails((current) => ({ ...current, [detailKey(size.label)]: event.target.value }))
                  }
                >
                  {size.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <p className="mb-3 mt-8 text-xs font-semibold text-ink/70">Extras</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {booking.extras.map((extra) => (
              <label key={extra} className="block">
                <input
                  type="checkbox"
                  checked={extras.includes(extra)}
                  onChange={(event) =>
                    setExtras((current) =>
                      event.target.checked
                        ? [...current, extra]
                        : current.filter((item) => item !== extra),
                    )
                  }
                  className="peer sr-only"
                />
                <span className={`${tile} justify-center text-center`}>{extra}</span>
              </label>
            ))}
          </div>
        </Step>

        <Step
          number={4}
          title="When would you like us to come?"
          note="Please allow a one-hour arrival window for traffic and parking."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <Label>Date</Label>
              <input
                ref={dateInput}
                required
                type="date"
                name="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={field}
              />
            </label>
            <label className="block">
              <Label>Arrival window</Label>
              <select
                className={field}
                value={arrival}
                onChange={(event) => setArrival(event.target.value)}
              >
                {booking.arrivalWindows.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </Step>

        <Step number={5} title="Contact information">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <Label>First name</Label>
              <input required name="firstName" autoComplete="given-name" className={field} />
            </label>
            <label className="block">
              <Label>Last name</Label>
              <input required name="lastName" autoComplete="family-name" className={field} />
            </label>
            <label className="block">
              <Label>Email</Label>
              <input required type="email" name="email" autoComplete="email" className={field} />
            </label>
            <label className="block">
              <Label>Phone</Label>
              <input required type="tel" name="phone" autoComplete="tel" className={field} />
            </label>
          </div>
        </Step>

        <Step number={6} title="Location">
          <div className="grid gap-4 sm:grid-cols-6">
            <label className="block sm:col-span-4">
              <Label>Street address</Label>
              <input required name="address" autoComplete="address-line1" className={field} />
            </label>
            <label className="block sm:col-span-2">
              <Label>Suite / apt (optional)</Label>
              <input name="unit" autoComplete="address-line2" className={field} />
            </label>
            <label className="block sm:col-span-3">
              <Label>City</Label>
              <input required name="city" autoComplete="address-level2" className={field} />
            </label>
            <label className="block sm:col-span-1">
              <Label>State</Label>
              <input required name="state" autoComplete="address-level1" maxLength={2} className={field} />
            </label>
            <label className="block sm:col-span-2">
              <Label>ZIP code</Label>
              <input required name="zip" autoComplete="postal-code" inputMode="numeric" className={field} />
            </label>
          </div>
        </Step>

        <Step number={7} title="Comments">
          <textarea
            name="comments"
            rows={4}
            aria-label="Comments"
            placeholder="Access instructions, parking, pets, anything we should know"
            className={`${field} resize-none`}
          />
        </Step>
      </div>

      {/* Booking summary: follows the visitor down the page on desktop */}
      <aside
        data-reveal
        className="rounded-[2rem] bg-[linear-gradient(160deg,#061a5c_0%,#0a34c2_60%,#1a5cff_100%)] p-7 text-white shadow-[0_40px_90px_-40px_rgb(6_26_92/0.9)] lg:sticky lg:top-28"
      >
        <h2 className="text-xl font-semibold tracking-tight">Booking summary</h2>
        <dl className="mt-6 space-y-4">
          {summary.map((row) => (
            <div key={row.label} className="flex justify-between gap-6 border-b border-white/15 pb-4 text-sm">
              <dt className="shrink-0 text-white/65">{row.label}</dt>
              <dd className="text-right font-medium">{row.value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-6 text-sm">
            <dt className="shrink-0 text-white/65">Price</dt>
            <dd className="text-right font-medium">Confirmed with your quote</dd>
          </div>
        </dl>

        <button
          type="submit"
          className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-royal transition-transform duration-300 active:scale-[0.98]"
        >
          Request booking
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>
        <p className="mt-4 text-xs leading-relaxed text-white/65">
          No payment is taken online. We confirm the time and price with you
          before your booking is final.
        </p>
      </aside>
    </form>
  );
}
