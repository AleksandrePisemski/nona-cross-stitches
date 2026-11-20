import { EnvelopeIcon, GlobeAltIcon, MapPinIcon, TruckIcon } from "@heroicons/react/24/outline"
import NavBar from "../components/layout/NavBar"
import PageWrapper from "../components/layout/PageWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

// Shared delivery and payment definitions used by checkout and order confirmation.
export const DELIVERY_METHODS = [
  { value: "courier", label: "Courier Delivery", description: "Tbilisi: 7 GEL. Other Georgian cities: 10 GEL. Free on orders over 150 GEL.", icon: TruckIcon },
  { value: "post", label: "Georgian Post", description: "Shipping fee is confirmed before dispatch.", icon: EnvelopeIcon },
  { value: "international", label: "International shipping", description: "Shipping fee is confirmed based on destination.", icon: GlobeAltIcon },
  { value: "pickup", label: "Store Pickup", description: "Pick up your order free of charge.", icon: MapPinIcon },
]

export const PAYMENT_METHODS = [
  { value: "card", label: "Credit/debit card (online)", description: "Pay online by card." },
  { value: "cash", label: "Cash on delivery / at pickup", description: "Pay when you receive or collect your order." },
  { value: "bank-transfer", label: "Bank transfer", description: "Transfer details will be provided with your order." },
]

export function isGeorgia(country) {
  return ["georgia", "sakartvelo"].includes(String(country ?? "").trim().toLocaleLowerCase())
}

export function getDeliveryFee({ method, city, country, subtotal }) {
  if (method === "pickup") return 0
  if (method !== "courier") return null
  if (!isGeorgia(country) || !String(city ?? "").trim()) return null
  if (Number(subtotal) > 150) return 0
  return String(city).trim().toLocaleLowerCase() === "tbilisi" ? 7 : 10
}

export default function DeliveryAndPayment() {
  return <PageWrapper>
    <NavBar />
    <main className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-24 text-PrimaryText sm:px-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-stitching-rust">Helpful information</p>
        <h1 className="mt-2 font-header text-3xl font-semibold sm:text-4xl">Delivery and Payment</h1>
      </header>
      <Card className="bg-page">
        <CardHeader><CardTitle className="font-header text-2xl">Delivery methods</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {DELIVERY_METHODS.map(({ value, label, description, icon: Icon }) => <article key={value} className="rounded-xl border border-stitching-wood/50 bg-section p-5">
            <Icon className="size-6 text-stitching-rust" aria-hidden="true" />
            <h2 className="mt-3 font-semibold">{label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-PrimaryText/75">{description}</p>
          </article>)}
        </CardContent>
      </Card>
      <Card className="bg-page">
        <CardHeader><CardTitle className="font-header text-2xl">Payment methods</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {PAYMENT_METHODS.map(({ value, label, description }) => <article key={value} className="rounded-xl border border-stitching-wood/50 bg-section p-5">
            <h2 className="font-semibold">{label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-PrimaryText/75">{description}</p>
          </article>)}
        </CardContent>
      </Card>
    </main>
  </PageWrapper>
}
