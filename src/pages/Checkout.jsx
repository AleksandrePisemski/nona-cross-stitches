import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useCart } from "../context/CartContext.jsx"
import NavBar from "../components/layout/NavBar"
import PageWrapper from "../components/layout/PageWrapper"
import { DELIVERY_METHODS, getDeliveryFee, isGeorgia, PAYMENT_METHODS } from "./DeliveryAndPayment.jsx"
import { createIdempotencyKey, paymentProviders } from "../lib/paymentProviders.js"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

const initialForm = {
  firstName: "", lastName: "", phone: "", email: "", country: "", city: "",
  address: "", postalCode: "", apartment: "", entrance: "", floor: "",
  deliveryInstructions: "", orderComment: "",
}
const inputClass = "mt-1 w-full rounded-lg border border-stitching-wood/60 bg-page px-3 py-2.5 text-sm text-PrimaryText outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
const CHECKOUT_DRAFT_KEY = "nona-cross-stitches-checkout-draft"
const LAST_ORDER_KEY = "lastOrder"

function readCheckoutDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || "null")
    if (!saved || typeof saved !== "object") return null
    return saved
  } catch {
    return null
  }
}

function readRetryableOrder() {
  try {
    const order = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null")
    return ["Failed", "Cancelled"].includes(order?.paymentStatus) ? order : null
  } catch {
    return null
  }
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "GEL" }).format(value)
}

function numericPrice(price) {
  return Number(String(price ?? "").replace(/[^\d.-]/g, "")) || 0
}

function Field({ name, label, value, onChange, error, required = false, type = "text", autoComplete, placeholder }) {
  const errorId = `${name}-error`
  return <div>
    <label htmlFor={name} className="text-sm font-medium">{label}{required && <span aria-hidden="true"> *</span>}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={`${inputClass} ${error ? "border-red-600" : ""}`} />
    {error && <p id={errorId} className="mt-1 text-sm text-red-700">{error}</p>}
  </div>
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, addToCart, decrementCart, removeFromCart } = useCart()
  const [draft] = useState(readCheckoutDraft)
  const [form, setForm] = useState(() => ({ ...initialForm, ...(draft?.form ?? {}) }))
  const [errors, setErrors] = useState({})
  const [deliveryMethod, setDeliveryMethod] = useState(
    DELIVERY_METHODS.some((method) => method.value === draft?.deliveryMethod)
      ? draft.deliveryMethod
      : "courier",
  )
  const [paymentMethod, setPaymentMethod] = useState(
    PAYMENT_METHODS.some((method) => method.value === draft?.paymentMethod)
      ? draft.paymentMethod
      : "card",
  )
  const [promoInput, setPromoInput] = useState(draft?.promoInput ?? "")
  const [promoApplied, setPromoApplied] = useState(draft?.promoApplied === true && String(draft?.promoInput ?? "").trim().toUpperCase() === "SAVE10")
  const [promoMessage, setPromoMessage] = useState("")
  const [isPaying, setIsPaying] = useState(false)
  const [cardOutcome, setCardOutcome] = useState("success")
  const [paymentNotice, setPaymentNotice] = useState(null)
  const [pendingOrder, setPendingOrder] = useState(readRetryableOrder)
  const normalizedItems = useMemo(() => items.map((item) => ({
    ...item,
    productId: item.productId ?? item.id,
    quantity: item.quantity ?? 1,
    price: numericPrice(item.price),
    currency: "GEL",
  })), [items])
  const currency = "GEL"
  const subtotal = useMemo(() => normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [normalizedItems])
  const deliveryFee = normalizedItems.length === 0
    ? 0
    : getDeliveryFee({ method: deliveryMethod, city: form.city, country: form.country, subtotal })
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = Math.max(0, subtotal - discount + (deliveryFee ?? 0))

  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({
        form,
        deliveryMethod,
        paymentMethod,
        promoInput,
        promoApplied,
      }))
    } catch {
      // Keep checkout usable if browser storage is unavailable or full.
    }
  }, [form, deliveryMethod, paymentMethod, promoInput, promoApplied])

  function changeForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }))
  }

  function validate() {
    const next = {}
    const required = ["firstName", "lastName", "phone", "email", "country", "city"]
    if (deliveryMethod !== "pickup") required.push("address", "postalCode")
    const messages = {
      firstName: "First name is required.", lastName: "Last name is required.",
      phone: "Phone number is required.", email: "Email address is required.",
      country: "Country is required.", city: "City is required.",
      address: "Street address is required.", postalCode: "Postal code is required.",
    }
    for (const name of required) if (!form[name].trim()) next[name] = messages[name]
    if (deliveryMethod === "courier" && form.country.trim() && !isGeorgia(form.country)) {
      next.country = "Courier delivery is currently available within Georgia only."
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address."
    if (form.phone.trim() && !/^\+?[0-9\s().-]{7,20}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function applyPromo() {
    const valid = promoInput.trim().toUpperCase() === "SAVE10"
    setPromoApplied(valid)
    setPromoMessage(valid ? "SAVE10 applied. You saved 10%." : promoInput.trim() ? "That promo code is not valid." : "Enter a promo code first.")
  }

  async function payOrder(order, selectedMethod = paymentMethod) {
    if (isPaying || order.paymentStatus === "Paid") return
    const provider = paymentProviders[selectedMethod]
    if (!provider) return

    setIsPaying(true)
    setPaymentNotice(null)
    const idempotencyKey = createIdempotencyKey()
    setPendingOrder(order)
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
    } catch {
      // The live attempt can continue even if the browser cannot persist it.
    }
    try {
      const result = await provider(order, {
        forceOutcome: selectedMethod === "card" ? cardOutcome : undefined,
        idempotencyKey,
      })
      const successful = result.status === "Paid"
      const updatedOrder = {
        ...order,
        paymentMethod: selectedMethod,
        paymentStatus: result.status,
        orderStatus: successful ? "processing" : "pending",
        paymentAttempts: [
          ...(order.paymentAttempts ?? []),
          {
            attemptId: result.attemptId,
            idempotencyKey: result.idempotencyKey,
            timestamp: result.timestamp,
            status: result.status,
          },
        ],
        paymentDetails: result.paymentDetails ?? order.paymentDetails ?? null,
      }
      setPendingOrder(updatedOrder)
      try {
        localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(updatedOrder))
        if (successful || result.status === "Pending") {
          localStorage.removeItem(CHECKOUT_DRAFT_KEY)
        }
      } catch {
        // Keep the current checkout usable if browser storage is unavailable.
      }

      if (successful || result.status === "Pending") {
        navigate("/order-confirmation", { state: updatedOrder })
      } else if (result.status === "Failed") {
        setPaymentNotice({ type: "failure", message: result.reason ?? "Your payment could not be completed. Please try again." })
      } else {
        setPaymentNotice({ type: "cancelled", message: "Payment was cancelled. Your order is saved; retry or choose another payment method." })
      }
    } catch (error) {
      const failedOrder = {
        ...order,
        paymentMethod: selectedMethod,
        paymentStatus: "Failed",
        orderStatus: "pending",
        paymentAttempts: [
          ...(order.paymentAttempts ?? []),
          {
            attemptId: `pay-attempt-${Date.now()}`,
            idempotencyKey,
            timestamp: new Date().toISOString(),
            status: "Failed",
          },
        ],
      }
      setPendingOrder(failedOrder)
      try {
        localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(failedOrder))
      } catch {
        // Keep the payment error visible even when storage is unavailable.
      }
      setPaymentNotice({ type: "failure", message: error?.message ?? "The payment provider could not be reached. Please try again." })
    } finally {
      setIsPaying(false)
    }
  }

  async function submitOrder(event) {
    event.preventDefault()
    if (isPaying || pendingOrder?.paymentStatus === "Paid") return
    if (!validate()) {
      const invalid = document.querySelector('[aria-invalid="true"]')
      invalid?.focus()
      invalid?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    const order = pendingOrder ?? {
      orderRef: `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      customer: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), phone: form.phone.trim(), email: form.email.trim() },
      delivery: {
        method: deliveryMethod, country: form.country.trim(), city: form.city.trim(),
        address: deliveryMethod !== "pickup" ? form.address.trim() : "",
        postalCode: deliveryMethod !== "pickup" ? form.postalCode.trim() : "",
        apartment: form.apartment.trim(), entrance: form.entrance.trim(), floor: form.floor.trim(),
        instructions: form.deliveryInstructions.trim(),
        pickupLocation: deliveryMethod === "pickup" ? "Nona's Cross-Stitches, 12 Rustaveli Avenue" : "",
        pickupHours: deliveryMethod === "pickup" ? "Monday–Saturday, 10:00 AM–6:00 PM" : "",
      },
      paymentMethod, items: normalizedItems, currency, subtotal, deliveryFee, discount,
      promoCode: promoApplied ? "SAVE10" : "", total: deliveryFee == null ? null : total, orderComment: form.orderComment.trim(),
      paymentStatus: "Pending",
      orderStatus: "pending",
      paymentAttempts: [],
      processedWebhookIds: [],
      createdAt: new Date().toISOString(),
    }
    if (!pendingOrder) console.log("Order created:", order)
    await payOrder(order, paymentMethod)
  }

  return <PageWrapper>
    <NavBar />
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 text-PrimaryText sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-stitching-rust">Your order</p>
        <h1 className="mt-2 font-header text-3xl font-semibold sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-PrimaryText/70">Guest checkout · No account needed</p>
      </header>
      <form onSubmit={submitOrder} noValidate className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card className="bg-page"><CardHeader><CardTitle className="font-header text-xl">Delivery method</CardTitle></CardHeader><CardContent>
            <fieldset><legend className="sr-only">Choose a delivery method</legend><div className="grid gap-3 sm:grid-cols-2">
              {DELIVERY_METHODS.map(({ value, label, description, icon: Icon }) => <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${deliveryMethod === value ? "border-accent bg-stitching-rust/5 ring-2 ring-accent/20" : "border-stitching-wood/50 hover:border-stitching-wood"}`}>
                <input type="radio" name="deliveryMethod" value={value} checked={deliveryMethod === value} onChange={() => setDeliveryMethod(value)} className="mt-1 size-4 accent-black" />
                <Icon className="mt-0.5 size-5 shrink-0 text-stitching-rust" aria-hidden="true" /><span><span className="block font-medium">{label}</span><span className="mt-1 block text-xs text-PrimaryText/65">{description}</span></span>
              </label>)}
            </div></fieldset>
            {(deliveryMethod === "post" || deliveryMethod === "international") && <p className="mt-4 rounded-lg bg-section p-4 text-sm text-PrimaryText/75">The shipping fee will be confirmed before dispatch. The amount shown below excludes shipping.</p>}
            {deliveryMethod === "pickup" && <div className="mt-4 rounded-lg bg-section p-4 text-sm"><p className="font-semibold">Pickup location</p><p className="mt-1">Nona's Cross-Stitches, 12 Rustaveli Avenue</p><p className="mt-1 text-PrimaryText/70">Monday–Saturday, 10:00 AM–6:00 PM</p><p className="mt-2 font-medium text-stitching-success">Pickup is free</p></div>}
          </CardContent></Card>

          <Card className="bg-page"><CardHeader><CardTitle className="font-header text-xl">Customer and delivery details</CardTitle></CardHeader><CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="firstName" label="First name" value={form.firstName} onChange={changeForm} error={errors.firstName} required autoComplete="given-name" />
              <Field name="lastName" label="Last name" value={form.lastName} onChange={changeForm} error={errors.lastName} required autoComplete="family-name" />
              <Field name="phone" label="Phone number" value={form.phone} onChange={changeForm} error={errors.phone} required type="tel" placeholder="+995 555 01 23 45" autoComplete="tel" />
              <Field name="email" label="Email address" value={form.email} onChange={changeForm} error={errors.email} required type="email" placeholder="you@example.com" autoComplete="email" />
              <Field name="country" label="Country" value={form.country} onChange={changeForm} error={errors.country} required autoComplete="country-name" />
              <Field name="city" label="City" value={form.city} onChange={changeForm} error={errors.city} required autoComplete="address-level2" />
              {deliveryMethod !== "pickup" && <>
                <div className="sm:col-span-2"><Field name="address" label="Street address" value={form.address} onChange={changeForm} error={errors.address} required placeholder="Street and building number" autoComplete="street-address" /></div>
                <Field name="postalCode" label="Postal code" value={form.postalCode} onChange={changeForm} error={errors.postalCode} required autoComplete="postal-code" />
                <Field name="apartment" label="Apartment (optional)" value={form.apartment} onChange={changeForm} autoComplete="address-line2" />
                <Field name="entrance" label="Entrance (optional)" value={form.entrance} onChange={changeForm} />
                <Field name="floor" label="Floor (optional)" value={form.floor} onChange={changeForm} />
                <div className="sm:col-span-2"><label htmlFor="deliveryInstructions" className="text-sm font-medium">Delivery instructions (optional)</label><textarea id="deliveryInstructions" name="deliveryInstructions" value={form.deliveryInstructions} onChange={changeForm} rows={3} className={inputClass} placeholder="Anything the courier should know?" /></div>
              </>}
              <div className="sm:col-span-2"><label htmlFor="orderComment" className="text-sm font-medium">Order comment (optional)</label><textarea id="orderComment" name="orderComment" value={form.orderComment} onChange={changeForm} rows={3} className={inputClass} placeholder="Add a note about your order" /></div>
            </div>
          </CardContent></Card>

          <Card className="bg-page"><CardHeader><CardTitle className="font-header text-xl">Payment method</CardTitle></CardHeader><CardContent>
            <fieldset><legend className="sr-only">Choose a payment method</legend><div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map(({ value, label, description }) => <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${paymentMethod === value ? "border-accent bg-stitching-rust/5 ring-2 ring-accent/20" : "border-stitching-wood/50 hover:border-stitching-wood"}`}>
                <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={() => { setPaymentMethod(value); setPaymentNotice(null) }} className="mt-1 size-4 accent-black" /><span><span className="block font-medium">{label}</span><span className="mt-1 block text-xs text-PrimaryText/65">{description}</span></span>
              </label>)}
            </div></fieldset>
            {paymentMethod === "card" && import.meta.env.DEV && <div className="mt-4 rounded-lg border border-dashed border-stitching-wood p-3 text-sm">
              <label htmlFor="cardOutcome" className="block font-medium">Developer testing aid: simulated card outcome</label>
              <select id="cardOutcome" value={cardOutcome} onChange={(event) => setCardOutcome(event.target.value)} className={`${inputClass} max-w-xs`}>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>}
            {paymentNotice && <div role={paymentNotice.type === "failure" ? "alert" : "status"} className={`mt-4 rounded-lg p-4 text-sm ${paymentNotice.type === "failure" ? "border border-red-300 bg-red-50 text-red-800" : "bg-section text-PrimaryText"}`}>
              {paymentNotice.message}
            </div>}
            {pendingOrder && pendingOrder.paymentStatus !== "Paid" && paymentNotice && <Button type="button" onClick={() => payOrder(pendingOrder, paymentMethod)} disabled={isPaying} className="mt-4 bg-stitching-navy text-white">
              {isPaying ? "Retrying payment…" : "Retry payment"}
            </Button>}
          </CardContent></Card>
        </div>

        <Card className="bg-page lg:sticky lg:top-20"><CardHeader><CardTitle className="font-header text-xl">Order summary</CardTitle></CardHeader><CardContent className="space-y-5">
          {normalizedItems.length === 0 ? <div className="rounded-lg bg-section p-4 text-sm"><p className="font-medium">Your bag is empty.</p><p className="mt-1 text-PrimaryText/70">Add a design from the catalog before checking out.</p><Link to="/catalog" className="mt-3 inline-block font-semibold text-stitching-rust underline">Browse the catalog</Link></div> : <ul className="space-y-4">{normalizedItems.map((item) => <li key={item.productId} className="flex gap-3"><img src={item.image} alt={item.name} className="size-16 shrink-0 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="font-medium">{item.name}</p><p className="mt-1 text-sm text-PrimaryText/65">{money(item.price, item.currency)} each</p><div className="mt-2 flex items-center gap-2"><Button type="button" variant="outline" size="sm" aria-label={`Decrease ${item.name} quantity`} onClick={() => decrementCart(item.productId)}>−</Button><span className="min-w-5 text-center text-sm" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span><Button type="button" variant="outline" size="sm" aria-label={`Increase ${item.name} quantity`} onClick={() => addToCart(item)}>+</Button><Button type="button" variant="link" className="ml-auto h-auto px-1 text-red-700" aria-label={`Remove ${item.name} from checkout`} onClick={() => removeFromCart(item.productId)}>Remove</Button></div></div><p className="shrink-0 font-medium">{money(item.price * item.quantity, item.currency)}</p></li>)}</ul>}
          <Separator className="bg-stitching-wood/50" />
          <div className="flex gap-2"><label htmlFor="promoCode" className="sr-only">Promo code</label><input id="promoCode" value={promoInput} onChange={(event) => { setPromoInput(event.target.value); setPromoMessage("") }} placeholder="Promo code" className={`${inputClass} mt-0 min-w-0`} /><Button type="button" onClick={applyPromo} variant="outline" className="border-stitching-wood">Apply</Button></div>
          {promoMessage && <p role="status" className={`text-sm ${promoApplied ? "text-stitching-success" : "text-red-700"}`}>{promoMessage}</p>}
          <dl className="space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{money(subtotal, currency)}</dd></div><div className="flex justify-between gap-4"><dt>Delivery</dt><dd>{deliveryFee === null ? deliveryMethod === "courier" ? "Select a Georgian city" : "To be confirmed" : deliveryFee === 0 ? "Free" : money(deliveryFee, currency)}</dd></div>{promoApplied && <div className="flex justify-between gap-4 text-stitching-success"><dt>Discount (SAVE10)</dt><dd>−{money(discount, currency)}</dd></div>}<Separator className="bg-stitching-wood/50" /><div className="flex justify-between gap-4 text-base font-semibold"><dt>{deliveryFee === null ? "Items total" : "Total"}</dt><dd>{money(total, currency)}</dd></div></dl>
          <Button type="submit" disabled={isPaying || normalizedItems.length === 0 || pendingOrder?.paymentStatus === "Paid"} className="w-full bg-stitching-navy py-3 text-white hover:bg-stitching-navy/90">{isPaying ? "Processing payment…" : pendingOrder ? "Continue with this order" : "Place order"}</Button>
          <p className="text-center text-xs text-PrimaryText/60">Your order will be confirmed on the next page.</p>
        </CardContent></Card>
      </form>
    </main>
  </PageWrapper>
}
