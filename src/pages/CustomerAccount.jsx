import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router"
import { ArrowLeftIcon, MapPinIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import NavBar from "../components/layout/NavBar"
import PageWrapper from "../components/layout/PageWrapper"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useCustomerAccount } from "../context/CustomerAccountContext.jsx"

const inputClass = "mt-1 w-full rounded-lg border border-stitching-wood/60 bg-page px-3 py-2.5 text-sm text-PrimaryText outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"

function AccountField({ label, name, value, onChange, type = "text", required = false, autoComplete }) {
  return <label className="block text-sm font-medium">{label}{required && " *"}<input className={inputClass} name={name} type={type} value={value ?? ""} onChange={onChange} required={required} autoComplete={autoComplete} /></label>
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "GEL" }).format(Number(value) || 0)
}

function AuthPanel() {
  const { login, register, resetPassword } = useCustomerAccount()
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "" })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  function submit(event) {
    event.preventDefault()
    setError("")
    setMessage("")
    let result
    if (mode === "login") {
      result = login(form.email, form.password)
    } else if (mode === "register") {
      if (form.password.length < 6) return setError("Use a password with at least 6 characters.")
      if (form.password !== form.confirmPassword) return setError("The passwords do not match.")
      result = register(form)
    } else {
      if (form.password.length < 6) return setError("Use a password with at least 6 characters.")
      if (form.password !== form.confirmPassword) return setError("The passwords do not match.")
      result = resetPassword(form.email, form.password)
    }
    if (result?.ok) {
      if (mode === "reset") setMessage("Password updated for this local demo account. You are now signed in.")
      else setMessage(mode === "register" ? "Account created." : "Signed in.")
    } else setError(result?.message ?? "Please check your details and try again.")
  }

  const heading = mode === "login" ? "Sign in" : mode === "register" ? "Create an account" : "Reset password"
  return <Card className="bg-page">
    <CardHeader><CardTitle className="font-header text-2xl">{heading}</CardTitle><p className="text-sm text-PrimaryText/70">Guest checkout is always available. An account is optional.</p><p className="rounded-lg bg-section p-3 text-xs text-PrimaryText/70">Demo accounts and passwords are stored in this browser only. This is not secure authentication; do not reuse a real password.</p></CardHeader>
    <CardContent>
      <form className="space-y-4" onSubmit={submit}>
        {mode === "register" && <div className="grid gap-4 sm:grid-cols-2"><AccountField label="First name" name="firstName" value={form.firstName} onChange={change} required autoComplete="given-name" /><AccountField label="Last name" name="lastName" value={form.lastName} onChange={change} required autoComplete="family-name" /><div className="sm:col-span-2"><AccountField label="Phone" name="phone" value={form.phone} onChange={change} type="tel" autoComplete="tel" /></div></div>}
        <AccountField label="Email" name="email" value={form.email} onChange={change} type="email" required autoComplete="email" />
        <AccountField label={mode === "reset" ? "New password" : "Password"} name="password" value={form.password} onChange={change} type="password" required autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {(mode === "register" || mode === "reset") && <AccountField label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={change} type="password" required autoComplete="new-password" />}
        {mode === "reset" && <p className="rounded-lg bg-section p-3 text-xs text-PrimaryText/70">This frontend demo cannot send email. Reset changes the password stored in this browser only.</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-stitching-success">{message}</p>}
        <Button type="submit" className="w-full bg-stitching-navy text-white hover:bg-stitching-navy/90">{heading}</Button>
      </form>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {mode !== "login" && <button type="button" className="underline underline-offset-4" onClick={() => { setMode("login"); setError(""); setMessage("") }}>Sign in</button>}
        {mode !== "register" && <button type="button" className="underline underline-offset-4" onClick={() => { setMode("register"); setError(""); setMessage("") }}>Create account</button>}
        {mode !== "reset" && <button type="button" className="underline underline-offset-4" onClick={() => { setMode("reset"); setError(""); setMessage("") }}>Forgot password?</button>}
      </div>
    </CardContent>
  </Card>
}

function AccountDashboard() {
  const { currentUser, logout, updateProfile, addAddress, updateAddress, removeAddress } = useCustomerAccount()
  const [section, setSection] = useState("profile")
  const [profile, setProfile] = useState(currentUser.profile)
  const [addressForm, setAddressForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => setProfile(currentUser.profile), [currentUser])

  function saveProfile(event) {
    event.preventDefault()
    const result = updateProfile(profile)
    setMessage(result?.ok ? "Personal information saved." : result?.message ?? "Could not save profile.")
  }

  function beginAddress(address = null) {
    setEditingId(address?.id ?? null)
    setAddressForm(address ? { ...address } : { label: "Home", fullName: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`.trim(), phone: currentUser.profile.phone ?? "", address: "", apartment: "", city: "", country: "Georgia", postalCode: "", isDefault: currentUser.addresses.length === 0 })
  }

  function saveAddress(event) {
    event.preventDefault()
    if (editingId) updateAddress(editingId, addressForm)
    else addAddress(addressForm)
    setAddressForm(null)
    setEditingId(null)
  }

  const tabs = [["profile", "Personal information"], ["addresses", "Saved addresses"], ["orders", "Previous orders"]]
  return <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
    <Card className="bg-page"><CardContent className="p-3">
      <div className="flex items-center gap-3 border-b border-stitching-wood/40 p-3"><UserCircleIcon className="size-9 text-stitching-rust" /><div className="min-w-0"><p className="truncate font-semibold">{currentUser.profile.firstName} {currentUser.profile.lastName}</p><p className="truncate text-xs text-PrimaryText/65">{currentUser.profile.email}</p></div></div>
      <nav className="mt-2 grid gap-1" aria-label="Account sections">{tabs.map(([id, label]) => <button key={id} type="button" onClick={() => { setSection(id); setMessage("") }} className={`rounded-lg px-3 py-2 text-left text-sm ${section === id ? "bg-stitching-navy text-white" : "hover:bg-section"}`}>{label}</button>)}</nav>
      <Button type="button" variant="outline" className="mt-4 w-full" onClick={logout}>Log out</Button>
    </CardContent></Card>

    {section === "profile" && <Card className="bg-page"><CardHeader><CardTitle className="font-header text-2xl">Personal information</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={saveProfile}><div className="grid gap-4 sm:grid-cols-2"><AccountField label="First name" name="firstName" value={profile.firstName} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} required /><AccountField label="Last name" name="lastName" value={profile.lastName} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} required /><AccountField label="Email" name="email" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /><AccountField label="Phone" name="phone" type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></div>{message && <p role="status" className="text-sm text-stitching-success">{message}</p>}<Button type="submit" className="bg-stitching-navy text-white">Save changes</Button></form></CardContent></Card>}

    {section === "addresses" && <Card className="bg-page"><CardHeader className="flex flex-row items-center justify-between gap-4"><CardTitle className="font-header text-2xl">Saved addresses</CardTitle><Button type="button" onClick={() => beginAddress()} className="bg-stitching-navy text-white">Add address</Button></CardHeader><CardContent className="space-y-4">
      {!currentUser.addresses.length && !addressForm && <p className="text-sm text-PrimaryText/70">Save an address to use it during checkout.</p>}
      {currentUser.addresses.map((address) => <article key={address.id} className="rounded-xl border border-stitching-wood/50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><MapPinIcon className="mt-1 size-5 shrink-0 text-stitching-rust" /><div><p className="font-semibold">{address.label}{address.isDefault && <span className="ml-2 rounded-full bg-stitching-sage/30 px-2 py-0.5 text-xs">Default</span>}</p><p className="mt-1 text-sm">{address.fullName} · {address.phone}</p><p className="text-sm text-PrimaryText/70">{[address.address, address.apartment, address.city, address.postalCode, address.country].filter(Boolean).join(", ")}</p></div></div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => beginAddress(address)}>Edit</Button>{!address.isDefault && <Button type="button" variant="outline" size="sm" onClick={() => updateAddress(address.id, { isDefault: true })}>Set default</Button>}<Button type="button" variant="outline" size="sm" onClick={() => removeAddress(address.id)}>Remove</Button></div></div></article>)}
      {addressForm && <form onSubmit={saveAddress} className="grid gap-4 rounded-xl border border-stitching-wood/50 p-4 sm:grid-cols-2"><AccountField label="Label" name="label" value={addressForm.label} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} required /><AccountField label="Recipient name" name="fullName" value={addressForm.fullName} onChange={(event) => setAddressForm({ ...addressForm, fullName: event.target.value })} required /><AccountField label="Phone" name="phone" type="tel" value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} required /><AccountField label="Country" name="country" value={addressForm.country} onChange={(event) => setAddressForm({ ...addressForm, country: event.target.value })} required /><AccountField label="Street address" name="address" value={addressForm.address} onChange={(event) => setAddressForm({ ...addressForm, address: event.target.value })} required /><AccountField label="Apartment / unit" name="apartment" value={addressForm.apartment} onChange={(event) => setAddressForm({ ...addressForm, apartment: event.target.value })} /><AccountField label="City" name="city" value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} required /><AccountField label="Postal code" name="postalCode" value={addressForm.postalCode} onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })} required /><label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={Boolean(addressForm.isDefault)} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} /> Make this my default address</label><div className="sm:col-span-2 flex gap-2"><Button type="submit" className="bg-stitching-navy text-white">Save address</Button><Button type="button" variant="outline" onClick={() => setAddressForm(null)}>Cancel</Button></div></form>}
    </CardContent></Card>}

    {section === "orders" && <Card className="bg-page"><CardHeader><CardTitle className="font-header text-2xl">Previous orders</CardTitle></CardHeader><CardContent className="space-y-3">{currentUser.orders.length === 0 ? <p className="text-sm text-PrimaryText/70">Orders placed while signed in will appear here.</p> : currentUser.orders.map((order) => <Link key={order.orderRef} to={`/account/orders/${encodeURIComponent(order.orderRef)}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stitching-wood/50 p-4 hover:bg-section"><span><span className="block font-semibold">{order.orderRef}</span><span className="text-sm text-PrimaryText/70">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length ?? 0} product types</span></span><span className="text-right"><span className="block font-semibold">{order.total == null ? "To be confirmed" : money(order.total)}</span><span className="text-sm capitalize text-PrimaryText/70">{order.orderStatus ?? "pending"}</span></span></Link>)}</CardContent></Card>}
  </div>
}

function OrderDetails({ orderRef }) {
  const { currentUser } = useCustomerAccount()
  const order = currentUser.orders.find((saved) => saved.orderRef === orderRef)
  if (!order) return <Card className="bg-page"><CardContent className="p-6"><p>This order is not in your account.</p><Link className="mt-3 inline-block underline" to="/account">Back to account</Link></CardContent></Card>
  return <Card className="bg-page"><CardHeader><Button render={<Link to="/account" />} variant="link" className="mb-2 w-fit px-0"><ArrowLeftIcon className="size-4" /> Back to account</Button><CardTitle className="font-header text-2xl">Order {order.orderRef}</CardTitle><p className="text-sm capitalize text-PrimaryText/70">{order.orderStatus ?? "pending"} · {order.paymentStatus ?? "Pending"}</p></CardHeader><CardContent className="space-y-5"><div className="divide-y divide-stitching-wood/40">{(order.items ?? []).map((item) => <div key={item.productId} className="flex items-center gap-3 py-3"><img src={item.image} alt={item.name} className="size-14 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-PrimaryText/65">Quantity: {item.quantity}</p></div><p className="font-semibold">{money(item.price * item.quantity)}</p></div>)}</div><dl className="space-y-2 border-t border-stitching-wood/50 pt-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div><div className="flex justify-between"><dt>Delivery</dt><dd>{order.deliveryFee == null ? "To be confirmed" : money(order.deliveryFee)}</dd></div>{order.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{money(order.discount)}</dd></div>}<div className="flex justify-between border-t border-stitching-wood/40 pt-2 text-base font-semibold"><dt>Total</dt><dd>{order.total == null ? "To be confirmed" : money(order.total)}</dd></div></dl><div className="rounded-lg bg-section p-4 text-sm"><p className="font-semibold">Delivery details</p><p className="mt-1">{order.customer.firstName} {order.customer.lastName}</p><p>{order.delivery.address}{order.delivery.apartment ? `, ${order.delivery.apartment}` : ""}, {order.delivery.city}, {order.delivery.country}</p></div></CardContent></Card>
}

export default function CustomerAccount() {
  const { currentUser } = useCustomerAccount()
  const { orderRef } = useParams()
  if (!currentUser && orderRef) return <Navigate to="/account" replace />
  return <PageWrapper><NavBar /><main className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-24 text-PrimaryText sm:px-6"><header><p className="text-sm font-medium uppercase tracking-[0.16em] text-stitching-rust">Customer account</p><h1 className="mt-2 font-header text-3xl font-semibold sm:text-4xl">{orderRef ? "Order details" : currentUser ? "Your account" : "Sign in or create an account"}</h1></header>{currentUser ? orderRef ? <OrderDetails orderRef={orderRef} /> : <AccountDashboard /> : <AuthPanel />}</main></PageWrapper>
}
