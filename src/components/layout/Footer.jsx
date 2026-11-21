import { useState } from "react"
import { Link } from "react-router"
import {
  ArrowUpIcon,
  ChevronDownIcon,
  CreditCardIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"
import { Accordion } from "../../components/ui/accordion"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { filterOptions } from "../../pages/catalog/catalogData"
import { DELIVERY_METHODS, PAYMENT_METHODS } from "../../pages/DeliveryAndPayment"

// Replace these sample values with verified store contact and profile details before launch.
const support = {
  phone: "+995 555 00 00 00",
  email: "hello@example.com",
  hours: "Monday-Saturday, 10:00-18:00",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  messenger: "https://www.messenger.com/",
}

const navigationGroups = [
  {
    title: "Information / Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contacts", to: "/contact" },
      { label: "Stores / Pickup Locations", to: "/stores" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Delivery & Payment", to: "/delivery-payment" },
      { label: "Warranty & Returns", to: "/warranty-returns" },
      { label: "Installment / Financing", to: "/installment-financing" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Catalog / Categories",
    links: filterOptions.category.map(({ value, label }) => ({
      label,
      to: `/catalog?category=${encodeURIComponent(value)}`,
    })),
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
]

const linkClass = "block w-fit max-w-full text-sm text-PrimaryText/75 transition-colors hover:text-stitching-rust focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stitching-rust"

function FooterLinks({ links }) {
  return <ul className="space-y-2.5">{links.map(({ label, to }) => <li key={to + label}><Link className={linkClass} to={to}>{label}</Link></li>)}</ul>
}

function SocialLink({ href, label, children }) {
  return <a href={href} aria-label={label} target="_blank" rel="noreferrer" className="inline-flex size-10 items-center justify-center rounded-full border border-stitching-wood/70 text-stitching-graphite transition-colors hover:border-stitching-rust hover:bg-stitching-rust hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitching-rust">{children}</a>
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
    <path d="M13.4 21v-8.2h2.75l.41-3.2H13.4V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14C16.4 3.05 15.39 3 14.2 3c-2.5 0-4.2 1.53-4.2 4.34V9.6H7.2v3.2H10V21h3.4Z" />
  </svg>
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.65" cy="6.55" r="1" fill="currentColor" stroke="none" />
  </svg>
}

function MessengerIcon() {
  return <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 3.25c-5.05 0-8.75 3.62-8.75 8.42 0 2.55 1.1 4.72 3.03 6.18v3.1l3.02-1.66c.86.24 1.77.37 2.7.37 5.05 0 8.75-3.62 8.75-8.42S17.05 3.25 12 3.25Z" />
    <path d="m7.45 13.67 3.17-3.36 2.52 1.94 3.41-1.94-3.17 3.36-2.52-1.94-3.41 1.94Z" fill="currentColor" stroke="none" />
  </svg>
}

function FooterContact() {
  return <section aria-labelledby="footer-contact-title" className="space-y-4">
    <h2 id="footer-contact-title" className="font-header text-lg font-semibold">Contact & support</h2>
    <p className="text-xs text-stitching-rust">Sample contact details  replace before launch</p>
    <div className="space-y-3 text-sm">
      <a className="flex min-w-0 items-start gap-3 text-PrimaryText/80 hover:text-stitching-rust" href={`tel:${support.phone.replace(/[^+\d]/g, "")}`}><PhoneIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><span><span className="block font-semibold text-PrimaryText">{support.phone}</span><span>{support.hours}</span></span></a>
      <a className="flex min-w-0 items-center gap-3 break-all text-PrimaryText/80 hover:text-stitching-rust" href={`mailto:${support.email}`}><EnvelopeIcon className="size-5 shrink-0" aria-hidden="true" />{support.email}</a>
      <p className="flex items-start gap-3 text-PrimaryText/75"><MapPinIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><span>12 Rustaveli Avenue, Tbilisi<br />Pickup hours: {support.hours}</span></p>
    </div>
    <Button render={<Link to="/contact" />} className="bg-stitching-navy text-white transition-colors hover:bg-stitching-rust">Contact us</Button>
    <div className="flex gap-2 pt-1">
      <SocialLink href={support.facebook} label="Visit our Facebook page"><FacebookIcon /></SocialLink>
      <SocialLink href={support.instagram} label="Visit our Instagram page"><InstagramIcon /></SocialLink>
      <SocialLink href={support.messenger} label="Message us on Messenger"><MessengerIcon /></SocialLink>
    </div>
  </section>
}

function DeliveryHighlights() {
  return <div className="grid gap-4 rounded-xl border border-stitching-wood/50 bg-stitching-linen p-4 text-sm sm:grid-cols-2">
    <div className="flex items-start gap-3">
      <TruckIcon className="mt-0.5 size-5 shrink-0 text-stitching-rust" aria-hidden="true" />
      <div><strong className="block">Delivery options</strong><ul className="mt-1 space-y-1 text-PrimaryText/75">{DELIVERY_METHODS.map(({ value, label }) => <li key={value}>{label}</li>)}</ul></div>
    </div>
    <div className="flex items-start gap-3"><CreditCardIcon className="mt-0.5 size-5 shrink-0 text-stitching-rust" aria-hidden="true" /><div><strong className="block">Payment methods</strong><ul className="mt-1 space-y-1 text-PrimaryText/75">{PAYMENT_METHODS.map(({ value, label }) => <li key={value}>{label}</li>)}</ul></div></div>
    <Link to="/delivery-payment" className="font-semibold text-stitching-rust underline-offset-4 hover:underline sm:col-span-2">View delivery and payment details</Link>
  </div>
}
export default function Footer() {
  const year = new Date().getFullYear()
  const [activeMobileGroup, setActiveMobileGroup] = useState([])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return <footer className="mt-auto border-t border-stitching-wood/60 bg-stitching-floss text-PrimaryText">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <FooterContact />
        <div className="space-y-4">
          <h2 className="font-header text-lg font-semibold">Delivery & payment</h2>
          <DeliveryHighlights />
        </div>
      </div>

      <Separator className="bg-stitching-wood/60" />

      <nav aria-label="Footer navigation" className="py-8">
        <div className="hidden grid-cols-4 gap-8 md:grid">
          {navigationGroups.map(({ title, links }) => <section key={title} aria-labelledby={`footer-${title.replace(/[^a-z0-9]/gi, "-")}`}>
            <h2 id={`footer-${title.replace(/[^a-z0-9]/gi, "-")}`} className="mb-4 font-header text-base font-semibold">{title}</h2>
            <FooterLinks links={links} />
          </section>)}
        </div>
        <Accordion.Root value={activeMobileGroup} onValueChange={setActiveMobileGroup} multiple className="divide-y divide-stitching-wood/60 md:hidden">
          {navigationGroups.map(({ title, links }, index) => <Accordion.Item key={title} value={`group-${index}`} className="py-1">
            <Accordion.Header>
              <Accordion.Trigger className="group flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitching-rust">
                {title}<ChevronDownIcon className="size-4 shrink-0 transition-transform group-data-panel-open:rotate-180" aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="overflow-hidden pb-4 data-starting-style:h-0 data-ending-style:h-0">
              <FooterLinks links={links} />
            </Accordion.Panel>
          </Accordion.Item>)}
        </Accordion.Root>
      </nav>

      <Separator className="bg-stitching-wood/60" />

      <div className="flex flex-col gap-5 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-PrimaryText/70"> {year} Nona's Cross-Stitches. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
          <span className="mr-1 text-xs text-PrimaryText/60">Pay by</span>
          {["Card", "Cash", "Bank transfer"].map((method) => <span key={method} className="rounded-md border border-stitching-wood/60 bg-stitching-linen px-2.5 py-1 text-xs font-medium">{method}</span>)}
        </div>
        <Button type="button" variant="outline" onClick={scrollToTop} className="w-fit gap-2 border-stitching-wood bg-transparent text-PrimaryText hover:bg-stitching-linen">
          Back to top<ArrowUpIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </footer>
}








