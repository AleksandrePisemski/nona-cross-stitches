import { Link, useLocation } from "react-router"
import { useState } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import NavBar from "../components/layout/NavBar"
import PageWrapper from "../components/layout/PageWrapper"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { DELIVERY_METHODS, PAYMENT_METHODS } from "./DeliveryAndPayment.jsx"
import { createIdempotencyKey, paymentProviders } from "../lib/paymentProviders.js"

const LAST_ORDER_KEY = "lastOrder"
const WEBHOOK_EVENTS = [
  "payment.succeeded",
  "payment.failed",
  "payment.cancelled",
  "payment.refunded",
  "payment.partially_refunded",
]

function readSavedOrder() {
  try {
    return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null")
  } catch {
    return null
  }
}

function createEventId() {
  return `webhook-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
}

function money(value) {
  if (value == null) return "To be confirmed"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "GEL" }).format(Number(value) || 0)
}

export default function OrderConfirmation() {
  const { state } = useLocation()
  const [order, setOrder] = useState(() => state?.orderRef ? state : readSavedOrder())
  const [simulatorOpen, setSimulatorOpen] = useState(false)
  const [lastWebhook, setLastWebhook] = useState(() => state?.lastWebhookEvent ?? readSavedOrder()?.lastWebhookEvent ?? null)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentNotice, setPaymentNotice] = useState("")

  function persistOrder(nextOrder) {
    setOrder(nextOrder)
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(nextOrder))
    } catch {
      // Keep the current confirmation view usable when storage is unavailable.
    }
  }

  function triggerWebhook(eventType, replay = false) {
    const event = replay && lastWebhook
      ? lastWebhook
      : {
          eventId: createEventId(),
          idempotencyKey: createIdempotencyKey(),
          eventType,
          timestamp: new Date().toISOString(),
        }
    const savedOrder = readSavedOrder()
    const latestOrder = savedOrder?.orderRef === order?.orderRef ? savedOrder : order
    const processedWebhookIds = latestOrder?.processedWebhookIds ?? []
    if (processedWebhookIds.includes(event.eventId)) {
      console.info("duplicate webhook ignored", event.eventId)
      return
    }

    const eventUpdates = {
      "payment.succeeded": { paymentStatus: "Paid", orderStatus: "processing" },
      "payment.failed": { paymentStatus: "Failed", orderStatus: "pending" },
      "payment.cancelled": { paymentStatus: "Cancelled", orderStatus: "pending" },
      "payment.refunded": { paymentStatus: "Refunded", orderStatus: "refunded" },
      "payment.partially_refunded": { paymentStatus: "Partially refunded", orderStatus: "processing" },
    }
    const updates = eventUpdates[event.eventType]
    if (!updates) return
    setLastWebhook(event)
    setPaymentNotice("")
    persistOrder({
      ...latestOrder,
      ...updates,
      processedWebhookIds: [...processedWebhookIds, event.eventId],
      lastWebhookEvent: event,
    })
  }

  async function retryPayment() {
    if (!order || isPaying || order.paymentStatus === "Paid") return
    const provider = paymentProviders[order.paymentMethod]
    if (!provider) return
    setIsPaying(true)
    setPaymentNotice("")
    const idempotencyKey = createIdempotencyKey()
    try {
      const result = await provider(order, { idempotencyKey })
      const updatedOrder = {
        ...order,
        paymentStatus: result.status,
        orderStatus: result.status === "Paid" ? "processing" : "pending",
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
      persistOrder(updatedOrder)
      if (result.status === "Failed") setPaymentNotice(result.reason ?? "Your payment could not be completed. Please try again.")
      else if (result.status === "Cancelled") setPaymentNotice("Payment was cancelled. You can retry or choose another payment method.")
    } catch (error) {
      setPaymentNotice(error?.message ?? "The payment provider could not be reached. Please try again.")
    } finally {
      setIsPaying(false)
    }
  }

  if (!order?.orderRef) return <PageWrapper><NavBar /><main className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-PrimaryText"><Card className="bg-page"><CardHeader><CardTitle className="font-header text-2xl">No order found</CardTitle></CardHeader><CardContent className="space-y-4"><p>This confirmation page needs an order from checkout. You can start a new order from the catalog.</p><Link to="/catalog" className="inline-flex h-9 items-center rounded-lg bg-stitching-navy px-4 text-sm font-medium text-white">Browse the catalog</Link></CardContent></Card></main></PageWrapper>

  const fullName = `${order.customer.firstName} ${order.customer.lastName}`.trim()
  const deliveryLabel = DELIVERY_METHODS.find((method) => method.value === order.delivery.method)?.label ?? "Delivery"
  const paymentLabel = PAYMENT_METHODS.find((method) => method.value === order.paymentMethod)?.label ?? "Payment method to be confirmed"
  const totalLabel = order.total == null
    ? "Total to be confirmed"
    : order.paymentStatus === "Paid"
      ? "Total paid"
      : "Order total"
  return <PageWrapper>
    <NavBar />
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-24 text-PrimaryText sm:px-6">
      <header className="mb-8 text-center"><CheckCircleIcon className="mx-auto size-14 text-stitching-success" aria-hidden="true" /><p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-stitching-success">Order confirmed</p><h1 className="mt-2 font-header text-3xl font-semibold sm:text-4xl">Thank you, {order.customer.firstName}!</h1><p className="mt-3 text-PrimaryText/70">We’ve received your order and sent the details to {order.customer.email}.</p><p className="mt-2 text-sm font-semibold">Order reference: <span className="text-stitching-rust">{order.orderRef}</span></p></header>
      <div className="mb-6 rounded-lg bg-section p-4 text-sm">
        <p><span className="font-semibold">Payment status:</span> {order.paymentStatus ?? "Pending"}</p>
        <p className="mt-1"><span className="font-semibold">Order status:</span> {order.orderStatus ?? "pending"}</p>
      </div>
      {order.paymentStatus === "Failed" && <div role="alert" className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">Payment failed.</p>
        <p className="mt-1">Your order is saved, but payment was not completed.</p>
        <Button type="button" onClick={retryPayment} disabled={isPaying || order.paymentStatus === "Paid"} className="mt-3 bg-red-800 text-white hover:bg-red-900">{isPaying ? "Retrying payment…" : "Retry payment"}</Button>
      </div>}
      {paymentNotice && <div role="alert" className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">{paymentNotice}</div>}
      {order.paymentStatus === "Cancelled" && <div role="status" className="mb-6 rounded-lg bg-section p-4 text-sm">Payment was cancelled. Your order is still saved. You can retry payment.<Button type="button" onClick={retryPayment} disabled={isPaying || order.paymentStatus === "Paid"} className="ml-3 bg-stitching-navy text-white">{isPaying ? "Retrying payment…" : "Retry payment"}</Button></div>}
      {order.paymentDetails && order.paymentMethod === "bank-transfer" && <Card className="mb-6 bg-page">
        <CardHeader><CardTitle className="font-header text-xl">Bank transfer instructions</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-semibold">Bank:</span> {order.paymentDetails.bankName}</p>
          <p><span className="font-semibold">Beneficiary:</span> {order.paymentDetails.beneficiary}</p>
          <p><span className="font-semibold">IBAN:</span> {order.paymentDetails.iban}</p>
          <p><span className="font-semibold">Payment reference / memo:</span> {order.paymentDetails.memo}</p>
          <p className="rounded bg-section p-3 text-PrimaryText/75">Placeholder bank details for development. Replace them with the store's verified bank account before accepting transfers.</p>
        </CardContent>
      </Card>}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-page"><CardHeader><CardTitle className="font-header text-xl">Delivery details</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p className="font-medium">{fullName}</p><p>{order.customer.phone}</p><Separator className="bg-stitching-wood/50" /><p className="font-medium">{deliveryLabel}</p>{order.delivery.method === "pickup" ? <><p>{order.delivery.pickupLocation}</p><p className="text-PrimaryText/70">{order.delivery.pickupHours}</p></> : <p>{[order.delivery.address, order.delivery.apartment && `Apt. ${order.delivery.apartment}`, order.delivery.city, order.delivery.postalCode, order.delivery.country].filter(Boolean).join(", ")}</p>}{order.delivery.instructions && <p className="text-PrimaryText/70">Delivery note: {order.delivery.instructions}</p>}{order.deliveryFee == null && <p className="rounded bg-section p-3 text-PrimaryText/75">Shipping cost will be confirmed before dispatch. The amount below excludes shipping.</p>}<p className="pt-1 text-PrimaryText/70">Payment: {paymentLabel}</p></CardContent></Card>
        <Card className="bg-page"><CardHeader><CardTitle className="font-header text-xl">Items ordered</CardTitle></CardHeader><CardContent className="space-y-4"><ul className="space-y-4">{order.items.map((item) => <li key={item.productId} className="flex items-center gap-3"><img src={item.image} alt={item.name} className="size-14 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-PrimaryText/65">Qty: {item.quantity}</p></div><p className="font-medium">{money(item.price * item.quantity, item.currency)}</p></li>)}</ul><Separator className="bg-stitching-wood/50" /><dl className="space-y-2 text-sm"><div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{money(order.subtotal, order.currency)}</dd></div><div className="flex justify-between gap-4"><dt>Delivery</dt><dd>{order.deliveryFee == null ? "To be confirmed" : order.deliveryFee === 0 ? "Free" : money(order.deliveryFee, order.currency)}</dd></div>{order.discount > 0 && <div className="flex justify-between gap-4 text-stitching-success"><dt>Discount</dt><dd>−{money(order.discount, order.currency)}</dd></div>}<Separator className="bg-stitching-wood/50" /><div className="flex justify-between gap-4 text-base font-semibold"><dt>{totalLabel}</dt><dd>{money(order.total, order.currency)}</dd></div></dl></CardContent></Card>
      </div>
      <Card className="mt-6 bg-page">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="font-header text-xl">Developer / Webhook Simulator</CardTitle>
          <Button type="button" variant="outline" aria-expanded={simulatorOpen} onClick={() => setSimulatorOpen((open) => !open)}>
            {simulatorOpen ? "Hide simulator" : "Show simulator"}
          </Button>
        </CardHeader>
        {simulatorOpen && <CardContent className="space-y-4">
          <p className="text-sm text-PrimaryText/70">Simulate provider callbacks. Each new event gets an event ID and idempotency key; duplicate event IDs are ignored.</p>
          <div className="flex flex-wrap gap-2">
            {WEBHOOK_EVENTS.map((eventType) => <Button key={eventType} type="button" variant="outline" onClick={() => triggerWebhook(eventType)}>
              {eventType}
            </Button>)}
          </div>
          <Button type="button" variant="secondary" disabled={!lastWebhook} onClick={() => triggerWebhook(lastWebhook?.eventType, true)}>
            Replay last webhook (duplicate test)
          </Button>
          {lastWebhook && <p className="break-all text-xs text-PrimaryText/65">Last event: {lastWebhook.eventType} · eventId: {lastWebhook.eventId} · idempotencyKey: {lastWebhook.idempotencyKey}</p>}
          <p className="text-xs text-PrimaryText/65" aria-live="polite">
            Processed webhook events: {order.processedWebhookIds?.length ?? 0}
          </p>
          {order.paymentAttempts?.length > 0 && <div>
            <h3 className="mb-2 text-sm font-semibold">Payment attempts</h3>
            <ul className="space-y-1 text-xs text-PrimaryText/70">
              {order.paymentAttempts.map((attempt) => <li key={attempt.attemptId}>
                {attempt.status} · {attempt.timestamp} · {attempt.idempotencyKey}
              </li>)}
            </ul>
          </div>}
        </CardContent>}
      </Card>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button render={<Link to="/catalog" />} className="bg-stitching-navy text-white hover:bg-stitching-navy/90">Continue shopping</Button><Button render={<Link to="/checkout" />} variant="outline" className="border-stitching-wood">Start a new order</Button></div>
    </main>
  </PageWrapper>
}
