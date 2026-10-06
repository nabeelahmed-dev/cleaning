import Link from "next/link";
import { nav, services, site } from "@/lib/site";
import { Logo } from "./icons";

// `base` is "" on the home page and "/" on other pages (see Nav).
export function Footer({ base = "" }: { base?: string }) {
  const SectionLink = base ? Link : "a";
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            Professional cleaning for homes and businesses. Reliable,
            detail-oriented and always on time.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            {nav.map((item) => (
              <li key={item.href}>
                <SectionLink href={`${base}${item.href}`} className="transition-colors hover:text-white">
                  {item.label}
                </SectionLink>
              </li>
            ))}
            <li>
              <Link href="/booking" className="transition-colors hover:text-white">
                Book Online
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            {services.slice(0, 5).map((service) => (
              <li key={service.title}>
                <SectionLink href={`${base}#services`} className="transition-colors hover:text-white">
                  {service.title}
                </SectionLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li>
              <a href={site.phoneHref} className="transition-colors hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                {site.email}
              </a>
            </li>
            <li>{site.area}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/50 sm:px-8">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
