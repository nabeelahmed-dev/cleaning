import { ArrowUpRight, Check } from "lucide-react";
import { reasons, services, stats, steps } from "@/lib/site";
import { BubbleField, type Bubble } from "./BubbleField";
import { icons, Sparkle } from "./icons";
import { ReviewRing } from "./ReviewRing";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  return (
    <section id="services" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What we do"
          title="Cleaning for every kind of space"
          text="From a weekly tidy to a full deep clean, choose the service that fits and we handle the rest."
        />

        <div data-stagger="flip" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <article
                key={service.title}
                data-tilt="9"
                className="tilt-card group relative rounded-3xl transition-[translate,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-30px_rgb(10_52_194/0.6)]"
              >
                {/* Card face: clipped so the hover wash and glare stay inside the corners */}
                <span className="absolute inset-0 overflow-hidden rounded-3xl border border-azure/10 bg-mist">
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-br from-azure to-royal transition-transform duration-500 ease-out group-hover:scale-y-100" />
                  <span className="tilt-glare" />
                </span>
                {/* Content floats above the face */}
                <div className="tilt-layer relative p-8">
                  <div className="flex items-start justify-between [transform-style:preserve-3d]">
                    <span className="tilt-pop grid h-14 w-14 place-items-center rounded-2xl bg-white text-azure shadow-sm transition-colors duration-500 group-hover:bg-white/15 group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-azure/40 transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                  </div>
                  <h3 className="mt-7 text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65 transition-colors duration-500 group-hover:text-white/85">
                    {service.text}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2.5 text-sm text-ink/75 transition-colors duration-500 group-hover:text-white/90"
                      >
                        <Check className="h-4 w-4 text-azure transition-colors duration-500 group-hover:text-ice" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const aboutBubbles: Bubble[] = [
  { position: "left-[6%] top-[14%]", size: "h-24 w-24 opacity-70", parallax: -80, depth: 46, delay: "0s" },
  { position: "-right-10 bottom-[4%]", size: "h-40 w-40 opacity-60", parallax: -140, depth: 70, delay: "-3s" },
  { position: "bottom-[10%] left-[40%]", size: "h-12 w-12 opacity-70", parallax: -50, depth: 28, delay: "-5s" },
  { position: "right-[30%] top-[8%]", size: "h-8 w-8 opacity-70", parallax: -30, depth: 18, delay: "-2s" },
  { position: "left-[22%] bottom-[22%]", size: "h-16 w-16 opacity-60", parallax: -100, depth: 54, delay: "-6s" },
  { position: "right-[12%] top-[42%]", size: "h-10 w-10 opacity-70", parallax: -60, depth: 34, delay: "-4s" },
  { position: "left-[52%] top-[30%]", size: "h-6 w-6 opacity-60", parallax: -20, depth: 12, delay: "-1s" },
];

export function About() {
  return (
    <section
      id="about"
      data-pointer-field
      className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#061a5c_0%,#0a34c2_55%,#1a5cff_100%)] py-24 sm:py-32"
    >
      <BubbleField bubbles={aboutBubbles} />
      <div className="absolute -right-40 top-0 -z-10 h-[40rem] w-[40rem] rounded-full bg-sky/25 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div data-reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ice">
                Why choose us
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                A team you can trust with your keys
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                We built our service around the things clients told us matter most:
                the same reliable people, safe products and a result you can see.
              </p>
            </div>

            <dl data-stagger className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l border-white/25 pl-5">
                  <dd className="text-4xl font-semibold tabular-nums tracking-tight text-white sm:text-5xl">
                    <span data-count={stat.value} data-decimals={stat.decimals ?? 0}>
                      {stat.value.toLocaleString("en-US", {
                        minimumFractionDigits: stat.decimals ?? 0,
                      })}
                    </span>
                    <span className="text-ice">{stat.suffix}</span>
                  </dd>
                  <dt className="mt-2 text-sm text-white/70">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <ul data-stagger="flip" className="grid gap-5 sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <li
                key={reason.title}
                data-tilt="12"
                className={`tilt-card relative rounded-3xl text-white transition-[translate] duration-500 hover:-translate-y-1.5 ${
                  index % 2 === 1 ? "sm:translate-y-8 sm:hover:translate-y-6" : ""
                }`}
              >
                {/* The glass sits on its own layer: backdrop blur would flatten the 3D content */}
                <span className="glass absolute inset-0 overflow-hidden rounded-3xl">
                  <span className="tilt-glare" />
                </span>
                <div className="tilt-layer relative p-7">
                  <Sparkle className="tilt-pop h-5 w-5 text-ice" />
                  <h3 className="mt-5 text-lg font-semibold">{reason.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/75">{reason.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Spotless in three simple steps"
        />

        <ol data-stagger="flip" className="relative mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              data-tilt="10"
              className="tilt-card relative rounded-3xl shadow-[0_20px_50px_-35px_rgb(10_52_194/0.6)]"
            >
              <span className="absolute inset-0 overflow-hidden rounded-3xl bg-white">
                <span className="tilt-glare tilt-glare-blue" />
              </span>
              <div className="tilt-layer relative p-8">
                <span className="tilt-pop inline-block bg-gradient-to-b from-azure to-ice bg-clip-text text-6xl font-semibold tracking-tight text-transparent">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="Loved by homes and businesses"
          text="A few words from the people who open the door to a cleaner space every week."
        />
      </div>

      <ReviewRing />
    </section>
  );
}
